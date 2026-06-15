import React, { useState, useMemo } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Link, useParams } from "react-router";
import {
  ChevronLeft, Star, MessageSquare, Calendar as CalendarIcon,
  ShieldCheck, Award, Clock, ThumbsUp, Heart, Languages, Share2,
  ChevronRight, Check, X, Video, MapPin, CreditCard, Sparkles,
  ArrowRight,
} from "lucide-react";
import { Avatar, Button, Chip, useDisclosure } from "../components/ui/nextui-shim";
import { StatCard } from "./StatCard";
import { motion, AnimatePresence } from "motion/react";

// ── Generate mock available dates (next 14 days) ──
const generateDates = () => {
  const dates: { date: Date; dayName: string; dayNum: number; monthShort: string; available: boolean; slots: string[] }[] = [];
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const monthNames = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const allSlots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "15:30", "16:00", "17:00", "18:00", "19:00", "20:00"];

  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dow = d.getDay();
    const isWeekend = dow === 0 || dow === 6;
    // Random slots for weekdays, none/few for weekends
    const available = !isWeekend || Math.random() > 0.5;
    const numSlots = isWeekend ? Math.floor(Math.random() * 3) : 3 + Math.floor(Math.random() * 5);
    const shuffled = [...allSlots].sort(() => Math.random() - 0.5);
    const slots = available ? shuffled.slice(0, numSlots).sort() : [];

    dates.push({
      date: d,
      dayName: dayNames[dow],
      dayNum: d.getDate(),
      monthShort: monthNames[d.getMonth()],
      available: slots.length > 0,
      slots,
    });
  }
  return dates;
};

