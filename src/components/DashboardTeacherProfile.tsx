import React, { useState, useMemo } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Link, useParams } from "react-router-dom";
import { useProfessor, useDisponibilidadeProfessor, useAgendarAula } from "../hooks/useDashboard";
import { ChevronLeft, Star, MessageSquare, Calendar as CalendarIcon, ShieldCheck, Award, Clock, ThumbsUp, Heart, Languages, Share2, ChevronRight, Check, X, Video, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Avatar, Button, Chip } from "../components/ui/nextui-shim";
import { StatCard } from "./StatCard";
import { motion, AnimatePresence } from "framer-motion";

// Modals foram resumidos para focar na tela, usando lógica idêntica ao original do Figma
// Apenas as props e a função de envio consumindo o backend (useAgendarAula)
const BookingModal = ({ isOpen, onClose, teacher, apiDisp }: { isOpen: boolean; onClose: () => void; teacher: any; apiDisp: any }) => {
  const [step, setStep] = useState<"date" | "time" | "confirm" | "success">("date");
  const [selectedDateIdx, setSelectedDateIdx] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [lessonTopic, setLessonTopic] = useState("");
  const { mutate: agendarAula, isPending } = useAgendarAula();

  const dates = useMemo(() => {
    if (!apiDisp || !apiDisp.horarios_configurados) return [];
    const arr = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const dow = d.getDay();
      const slots = apiDisp.horarios_configurados.filter((h: any) => h.dia_semana === dow).map((h: any) => h.hora_inicio);
      arr.push({ date: d, dayName: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][dow], dayNum: d.getDate(), monthShort: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"][d.getMonth()], available: slots.length > 0, slots });
    }
    return arr;
  }, [apiDisp]);

  const selectedDate = selectedDateIdx !== null ? dates[selectedDateIdx] : null;

  const handleClose = () => { onClose(); setTimeout(() => { setStep("date"); setSelectedDateIdx(null); setSelectedTime(null); setLessonTopic(""); }, 300); };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    const mesFormatado = String(selectedDate.date.getMonth() + 1).padStart(2, '0');
    const diaFormatado = String(selectedDate.date.getDate()).padStart(2, '0');
    const dataIso = `${selectedDate.date.getFullYear()}-${mesFormatado}-${diaFormatado}`;
    
    agendarAula({
      professorId: teacher.id,
      data_aula: dataIso,
      hora_inicio: selectedTime,
      hora_fim: `${parseInt(selectedTime) + 1}:00`,
      preco_cobrado: teacher.preco_medio,
      assunto: lessonTopic
    }, { onSuccess: () => setStep("success") });
  };

  const formatFullDate = () => selectedDate ? `${selectedDate.dayName}, ${selectedDate.dayNum} de ${selectedDate.monthShort}` : "";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={handleClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[520px] md:max-h-[85vh] bg-white rounded-3xl z-50 flex flex-col overflow-hidden shadow-2xl">
            {step !== "success" && (
              <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: "1px solid #f4f4f5" }}>
                <div className="flex items-center gap-3">
                  <img src={teacher.foto_url || `https://ui-avatars.com/api/?name=${teacher.nome}`} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div><p className="text-[14px]" style={{ color: "#09090b", fontWeight: 700 }}>Agendar aula</p><p className="text-[11px]" style={{ color: "#a1a1aa" }}>com {teacher.nome}</p></div>
                </div>
                <button onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors" aria-label="Fechar"><X size={16} className="text-zinc-400" /></button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === "date" && (
                  <motion.div key="date" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6">
                    <h3 className="text-[15px] mb-1" style={{ color: "#09090b", fontWeight: 700 }}>Escolha uma data</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {dates.map((d, i) => (
                        <button key={i} disabled={!d.available} onClick={() => setSelectedDateIdx(i)} className="flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all relative" style={{ background: selectedDateIdx === i ? "#006FEE" : d.available ? "white" : "#fafafa", border: selectedDateIdx === i ? "2px solid #006FEE" : d.available ? "1px solid #e4e4e7" : "1px solid #f4f4f5", opacity: d.available ? 1 : 0.4, cursor: d.available ? "pointer" : "not-allowed" }}>
                          <span className="text-[9px]" style={{ color: selectedDateIdx === i ? "rgba(255,255,255,0.7)" : "#a1a1aa", fontWeight: 500 }}>{d.dayName}</span>
                          <span className="text-[15px]" style={{ color: selectedDateIdx === i ? "white" : "#09090b", fontWeight: 700 }}>{d.dayNum}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {step === "time" && selectedDate && (
                  <motion.div key="time" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6">
                    <h3 className="text-[15px] mb-1" style={{ color: "#09090b", fontWeight: 700 }}>Escolha um horário</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedDate.slots.map((slot:any) => (
                        <button key={slot} onClick={() => setSelectedTime(slot)} className="py-2.5 rounded-xl text-[13px] transition-all" style={{ background: selectedTime === slot ? "#006FEE" : "white", border: selectedTime === slot ? "2px solid #006FEE" : "1px solid #e4e4e7", color: selectedTime === slot ? "white" : "#09090b", fontWeight: selectedTime === slot ? 700 : 500 }}>{slot}</button>
                      ))}
                    </div>
                    <div className="mt-5">
                      <label className="block text-[11px] mb-1.5" style={{ color: "#71717a", fontWeight: 600 }}>O que gostaria de estudar? <span className="text-zinc-400">(opcional)</span></label>
                      <textarea value={lessonTopic} onChange={(e) => setLessonTopic(e.target.value)} rows={2} className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none resize-none border border-zinc-200" />
                    </div>
                  </motion.div>
                )}
                {step === "confirm" && selectedDate && selectedTime && (
                  <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6">
                    <h3 className="text-[15px] mb-5" style={{ color: "#09090b", fontWeight: 700 }}>Confirme sua aula</h3>
                    <div className="rounded-2xl border border-zinc-100 overflow-hidden">
                      <div className="p-5 flex items-center gap-4" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 100%)" }}>
                        <img src={teacher.foto_url || `https://ui-avatars.com/api/?name=${teacher.nome}`} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white/10" />
                        <div><p className="text-[15px] font-bold text-white">{teacher.nome}</p><p className="text-[11px] text-white/50">{teacher.ocupacao}</p></div>
                      </div>
                      <div className="p-5 space-y-3">
                        <p className="text-sm font-bold">Total: R$ {teacher.preco_medio}</p>
                        <p className="text-xs text-zinc-500">Data: {formatFullDate()} às {selectedTime}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {step === "success" && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center p-8 py-12">
                    <Check size={50} className="text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold">Aula agendada!</h2>
                    <Button color="primary" className="mt-6 w-full" onPress={handleClose}>Voltar ao perfil</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {step !== "success" && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-zinc-100">
                <Button variant="light" size="sm" onPress={() => { if (step === "date") handleClose(); else if (step === "time") setStep("date"); else if (step === "confirm") setStep("time"); }}>Voltar</Button>
                {step === "date" && <Button color="primary" size="sm" isDisabled={selectedDateIdx === null} onPress={() => setStep("time")}>Continuar</Button>}
                {step === "time" && <Button color="primary" size="sm" isDisabled={!selectedTime} onPress={() => setStep("confirm")}>Continuar</Button>}
                {step === "confirm" && <Button color="primary" size="sm" isLoading={isPending} onPress={handleConfirm}>Confirmar Pagamento</Button>}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const DashboardTeacherProfile = () => {
  const { id } = useParams();
  const [bookingOpen, setBookingOpen] = useState(false);
  
  const { data: teacherData, isLoading } = useProfessor(id!);
  const { data: disp } = useDisponibilidadeProfessor(id!);

  if (isLoading) return <DashboardLayout><div className="p-8 text-center text-zinc-500">Buscando professor...</div></DashboardLayout>;
  if (!teacherData) return <DashboardLayout><div className="p-8 text-center text-zinc-500">Professor não encontrado.</div></DashboardLayout>;

  // Mapeamento mantendo a estrutura 100% igual ao Figma para não quebrar estilos
  const teacher = {
    id: teacherData.id,
    name: `${teacherData.nome} ${teacherData.sobrenome}`,
    role: teacherData.ocupacao || "Professor",
    country: teacherData.pais || "Brasil",
    rating: teacherData.rating || 5.0,
    reviews: teacherData.total_reviews || 0,
    students: 0, // Placeholder
    lessons: 0, // Placeholder
    price: teacherData.preco_medio || 0,
    imageUrl: teacherData.foto_url || `https://ui-avatars.com/api/?name=${teacherData.nome}&background=006FEE&color=fff`,
    about: teacherData.sobre || "Sem descrição.",
    tags: teacherData.especialidades?.length ? teacherData.especialidades : ["Geral"],
    languages: teacherData.idiomas?.length ? teacherData.idiomas : [teacherData.idioma || "Português"],
  };

  const openBooking = () => setBookingOpen(true);

  return (
    <DashboardLayout>
      <div className="pb-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 100%)" }}>
          <div className="absolute top-0 right-[20%] w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,111,238,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="relative z-10 max-w-[1100px] mx-auto px-5 md:px-8 pt-5">
            <Button as={Link} to="/dashboard/teachers" variant="light" size="sm" startContent={<ChevronLeft size={16} />} className="text-white/50 hover:text-white/80 text-[13px]">
              Voltar
            </Button>
          </div>
          <div className="relative z-10 max-w-[1100px] mx-auto px-5 md:px-8 py-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative shrink-0">
              <img src={teacher.imageUrl} alt={teacher.name} className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white/10" />
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-3 border-[#0d1a3a] rounded-full" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <h1 className="text-[28px] md:text-[34px]" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.02em" }}>{teacher.name}</h1>
                <ShieldCheck size={20} className="text-[#60a5fa]" />
              </div>
              <p className="text-[14px] mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{teacher.role} · {teacher.country}</p>
              
              {/* O GRID ESCURO QUE EU TINHA TIRADO POR ERRO, AGORA ESTÁ AQUI */}
              <div className="grid grid-cols-3 gap-3 max-w-[540px] w-full">
                {[
                  { icon: Star, value: String(teacher.rating), label: "Avaliação", color: "#fbbf24", hint: `${teacher.reviews} reviews`, delta: "+0.2", trend: "up" as const, spark: [4.4, 4.5, 4.6, 4.7, 4.7, 4.8, Number(teacher.rating) || 5.0] },
                  { icon: Award, value: String(teacher.lessons), label: "Aulas dadas", color: "#60a5fa", hint: "ao longo do ano", delta: "+24", trend: "up" as const, spark: [80, 110, 140, 180, 220, 260, Number(teacher.lessons) || 0] },
                  { icon: ThumbsUp, value: String(teacher.students), label: "Alunos ativos", color: "#34d399", hint: "este mês", delta: "+9%", trend: "up" as const, spark: [60, 78, 92, 105, 118, 130, Number(teacher.students) || 0] },
                ].map((s, i) => (
                  <StatCard key={s.label} {...s} variant="dark" index={i} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10" style={{ border: "1px solid rgba(255,255,255,0.1)" }} aria-label="Favoritar">
                <Heart size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10" style={{ border: "1px solid rgba(255,255,255,0.1)" }} aria-label="Compartilhar">
                <Share2 size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-[1100px] mx-auto px-5 md:px-8 -mt-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
            <div className="lg:col-span-8 space-y-6">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl p-6" style={{ border: "1px solid #f4f4f5" }}>
                <h2 className="text-[16px] mb-3" style={{ color: "#09090b", fontWeight: 700 }}>Sobre mim</h2>
                <p className="text-[14px] leading-relaxed text-zinc-600 mb-5">{teacher.about}</p>
                <h3 className="text-[14px] mb-3" style={{ color: "#09090b", fontWeight: 700 }}>Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.tags.map((tag:any) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full text-[12px]" style={{ background: "#eff6ff", color: "#006FEE", fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: "1px solid #f4f4f5" }}>
                  <Languages size={14} className="text-zinc-400" />
                  <span className="text-[13px] text-zinc-500">{teacher.languages.join(" · ")}</span>
                </div>
              </motion.div>

              {/* SEÇÃO DE AVALIAÇÕES RESTAURADA DO FIGMA ORIGINAL */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-2xl p-6" style={{ border: "1px solid #f4f4f5" }}>
                <h2 className="text-[16px] mb-4" style={{ color: "#09090b", fontWeight: 700 }}>Avaliações</h2>
                <div className="pb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=100&h=100" className="w-8 h-8" size="sm" />
                      <div>
                        <p className="text-[13px]" style={{ color: "#09090b", fontWeight: 600 }}>Carlos M.</p>
                        <p className="text-[11px] text-zinc-400">Há 2 semanas</p>
                      </div>
                    </div>
                    <div className="flex text-amber-400">{[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-current" />)}</div>
                  </div>
                  <p className="text-[13px] text-zinc-600 leading-relaxed">
                    "{teacher.name} é um(a) professor(a) incrível! Percebeu exatamente onde eu tinha dificuldade."
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-5">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid #f4f4f5" }}>
                  <div className="flex items-end gap-1.5 mb-5">
                    <span className="text-[30px]" style={{ color: "#09090b", fontWeight: 800, lineHeight: 1 }}>R$ {teacher.price}</span>
                    <span className="text-[13px] text-zinc-400 mb-1">/ aula</span>
                  </div>
                  <Button color="primary" className="w-full mb-2 h-12 text-[14px]" style={{ fontWeight: 600 }} startContent={<CalendarIcon size={18} />} onPress={openBooking}>
                    Agendar Aula
                  </Button>
                  <Button variant="bordered" className="w-full h-11 text-[13px] border-zinc-200" style={{ fontWeight: 600 }} startContent={<MessageSquare size={16} />}>
                    Enviar Mensagem
                  </Button>
                  <div className="mt-5 pt-5 border-t border-zinc-100 space-y-2.5">
                    <div className="flex items-center gap-2 text-[13px] text-zinc-600"><Clock size={15} className="text-green-500 shrink-0" />Responde em <strong>1 hora</strong></div>
                    <div className="flex items-center gap-2 text-[13px] text-zinc-600"><ShieldCheck size={15} className="text-primary shrink-0" />Garantia de satisfação</div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-5" style={{ border: "1px solid #f4f4f5" }}>
                  <h3 className="text-[14px] mb-3" style={{ color: "#09090b", fontWeight: 700 }}>Horários Livres</h3>
                  <p className="text-[10px] text-zinc-400 mb-3">Fuso: Brasília</p>
                  <div className="grid grid-cols-3 gap-2">
                    <p className="col-span-3 text-[11px] text-zinc-400" style={{ fontWeight: 600 }}>Hoje</p>
                    {["14:00", "15:30"].map(t => (
                      <Button key={t} size="sm" variant="flat" color="success" className="text-[12px]" style={{ fontWeight: 600 }} onPress={openBooking}>{t}</Button>
                    ))}
                    <Button size="sm" variant="flat" isDisabled className="text-[12px] line-through">18:00</Button>
                    <p className="col-span-3 text-[11px] text-zinc-400 mt-2" style={{ fontWeight: 600 }}>Amanhã</p>
                    {["09:00", "10:00"].map(t => (
                      <Button key={t} size="sm" variant="flat" color="success" className="text-[12px]" style={{ fontWeight: 600 }} onPress={openBooking}>{t}</Button>
                    ))}
                    <Button size="sm" variant="flat" isDisabled className="text-[12px] line-through">14:00</Button>
                  </div>
                  <Button variant="light" color="primary" className="w-full mt-4 text-[12px]" style={{ fontWeight: 600 }} onPress={openBooking}>Ver agenda completa</Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} teacher={teacherData} apiDisp={disp} />
      </div>
    </DashboardLayout>
  );
};