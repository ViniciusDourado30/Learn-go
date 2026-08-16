import React, { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useDisponibilidade, useSalvarDisponibilidade } from "../hooks/useDashboard";
import {
  Clock, Save, Plus, Trash2, Settings2, Info, CalendarClock,
  Sun, Moon, Coffee, Copy, Check, RotateCcw, Zap,
} from "lucide-react";
import { Button, Switch } from "../components/ui/nextui-shim";
import { motion, AnimatePresence } from "framer-motion";

type TimeSlot = { id: string; start: string; end: string };
type DaySchedule = { active: boolean; slots: TimeSlot[] };
type WeeklySchedule = { [key: string]: DaySchedule };

const DAYS_OF_WEEK = [
  { key: "sun", label: "Domingo", short: "Dom", emoji: "D", index: 0 },
  { key: "mon", label: "Segunda-feira", short: "Seg", emoji: "S", index: 1 },
  { key: "tue", label: "Terça-feira", short: "Ter", emoji: "T", index: 2 },
  { key: "wed", label: "Quarta-feira", short: "Qua", emoji: "Q", index: 3 },
  { key: "thu", label: "Quinta-feira", short: "Qui", emoji: "Q", index: 4 },
  { key: "fri", label: "Sexta-feira", short: "Sex", emoji: "S", index: 5 },
  { key: "sat", label: "Sábado", short: "Sáb", emoji: "S", index: 6 },
];

const PRESETS = [
  { label: "Manhã", icon: Sun, start: "08:00", end: "12:00", color: "#fbbf24" },
  { label: "Tarde", icon: Coffee, start: "13:00", end: "18:00", color: "#f97316" },
  { label: "Noite", icon: Moon, start: "18:00", end: "22:00", color: "#7c3aed" },
];

const getEmptySchedule = (): WeeklySchedule => ({
  mon: { active: false, slots: [] }, tue: { active: false, slots: [] },
  wed: { active: false, slots: [] }, thu: { active: false, slots: [] },
  fri: { active: false, slots: [] }, sat: { active: false, slots: [] }, sun: { active: false, slots: [] }
});