// ── Booking Modal Component ──
const BookingModal = ({
  isOpen,
  onClose,
  teacher,
}: {
  isOpen: boolean;
  onClose: () => void;
  teacher: { name: string; imageUrl: string; price: number; role: string };
}) => {
  const [step, setStep] = useState<"date" | "time" | "confirm" | "success">("date");
  const [selectedDateIdx, setSelectedDateIdx] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [lessonType, setLessonType] = useState<"individual" | "group">("individual");
  const [lessonTopic, setLessonTopic] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const dates = useMemo(() => generateDates(), []);

  const selectedDate = selectedDateIdx !== null ? dates[selectedDateIdx] : null;

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setStep("date");
      setSelectedDateIdx(null);
      setSelectedTime(null);
      setLessonTopic("");
      setIsProcessing(false);
    }, 300);
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");
    }, 1500);
  };

  const formatFullDate = () => {
    if (!selectedDate) return "";
    const d = selectedDate.date;
    const weekday = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][d.getDay()];
    const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    return `${weekday}, ${d.getDate()} de ${months[d.getMonth()]}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[520px] md:max-h-[85vh] bg-white rounded-3xl z-50 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            {step !== "success" && (
              <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: "1px solid #f4f4f5" }}>
                <div className="flex items-center gap-3">
                  <img src={teacher.imageUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-[14px]" style={{ color: "#09090b", fontWeight: 700 }}>Agendar aula</p>
                    <p className="text-[11px]" style={{ color: "#a1a1aa" }}>com {teacher.name}</p>
                  </div>
                </div>
                <button onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors" aria-label="Fechar">
                  <X size={16} className="text-zinc-400" />
                </button>
              </div>
            )}

            {/* Steps indicator */}
            {step !== "success" && (
              <div className="flex items-center gap-2 px-6 py-3" style={{ borderBottom: "1px solid #fafafa" }}>
                {(["date", "time", "confirm"] as const).map((s, i) => {
                  const labels = ["Data", "Horário", "Confirmar"];
                  const stepIdx = ["date", "time", "confirm"].indexOf(step);
                  const isActive = s === step;
                  const isDone = i < stepIdx;
                  return (
                    <React.Fragment key={s}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
                          style={{
                            background: isActive ? "#006FEE" : isDone ? "#dcfce7" : "#f4f4f5",
                            color: isActive ? "white" : isDone ? "#16a34a" : "#a1a1aa",
                            fontWeight: 700,
                          }}>
                          {isDone ? <Check size={11} /> : i + 1}
                        </div>
                        <span className="text-[11px] hidden sm:block"
                          style={{ color: isActive ? "#09090b" : "#a1a1aa", fontWeight: isActive ? 600 : 400 }}>
                          {labels[i]}
                        </span>
                      </div>
                      {i < 2 && <div className="flex-1 h-px" style={{ background: isDone ? "#86efac" : "#e4e4e7" }} />}
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* ─── Step 1: Date ─── */}
                {step === "date" && (
                  <motion.div key="date" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="p-6">
                    <h3 className="text-[15px] mb-1" style={{ color: "#09090b", fontWeight: 700 }}>Escolha uma data</h3>
                    <p className="text-[12px] mb-5" style={{ color: "#a1a1aa" }}>Próximos 14 dias com disponibilidade</p>

                    <div className="grid grid-cols-7 gap-2">
                      {dates.map((d, i) => {
                        const isSelected = selectedDateIdx === i;
                        const isToday = i === 0;
                        return (
                          <button
                            key={i}
                            disabled={!d.available}
                            onClick={() => setSelectedDateIdx(i)}
                            className="flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all relative"
                            style={{
                              background: isSelected ? "#006FEE" : d.available ? "white" : "#fafafa",
                              border: isSelected ? "2px solid #006FEE" : d.available ? "1px solid #e4e4e7" : "1px solid #f4f4f5",
                              opacity: d.available ? 1 : 0.4,
                              cursor: d.available ? "pointer" : "not-allowed",
                            }}
                          >
                            <span className="text-[9px]" style={{
                              color: isSelected ? "rgba(255,255,255,0.7)" : "#a1a1aa",
                              fontWeight: 500,
                            }}>{d.dayName}</span>
                            <span className="text-[15px]" style={{
                              color: isSelected ? "white" : "#09090b",
                              fontWeight: 700,
                            }}>{d.dayNum}</span>
                            <span className="text-[8px]" style={{
                              color: isSelected ? "rgba(255,255,255,0.5)" : "#a1a1aa",
                            }}>{d.monthShort}</span>
                            {isToday && (
                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[7px]"
                                style={{ background: isSelected ? "rgba(255,255,255,0.2)" : "#eff6ff", color: isSelected ? "white" : "#006FEE", fontWeight: 700 }}>
                                HOJE
                              </div>
                            )}
                            {d.available && !isSelected && (
                              <div className="w-1 h-1 rounded-full" style={{ background: "#17c964" }} />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 rounded-xl flex items-center justify-between"
                        style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
                      >
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={14} className="text-[#006FEE]" />
                          <span className="text-[12px]" style={{ color: "#006FEE", fontWeight: 600 }}>{formatFullDate()}</span>
                        </div>
                        <span className="text-[11px]" style={{ color: "#006FEE" }}>
                          {selectedDate.slots.length} horário{selectedDate.slots.length !== 1 ? "s" : ""}
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ─── Step 2: Time ─── */}
                {step === "time" && selectedDate && (
                  <motion.div key="time" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="p-6">
                    <h3 className="text-[15px] mb-1" style={{ color: "#09090b", fontWeight: 700 }}>Escolha um horário</h3>
                    <p className="text-[12px] mb-5" style={{ color: "#a1a1aa" }}>{formatFullDate()}</p>

                    {/* Lesson type */}
                    <div className="flex gap-2 mb-5">
                      {([
                        { key: "individual" as const, label: "Individual", desc: "1-a-1", price: teacher.price },
                        { key: "group" as const, label: "Em grupo", desc: "até 5 alunos", price: Math.round(teacher.price * 0.6) },
                      ]).map((t) => (
                        <button
                          key={t.key}
                          onClick={() => setLessonType(t.key)}
                          className="flex-1 p-3 rounded-xl transition-all text-left"
                          style={{
                            background: lessonType === t.key ? "#006FEE" : "white",
                            border: lessonType === t.key ? "2px solid #006FEE" : "1px solid #e4e4e7",
                          }}
                        >
                          <p className="text-[12px]" style={{
                            color: lessonType === t.key ? "white" : "#09090b",
                            fontWeight: 700,
                          }}>{t.label}</p>
                          <p className="text-[10px]" style={{
                            color: lessonType === t.key ? "rgba(255,255,255,0.6)" : "#a1a1aa",
                          }}>{t.desc} · R$ {t.price}</p>
                        </button>
                      ))}
                    </div>

                    {/* Time grid */}
                    <p className="text-[11px] mb-2" style={{ color: "#71717a", fontWeight: 600 }}>Horários disponíveis</p>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedDate.slots.map((slot) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className="py-2.5 rounded-xl text-[13px] transition-all"
                            style={{
                              background: isSelected ? "#006FEE" : "white",
                              border: isSelected ? "2px solid #006FEE" : "1px solid #e4e4e7",
                              color: isSelected ? "white" : "#09090b",
                              fontWeight: isSelected ? 700 : 500,
                            }}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>

                    {/* Topic */}
                    <div className="mt-5">
                      <label className="block text-[11px] mb-1.5" style={{ color: "#71717a", fontWeight: 600 }}>
                        O que gostaria de estudar? <span className="text-zinc-400">(opcional)</span>
                      </label>
                      <textarea
                        placeholder="Ex: Quero praticar conversação sobre viagens..."
                        value={lessonTopic}
                        onChange={(e) => setLessonTopic(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none resize-none placeholder:text-zinc-400"
                        style={{ border: "1px solid #e4e4e7", color: "#09090b", background: "#fafafa" }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* ─── Step 3: Confirm ─── */}
                {step === "confirm" && selectedDate && selectedTime && (
                  <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="p-6">
                    <h3 className="text-[15px] mb-5" style={{ color: "#09090b", fontWeight: 700 }}>Confirme sua aula</h3>

                    {/* Summary card */}
                    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #f4f4f5" }}>
                      {/* Dark header */}
                      <div className="p-5 flex items-center gap-4"
                        style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 100%)" }}>
                        <img src={teacher.imageUrl} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white/10" />
                        <div>
                          <p className="text-[15px]" style={{ color: "white", fontWeight: 700 }}>{teacher.name}</p>
                          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>{teacher.role}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-5 space-y-3">
                        {[
                          { icon: CalendarIcon, label: "Data", value: formatFullDate() },
                          { icon: Clock, label: "Horário", value: `${selectedTime} – ${parseInt(selectedTime) + 1}:00 (1 hora)` },
                          { icon: Video, label: "Formato", value: lessonType === "individual" ? "Aula individual (1-a-1)" : "Aula em grupo (até 5)" },
                          { icon: MapPin, label: "Plataforma", value: "Google Meet (link enviado por e-mail)" },
                        ].map((item) => (
                          <div key={item.label} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#f4f4f5" }}>
                              <item.icon size={14} className="text-zinc-500" />
                            </div>
                            <div>
                              <p className="text-[10px]" style={{ color: "#a1a1aa", fontWeight: 600 }}>{item.label}</p>
                              <p className="text-[13px]" style={{ color: "#09090b", fontWeight: 500 }}>{item.value}</p>
                            </div>
                          </div>
                        ))}

                        {lessonTopic && (
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#f4f4f5" }}>
                              <MessageSquare size={14} className="text-zinc-500" />
                            </div>
                            <div>
                              <p className="text-[10px]" style={{ color: "#a1a1aa", fontWeight: 600 }}>Tópico</p>
                              <p className="text-[13px]" style={{ color: "#09090b", fontWeight: 500 }}>{lessonTopic}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="px-5 py-4 flex items-center justify-between" style={{ borderTop: "1px solid #f4f4f5", background: "#fafafa" }}>
                        <div>
                          <p className="text-[10px]" style={{ color: "#a1a1aa" }}>Valor da aula</p>
                          <p className="text-[22px]" style={{ color: "#09090b", fontWeight: 800, lineHeight: 1.2 }}>
                            R$ {lessonType === "individual" ? teacher.price : Math.round(teacher.price * 0.6)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#16a34a" }}>
                          <ShieldCheck size={13} />
                          <span style={{ fontWeight: 600 }}>Garantia de satisfação</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ─── Step: Success ─── */}
                {step === "success" && selectedDate && selectedTime && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center p-8 py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                      style={{ background: "linear-gradient(135deg, #dcfce7, #bbf7d0)" }}
                    >
                      <Check size={36} className="text-green-600" strokeWidth={3} />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                      <h2 className="text-[24px] mb-2" style={{ color: "#09090b", fontWeight: 800, letterSpacing: "-0.02em" }}>
                        Aula agendada!
                      </h2>
                      <p className="text-[14px] max-w-xs mx-auto mb-2" style={{ color: "#71717a" }}>
                        Sua aula com <strong style={{ color: "#09090b" }}>{teacher.name}</strong> está confirmada.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                      className="mt-4 p-4 rounded-2xl w-full max-w-sm text-left"
                      style={{ background: "#fafafa", border: "1px solid #f4f4f5" }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img src={teacher.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="text-[13px]" style={{ color: "#09090b", fontWeight: 600 }}>{teacher.name}</p>
                          <p className="text-[11px]" style={{ color: "#a1a1aa" }}>{teacher.role}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[12px]">
                          <CalendarIcon size={13} className="text-[#006FEE]" />
                          <span style={{ color: "#3f3f46", fontWeight: 500 }}>{formatFullDate()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12px]">
                          <Clock size={13} className="text-[#006FEE]" />
                          <span style={{ color: "#3f3f46", fontWeight: 500 }}>{selectedTime} – {parseInt(selectedTime) + 1}:00</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12px]">
                          <Video size={13} className="text-[#006FEE]" />
                          <span style={{ color: "#3f3f46", fontWeight: 500 }}>Google Meet</span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                      className="mt-6 flex flex-col gap-2 w-full max-w-sm">
                      <Button color="primary" className="w-full h-11 text-[14px]" style={{ fontWeight: 600 }}
                        onPress={handleClose}>
                        Voltar ao perfil
                      </Button>
                      <p className="text-[11px] mt-1" style={{ color: "#a1a1aa" }}>
                        Um e-mail de confirmação foi enviado com o link da aula.
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer actions */}
            {step !== "success" && (
              <div className="px-6 py-4 flex items-center justify-between shrink-0" style={{ borderTop: "1px solid #f4f4f5" }}>
                <Button
                  variant="light"
                  size="sm"
                  className="text-[13px] text-zinc-500"
                  onPress={() => {
                    if (step === "date") handleClose();
                    else if (step === "time") setStep("date");
                    else if (step === "confirm") setStep("time");
                  }}
                  startContent={<ChevronLeft size={14} />}
                >
                  {step === "date" ? "Cancelar" : "Voltar"}
                </Button>

                {step === "date" && (
                  <Button color="primary" size="sm" className="text-[13px]" style={{ fontWeight: 600 }}
                    isDisabled={selectedDateIdx === null}
                    endContent={<ArrowRight size={14} />}
                    onPress={() => setStep("time")}>
                    Continuar
                  </Button>
                )}
                {step === "time" && (
                  <Button color="primary" size="sm" className="text-[13px]" style={{ fontWeight: 600 }}
                    isDisabled={!selectedTime}
                    endContent={<ArrowRight size={14} />}
                    onPress={() => setStep("confirm")}>
                    Continuar
                  </Button>
                )}
                {step === "confirm" && (
                  <Button color="primary" size="sm" className="text-[13px] px-5" style={{ fontWeight: 600 }}
                    isLoading={isProcessing}
                    startContent={!isProcessing && <CreditCard size={14} />}
                    onPress={handleConfirm}>
                    {isProcessing ? "Processando..." : `Confirmar · R$ ${lessonType === "individual" ? teacher.price : Math.round(teacher.price * 0.6)}`}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ── Main Page ──
export const DashboardTeacherProfile = () => {
  const { id } = useParams();
  const [bookingOpen, setBookingOpen] = useState(false);

  const teacher = {
    name: "Sarah Jenkins", role: "Tutora Nativa de Inglês", country: "Estados Unidos", countryCode: "us",
    languages: ["Inglês (Nativo)", "Espanhol (Avançado)"], rating: 4.9, reviews: 128, students: 340,
    lessons: 1205, price: 65,
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2.5&w=500&h=500",
    about: "Olá! Sou a Sarah, nascida e criada em Nova York. Tenho mais de 5 anos de experiência ensinando inglês para alunos de todas as idades e níveis. Minhas aulas são focadas em conversação prática, ajudando você a perder o medo de falar.",
    tags: ["Conversação", "IELTS", "Negócios", "Iniciantes", "Gramática"],
  };

  const openBooking = () => setBookingOpen(true);

  return (
    <DashboardLayout>
      <div className="pb-10">
        {/* ═══ Hero header ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 100%)" }}
        >
          <div className="absolute top-0 right-[20%] w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,111,238,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />

          <div className="relative z-10 max-w-[1100px] mx-auto px-5 md:px-8 pt-5">
            <Button as={Link} to="/dashboard/teachers" variant="light" size="sm"
              startContent={<ChevronLeft size={16} />} className="text-white/50 hover:text-white/80 text-[13px]">
              Voltar
            </Button>
          </div>

          <div className="relative z-10 max-w-[1100px] mx-auto px-5 md:px-8 py-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative shrink-0">
              <img src={teacher.imageUrl} alt={teacher.name}
                className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white/10" />
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-3 border-[#0d1a3a] rounded-full" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <h1 className="text-[28px] md:text-[34px]" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  {teacher.name}
                </h1>
                <ShieldCheck size={20} className="text-[#60a5fa]" />
              </div>
              <p className="text-[14px] mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                {teacher.role} · {teacher.country}
              </p>
              <div className="grid grid-cols-3 gap-3 max-w-[540px] w-full">
                {([
                  { icon: Star, value: String(teacher.rating), label: "Avaliação", color: "#fbbf24", hint: `${teacher.reviews} reviews`, delta: "+0.2", trend: "up" as const, spark: [4.4, 4.5, 4.6, 4.7, 4.7, 4.8, Number(teacher.rating) || 4.9] },
                  { icon: Award, value: String(teacher.lessons), label: "Aulas dadas", color: "#60a5fa", hint: "ao longo do ano", delta: "+24", trend: "up" as const, spark: [80, 110, 140, 180, 220, 260, Number(teacher.lessons) || 300] },
                  { icon: ThumbsUp, value: String(teacher.students), label: "Alunos ativos", color: "#34d399", hint: "este mês", delta: "+9%", trend: "up" as const, spark: [60, 78, 92, 105, 118, 130, Number(teacher.students) || 142] },
                ]).map((s, i) => (
                  <StatCard key={s.label} {...s} variant="dark" index={i} />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }} aria-label="Favoritar">
                <Heart size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }} aria-label="Compartilhar">
                <Share2 size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ═══ Content ═══ */}
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 -mt-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
            {/* Left column */}
            <div className="lg:col-span-8 space-y-6">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl p-6" style={{ border: "1px solid #f4f4f5" }}>
                <h2 className="text-[16px] mb-3" style={{ color: "#09090b", fontWeight: 700 }}>Sobre mim</h2>
                <p className="text-[14px] leading-relaxed text-zinc-600 mb-5">{teacher.about}</p>
                <h3 className="text-[14px] mb-3" style={{ color: "#09090b", fontWeight: 700 }}>Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-full text-[12px]"
                      style={{ background: "#eff6ff", color: "#006FEE", fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: "1px solid #f4f4f5" }}>
                  <Languages size={14} className="text-zinc-400" />
                  <span className="text-[13px] text-zinc-500">{teacher.languages.join(" · ")}</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl p-6" style={{ border: "1px solid #f4f4f5" }}>
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
                    "Sarah é uma professora incrível! Percebeu exatamente onde eu tinha dificuldade."
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Booking card */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-5">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid #f4f4f5" }}>
                  <div className="flex items-end gap-1.5 mb-5">
                    <span className="text-[30px]" style={{ color: "#09090b", fontWeight: 800, lineHeight: 1 }}>R$ {teacher.price}</span>
                    <span className="text-[13px] text-zinc-400 mb-1">/ aula</span>
                  </div>
                  <Button color="primary" className="w-full mb-2 h-12 text-[14px]" style={{ fontWeight: 600 }}
                    startContent={<CalendarIcon size={18} />}
                    onPress={openBooking}>
                    Agendar Aula
                  </Button>
                  <Button variant="bordered" className="w-full h-11 text-[13px] border-zinc-200" style={{ fontWeight: 600 }}
                    startContent={<MessageSquare size={16} />}>
                    Enviar Mensagem
                  </Button>
                  <div className="mt-5 pt-5 border-t border-zinc-100 space-y-2.5">
                    <div className="flex items-center gap-2 text-[13px] text-zinc-600">
                      <Clock size={15} className="text-green-500 shrink-0" />
                      Responde em <strong>1 hora</strong>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-zinc-600">
                      <ShieldCheck size={15} className="text-primary shrink-0" />
                      Garantia de satisfação
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl p-5" style={{ border: "1px solid #f4f4f5" }}>
                  <h3 className="text-[14px] mb-3" style={{ color: "#09090b", fontWeight: 700 }}>Horários Livres</h3>
                  <p className="text-[10px] text-zinc-400 mb-3">Fuso: Brasília</p>
                  <div className="grid grid-cols-3 gap-2">
                    <p className="col-span-3 text-[11px] text-zinc-400" style={{ fontWeight: 600 }}>Hoje</p>
                    {["14:00", "15:30"].map(t => (
                      <Button key={t} size="sm" variant="flat" color="success" className="text-[12px]" style={{ fontWeight: 600 }}
                        onPress={openBooking}>
                        {t}
                      </Button>
                    ))}
                    <Button size="sm" variant="flat" isDisabled className="text-[12px] line-through">18:00</Button>
                    <p className="col-span-3 text-[11px] text-zinc-400 mt-2" style={{ fontWeight: 600 }}>Amanhã</p>
                    {["09:00", "10:00"].map(t => (
                      <Button key={t} size="sm" variant="flat" color="success" className="text-[12px]" style={{ fontWeight: 600 }}
                        onPress={openBooking}>
                        {t}
                      </Button>
                    ))}
                    <Button size="sm" variant="flat" isDisabled className="text-[12px] line-through">14:00</Button>
                  </div>
                  <Button variant="light" color="primary" className="w-full mt-4 text-[12px]" style={{ fontWeight: 600 }}
                    onPress={openBooking}>
                    Ver agenda completa
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          teacher={teacher}
        />
      </div>
    </DashboardLayout>
  );
};