export const DashboardSchedule = () => {
  const { data: apiSchedule, isLoading } = useDisponibilidade();
  const { mutate: salvarDisp, isPending } = useSalvarDisponibilidade();

  const [duration, setDuration] = useState("60");
  const [interval, setIntervalVal] = useState("0");
  const [schedule, setSchedule] = useState<WeeklySchedule>(getEmptySchedule());
  const [saved, setSaved] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    if (apiSchedule) {
      setDuration(String(apiSchedule.duracao_aula || 60));
      setIntervalVal(String(apiSchedule.intervalo_aula || 0));
      
      if (apiSchedule.horarios_configurados && apiSchedule.horarios_configurados.length > 0) {
        const newSchedule = getEmptySchedule();
        apiSchedule.horarios_configurados.forEach((b: any) => {
          const dayConfig = DAYS_OF_WEEK.find(d => d.index === b.dia_semana);
          if (dayConfig) {
            newSchedule[dayConfig.key].active = true;
            newSchedule[dayConfig.key].slots.push({
              id: Math.random().toString(),
              start: b.hora_inicio,
              end: b.hora_fim
            });
          }
        });
        setSchedule(newSchedule);
      }
    }
  }, [apiSchedule]);

  const toggleDay = (dayKey: string) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        active: !prev[dayKey].active,
        slots: !prev[dayKey].active && prev[dayKey].slots.length === 0 ? [{ id: Math.random().toString(), start: "09:00", end: "17:00" }] : prev[dayKey].slots,
      },
    }));
  };

  const addSlot = (dayKey: string) => {
    setSchedule((prev) => ({ ...prev, [dayKey]: { ...prev[dayKey], slots: [...prev[dayKey].slots, { id: Math.random().toString(), start: "09:00", end: "17:00" }] } }));
  };

  const removeSlot = (dayKey: string, slotId: string) => {
    setSchedule((prev) => ({ ...prev, [dayKey]: { ...prev[dayKey], slots: prev[dayKey].slots.filter((s) => s.id !== slotId) } }));
  };

  const updateSlot = (dayKey: string, slotId: string, field: "start" | "end", value: string) => {
    setSchedule((prev) => ({ ...prev, [dayKey]: { ...prev[dayKey], slots: prev[dayKey].slots.map((s) => (s.id === slotId ? { ...s, [field]: value } : s)) } }));
  };

  const applyPreset = (dayKey: string, preset: typeof PRESETS[0]) => {
    setSchedule((prev) => ({ ...prev, [dayKey]: { active: true, slots: [...prev[dayKey].slots, { id: Math.random().toString(), start: preset.start, end: preset.end }] } }));
  };

  const copyToAll = (sourceDayKey: string) => {
    const source = schedule[sourceDayKey];
    setSchedule((prev) => {
      const next = { ...prev };
      DAYS_OF_WEEK.forEach((d) => {
        if (d.key !== sourceDayKey) next[d.key] = { active: source.active, slots: source.slots.map((s) => ({ ...s, id: Math.random().toString() })) };
      });
      return next;
    });
  };

  const handleSave = () => {
    const dto = {
      duracao_aula: Number(duration),
      intervalo_aula: Number(interval),
      dias: Object.entries(schedule)
        .filter(([_, data]) => data.active && data.slots.length > 0)
        .map(([key, data]) => {
           const dayMap: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
           return {
             dia_semana: dayMap[key],
             blocos: data.slots.map(s => ({ hora_inicio: s.start, hora_fim: s.end, preco: 100 })) // TODO: Mudar 100 se quiser preco variável
           };
        })
    };

    salvarDisp(dto, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  };

  const activeDays = DAYS_OF_WEEK.filter((d) => schedule[d.key].active).length;
  const totalSlots = Object.values(schedule).reduce((a, d) => a + d.slots.length, 0);
  const totalHours = Object.values(schedule).reduce((a, d) => {
    return a + d.slots.reduce((acc, s) => {
      const [sh, sm] = s.start.split(":").map(Number);
      const [eh, em] = s.end.split(":").map(Number);
      return acc + (eh + em / 60) - (sh + sm / 60);
    }, 0);
  }, 0);

  if (isLoading) return <DashboardLayout><div className="p-10 text-center text-zinc-500">Carregando configurações...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="pb-10">
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 100%)" }}>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,111,238,0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />
          <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />

          <div className="relative z-10 max-w-[1000px] mx-auto px-5 md:px-8 py-8 md:py-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,111,238,0.15)" }}>
                    <CalendarClock size={18} className="text-[#60a5fa]" />
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>Configuração de horários</span>
                </div>
                <h1 className="text-[26px] md:text-[30px] mb-1" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.02em" }}>Disponibilidade</h1>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>Configure quando seus alunos podem agendar aulas com você.</p>

                <div className="flex items-center gap-3 mt-5">
                  {[
                    { label: "Dias ativos", value: activeDays, color: "#60a5fa" },
                    { label: "Blocos", value: totalSlots, color: "#34d399" },
                    { label: "Horas/sem", value: `${Math.round(totalHours)}h`, color: "#fbbf24" },
                    { label: "Duração", value: `${duration}min`, color: "#c084fc" },
                  ].map((s) => (
                    <div key={s.label} className="px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-[15px] leading-none" style={{ color: s.color, fontWeight: 700 }}>{s.value}</p>
                      <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="bordered" size="sm" className="text-[12px] border-white/10 text-white/50 hover:text-white"
                  startContent={<RotateCcw size={13} />} onPress={() => setSchedule(getEmptySchedule())}>
                  Resetar
                </Button>
                <Button color="primary" size="sm" className="text-[12px] px-5" style={{ fontWeight: 600 }}
                  isLoading={isPending} startContent={!isPending && (saved ? <Check size={14} /> : <Save size={14} />)}
                  onPress={handleSave}>
                  {saved ? "Salvo!" : "Salvar"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto px-5 md:px-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-4 space-y-5">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-5" style={{ border: "1px solid #f4f4f5" }}>
                <h2 className="text-[14px] flex items-center gap-2 mb-4" style={{ color: "#09090b", fontWeight: 700 }}>
                  <Settings2 size={16} className="text-zinc-400" /> Regras da aula
                </h2>

                <div className="space-y-4">
                  {[
                    { label: "Duração da aula", value: duration, set: setDuration, opts: [{ v: "30", l: "30 minutos" }, { v: "45", l: "45 minutos" }, { v: "60", l: "1 hora" }, { v: "90", l: "1h 30min" }] },
                    { label: "Intervalo entre aulas", value: interval, set: setIntervalVal, opts: [{ v: "0", l: "Sem intervalo" }, { v: "10", l: "10 min" }, { v: "15", l: "15 min" }, { v: "30", l: "30 min" }] },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="block text-[12px] mb-2" style={{ color: "#3f3f46", fontWeight: 600 }}>{f.label}</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {f.opts.map((o) => (
                          <button key={o.v} onClick={() => f.set(o.v)} className="py-2 rounded-xl text-[12px] transition-all"
                            style={{ background: f.value === o.v ? "#006FEE" : "white", color: f.value === o.v ? "white" : "#3f3f46", border: f.value === o.v ? "2px solid #006FEE" : "1px solid #e4e4e7", fontWeight: f.value === o.v ? 700 : 500 }}>
                            {o.l}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-3 rounded-xl flex items-start gap-2" style={{ background: "#eff6ff", border: "1px solid #dbeafe" }}>
                  <Info size={14} className="text-[#006FEE] shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed" style={{ color: "#006FEE" }}>Alunos só podem agendar nos horários configurados aqui. As alterações refletem imediatamente no seu perfil.</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl p-5" style={{ border: "1px solid #f4f4f5" }}>
                <h2 className="text-[14px] flex items-center gap-2 mb-4" style={{ color: "#09090b", fontWeight: 700 }}>
                  <Zap size={16} className="text-amber-400" /> Presets rápidos
                </h2>
                <p className="text-[11px] mb-4" style={{ color: "#a1a1aa" }}>Selecione um dia acima e clique no preset para adicionar.</p>

                <div className="space-y-2">
                  {PRESETS.map((preset) => (
                    <button key={preset.label} disabled={!selectedDay} onClick={() => selectedDay && applyPreset(selectedDay, preset)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                      style={{ border: "1px solid #f4f4f5", opacity: selectedDay ? 1 : 0.4, cursor: selectedDay ? "pointer" : "not-allowed", background: "white" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${preset.color}15` }}>
                        <preset.icon size={15} style={{ color: preset.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px]" style={{ color: "#09090b", fontWeight: 600 }}>{preset.label}</p>
                        <p className="text-[10px]" style={{ color: "#a1a1aa" }}>{preset.start} – {preset.end}</p>
                      </div>
                      <Plus size={14} className="text-zinc-300" />
                    </button>
                  ))}
                </div>

                {selectedDay && (
                  <div className="mt-3 text-[10px] text-center" style={{ color: "#006FEE", fontWeight: 600 }}>
                    Aplicando em: {DAYS_OF_WEEK.find(d => d.key === selectedDay)?.label}
                  </div>
                )}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="lg:col-span-8 bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #f4f4f5" }}>

              <div className="px-5 pt-5 pb-0">
                <h2 className="text-[14px] flex items-center gap-2 mb-4" style={{ color: "#09090b", fontWeight: 700 }}>
                  <Clock size={16} className="text-zinc-400" /> Horários por dia
                </h2>
                <div className="flex gap-1.5 overflow-x-auto pb-3 -mx-1 px-1">
                  {DAYS_OF_WEEK.map((d) => {
                    const dayData = schedule[d.key];
                    const isSelected = selectedDay === d.key;
                    return (
                      <button key={d.key} onClick={() => setSelectedDay(isSelected ? null : d.key)}
                        className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all shrink-0 relative"
                        style={{ background: isSelected ? "#006FEE" : dayData.active ? "#fafafa" : "transparent", border: isSelected ? "2px solid #006FEE" : dayData.active ? "1px solid #e4e4e7" : "1px solid #f4f4f5", minWidth: 52 }}>
                        <span className="text-[10px]" style={{ color: isSelected ? "rgba(255,255,255,0.7)" : "#a1a1aa", fontWeight: 600 }}>{d.short}</span>
                        <span className="text-[13px]" style={{ color: isSelected ? "white" : dayData.active ? "#09090b" : "#d4d4d8", fontWeight: 700 }}>{d.emoji}</span>
                        {dayData.active && !isSelected && <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#17c964" }} />}
                        {isSelected && dayData.active && <div className="w-1.5 h-1.5 rounded-full bg-white/60" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px" style={{ background: "#f4f4f5" }} />

              <div className="p-5">
                <AnimatePresence mode="wait">
                  {!selectedDay ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center">
                      <CalendarClock size={36} className="text-zinc-200 mx-auto mb-3" />
                      <p className="text-[14px] mb-1" style={{ color: "#71717a", fontWeight: 600 }}>Selecione um dia</p>
                      <p className="text-[12px]" style={{ color: "#a1a1aa" }}>Clique em um dia acima para configurar os horários.</p>
                    </motion.div>
                  ) : (
                    <motion.div key={selectedDay} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      {(() => {
                        const day = DAYS_OF_WEEK.find(d => d.key === selectedDay)!;
                        const dayData = schedule[selectedDay];
                        return (
                          <div>
                            <div className="flex items-center justify-between mb-5">
                              <div className="flex items-center gap-3">
                                <Switch size="sm" isSelected={dayData.active} onValueChange={() => toggleDay(selectedDay)} />
                                <div>
                                  <h3 className="text-[15px]" style={{ color: dayData.active ? "#09090b" : "#a1a1aa", fontWeight: 700 }}>{day.label}</h3>
                                  <p className="text-[11px]" style={{ color: "#a1a1aa" }}>{dayData.active ? `${dayData.slots.length} bloco${dayData.slots.length !== 1 ? "s" : ""} de horário` : "Indisponível"}</p>
                                </div>
                              </div>

                              {dayData.active && (
                                <button onClick={() => copyToAll(selectedDay)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors hover:bg-zinc-50" style={{ border: "1px solid #e4e4e7", color: "#71717a", fontWeight: 600 }}>
                                  <Copy size={12} /> Copiar para todos
                                </button>
                              )}
                            </div>

                            {dayData.active ? (
                              <div className="space-y-3">
                                {dayData.slots.map((slot, idx) => {
                                  const [sh, sm] = slot.start.split(":").map(Number);
                                  const [eh, em] = slot.end.split(":").map(Number);
                                  const hours = (eh + em / 60) - (sh + sm / 60);

                                  return (
                                    <motion.div key={slot.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#fafafa", border: "1px solid #f4f4f5" }}>
                                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px]" style={{ background: "#006FEE", color: "white", fontWeight: 700 }}>{idx + 1}</div>
                                      <div className="flex items-center gap-2 flex-1">
                                        <input type="time" value={slot.start} onChange={(e) => updateSlot(selectedDay, slot.id, "start", e.target.value)} className="px-3 py-2 rounded-xl text-[13px] outline-none w-[110px]" style={{ border: "1px solid #e4e4e7", color: "#09090b", background: "white", fontWeight: 600 }} />
                                        <div className="w-4 h-px" style={{ background: "#d4d4d8" }} />
                                        <input type="time" value={slot.end} onChange={(e) => updateSlot(selectedDay, slot.id, "end", e.target.value)} className="px-3 py-2 rounded-xl text-[13px] outline-none w-[110px]" style={{ border: "1px solid #e4e4e7", color: "#09090b", background: "white", fontWeight: 600 }} />
                                      </div>
                                      <span className="hidden sm:block px-2 py-1 rounded-lg text-[10px]" style={{ background: "#dcfce7", color: "#16a34a", fontWeight: 700 }}>{hours > 0 ? `${hours.toFixed(hours % 1 ? 1 : 0)}h` : "–"}</span>
                                      <Button isIconOnly variant="light" size="sm" className="text-zinc-300 hover:text-red-500 shrink-0" onPress={() => removeSlot(selectedDay, slot.id)}><Trash2 size={14} /></Button>
                                    </motion.div>
                                  );
                                })}

                                <button onClick={() => addSlot(selectedDay)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all hover:border-[#006FEE] hover:bg-[#006FEE]/5 group" style={{ border: "2px dashed #e4e4e7" }}>
                                  <Plus size={14} className="text-zinc-400 group-hover:text-[#006FEE]" />
                                  <span className="text-[12px] text-zinc-400 group-hover:text-[#006FEE]" style={{ fontWeight: 600 }}>Adicionar bloco de horário</span>
                                </button>
                              </div>
                            ) : (
                              <div className="py-10 text-center rounded-xl" style={{ background: "#fafafa", border: "1px dashed #e4e4e7" }}>
                                <Moon size={28} className="text-zinc-200 mx-auto mb-3" />
                                <p className="text-[13px] mb-1" style={{ color: "#a1a1aa", fontWeight: 600 }}>Dia desativado</p>
                                <p className="text-[11px] mb-4" style={{ color: "#d4d4d8" }}>Ative o dia para configurar horários.</p>
                                <Button size="sm" color="primary" variant="flat" className="text-[11px]" style={{ fontWeight: 600 }} onPress={() => toggleDay(selectedDay)}>Ativar {day.short}</Button>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <div className="lg:hidden mt-5">
            <Button color="primary" fullWidth startContent={saved ? <Check size={14} /> : <Save size={14} />} className="h-11 text-[13px]" style={{ fontWeight: 600 }} onPress={handleSave}>
              {saved ? "Salvo com sucesso!" : "Salvar disponibilidade"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};