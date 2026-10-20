import React, { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Link, useParams } from "react-router-dom";
import {
  useProfessor, useDisponibilidadeProfessor, useAgendarAula,
  getImageUrl, useAvaliacoesProfessor, useCriarAvaliacao, usePodeAvaliarProfessor
} from "../hooks/useDashboard";
import { ChevronLeft, Star, MessageSquare, Calendar as CalendarIcon, ShieldCheck, Award, Clock, ThumbsUp, Heart, Languages, Share2, Check, X, AlertCircle } from "lucide-react";
import { Avatar, Button, Chip } from "../components/ui/nextui-shim";
import { StatCard } from "./StatCard";
import { StripePaymentForm } from "./StripePaymentForm/StripePaymentForm";
import { motion, AnimatePresence } from "framer-motion";
import { Country } from "country-state-city";
import { useAuthStore } from "../store/authStore";

const BookingModal = ({ 
  isOpen, 
  onClose, 
  teacher, 
  apiDisp,
  initialDateIdx = null,
  initialTime = null
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  teacher: any; 
  apiDisp: any;
  initialDateIdx?: number | null;
  initialTime?: string | null;
}) => {
  const [step, setStep] = useState<"date" | "time" | "confirm" | "payment" | "success">("date");
  const [selectedDateIdx, setSelectedDateIdx] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [lessonType, setLessonType] = useState<"individual" | "group">("individual");
  const [lessonTopic, setLessonTopic] = useState("");
  const { mutate: agendarAula } = useAgendarAula();

  // Gera os próximos 14 dias
  const dates = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      list.push({
        date: d,
        dayName: d.toLocaleDateString("pt-BR", { weekday: "short" }),
        dayNum: d.getDate(),
        monthShort: d.toLocaleDateString("pt-BR", { month: "short" }),
        isToday: i === 0,
        dayOfWeek: d.getDay(),
      });
    }
    return list;
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialDateIdx !== null && initialTime) {
        setSelectedDateIdx(initialDateIdx);
        setSelectedTime(initialTime);
        setStep("confirm");
      } else {
        setSelectedDateIdx(null);
        setSelectedTime(null);
        setStep("date");
      }
    }
  }, [isOpen, initialDateIdx, initialTime]);

  const blocosArray: any[] = useMemo(() => {
    if (!apiDisp) return [];
    if (Array.isArray(apiDisp)) return apiDisp;
    if (Array.isArray(apiDisp.horarios_configurados)) return apiDisp.horarios_configurados;
    return [];
  }, [apiDisp]);

  const isDayAvailable = (dayOfWeek: number) => {
    return blocosArray.some((b: any) => b.dia_semana === dayOfWeek);
  };

  const availableTimes = useMemo(() => {
    if (selectedDateIdx === null) return [];
    const selected = dates[selectedDateIdx];
    if (!selected) return [];

    const blocosDoDia = blocosArray.filter((b: any) => b.dia_semana === selected.dayOfWeek);
    
    const times: { time: string; hora_inicio: string; hora_fim: string; label: string; preco: number; duracao: string }[] = [];
    blocosDoDia.forEach((bloco: any) => {
      try {
        const [sh, sm] = (bloco.hora_inicio || "09:00").split(":").map(Number);
        const [eh, em] = (bloco.hora_fim || "10:00").split(":").map(Number);
        const diffMin = (eh * 60 + em) - (sh * 60 + sm);
        const horas = Math.floor(diffMin / 60);
        const minutos = diffMin % 60;
        const duracaoLabel = horas > 0 && minutos > 0 
          ? `${horas}h ${minutos}min` 
          : horas > 0 
          ? `${horas} hora${horas > 1 ? "s" : ""}` 
          : `${minutos} min`;

        times.push({
          time: bloco.hora_inicio,
          hora_inicio: bloco.hora_inicio,
          hora_fim: bloco.hora_fim,
          label: `${bloco.hora_inicio} – ${bloco.hora_fim}`,
          preco: Number(bloco.preco) || (teacher?.price || 60),
          duracao: duracaoLabel || "1 hora",
        });
      } catch {
        // formato inesperado
      }
    });
    
    return times;
  }, [selectedDateIdx, blocosArray, dates, teacher?.price]);

  const selectedDate = selectedDateIdx !== null ? dates[selectedDateIdx] : null;
  const selectedSlot = availableTimes.find(t => t.time === selectedTime);
  const basePrice = selectedSlot ? selectedSlot.preco : (teacher?.price || 60);

  const lessonPrice = lessonType === "individual" ? basePrice : Math.round(basePrice * 0.6);

  const handleClose = () => { 
    onClose(); 
    setTimeout(() => { 
      setStep("date"); 
      setSelectedDateIdx(null); 
      setSelectedTime(null); 
      setLessonTopic(""); 
    }, 300); 
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) return;
    const mesFormatado = String(selectedDate.date.getMonth() + 1).padStart(2, '0');
    const diaFormatado = String(selectedDate.date.getDate()).padStart(2, '0');
    const dataIso = `${selectedDate.date.getFullYear()}-${mesFormatado}-${diaFormatado}`;
    
    agendarAula({
      professorId: teacher.id,
      data_aula: dataIso,
      hora_inicio: selectedSlot ? selectedSlot.hora_inicio : selectedTime,
      hora_fim: selectedSlot ? selectedSlot.hora_fim : `${parseInt(selectedTime) + 1}:00`,
      preco_cobrado: lessonPrice,
      assunto: lessonTopic || "Mentoria Geral"
    }, { 
      onSuccess: () => setStep("success"),
      onError: (err: any) => alert(err?.response?.data?.message || "Erro ao agendar aula.")
    });
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
                  <Avatar src={teacher.imageUrl} className="w-10 h-10" />
                  <div>
                    <h3 className="text-[14px] font-bold text-zinc-900">Agendar com {teacher.name}</h3>
                    <p className="text-[12px] text-zinc-400">R$ {lessonPrice} · {selectedSlot?.duracao || "1 aula"}</p>
                  </div>
                </div>
                <button onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors">
                  <X size={16} className="text-zinc-400" />
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {step === "date" && (
                  <motion.div key="date" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h4 className="text-[14px] font-bold text-zinc-900 mb-3">Selecione uma data</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {dates.map((d, i) => {
                        const available = isDayAvailable(d.dayOfWeek);
                        const isSelected = selectedDateIdx === i;
                        return (
                          <button
                            key={i}
                            disabled={!available}
                            onClick={() => {
                              setSelectedDateIdx(i);
                              setSelectedTime(null);
                            }}
                            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                              !available
                                ? "opacity-30 cursor-not-allowed bg-zinc-50 border border-zinc-100 text-zinc-400"
                                : isSelected
                                ? "bg-primary text-white shadow-sm"
                                : "hover:bg-zinc-50 border border-zinc-200 cursor-pointer text-zinc-800"
                            }`}
                          >
                            <span className={`text-[10px] uppercase font-medium ${isSelected ? "text-white/80" : "text-zinc-500"}`}>{d.dayName}</span>
                            <span className="text-[15px] font-medium">{d.dayNum}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === "time" && (
                  <motion.div key="time" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h4 className="text-[14px] font-bold text-zinc-900 mb-3">Horários disponíveis para {formatFullDate()}</h4>
                    {availableTimes.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2.5">
                        {availableTimes.map((item) => {
                          const isSelected = selectedTime === item.time;
                          return (
                            <button
                              key={item.time}
                              type="button"
                              onClick={() => setSelectedTime(item.time)}
                              className="flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all text-center"
                              style={{
                                background: isSelected ? "#006FEE" : "#fafafa",
                                color: isSelected ? "white" : "#09090b",
                                border: isSelected ? "2px solid #006FEE" : "1px solid #e4e4e7",
                                fontWeight: 600,
                              }}
                            >
                              <span className="text-[13px] font-bold">{item.label}</span>
                              <span className="text-[11px] mt-0.5" style={{ opacity: isSelected ? 0.9 : 0.6 }}>
                                {item.duracao} · R$ {item.preco}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-zinc-400 text-[13px] bg-zinc-50 rounded-2xl border border-zinc-100">
                        Nenhum horário configurado pelo professor para este dia.
                      </div>
                    )}
                  </motion.div>
                )}

                {step === "confirm" && (
                  <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Data</span>
                        <span className="font-semibold text-zinc-900">{formatFullDate()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Horário</span>
                        <span className="font-semibold text-zinc-900">{selectedSlot ? `${selectedSlot.label} (${selectedSlot.duracao})` : selectedTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Valor</span>
                        <span className="font-bold text-primary">R$ {lessonPrice}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-zinc-900 mb-1.5">Tema ou assunto da aula</label>
                      <textarea 
                        value={lessonTopic} 
                        onChange={(e) => setLessonTopic(e.target.value)} 
                        placeholder="Ex: Dúvidas sobre o projeto, conversação, etc." 
                        className="w-full p-3 rounded-xl border border-zinc-200 text-sm outline-none resize-none bg-white focus:border-primary" 
                        rows={3} 
                      />
                    </div>
                  </motion.div>
                )}

                {step === "payment" && (
                  <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <StripePaymentForm 
                      payload={{ 
                        professorId: teacher.id, 
                        data_aula: `${selectedDate?.date.getFullYear()}-${String(selectedDate?.date.getMonth()! + 1).padStart(2, '0')}-${String(selectedDate?.date.getDate()).padStart(2, '0')}`, 
                        hora_inicio: selectedSlot ? selectedSlot.hora_inicio : (selectedTime || "09:00"), 
                        hora_fim: selectedSlot ? selectedSlot.hora_fim : `${parseInt(selectedTime || "9") + 1}:00`, 
                        preco_cobrado: lessonPrice, 
                        assunto: lessonTopic || "Aula agendada", 
                        amount: lessonPrice, 
                        type: 'agendamento' 
                      }} 
                      onSuccess={handleConfirmBooking} 
                    />
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8 text-center">
                    <Check size={50} className="text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold">Aula agendada com sucesso!</h2>
                    <p className="text-zinc-500 text-sm mt-2">Você pode acompanhar suas sessões diretamente na sua Agenda.</p>
                    <Button color="primary" className="mt-6 w-full font-semibold" onPress={handleClose}>Voltar ao perfil</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {step !== "success" && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-zinc-100">
                <Button variant="light" size="sm" onPress={() => { if (step === "date") handleClose(); else if (step === "time") setStep("date"); else if (step === "confirm") setStep("time"); else if (step === "payment") setStep("confirm"); }}>Voltar</Button>
                {step === "date" && <Button color="primary" size="sm" isDisabled={selectedDateIdx === null} onPress={() => setStep("time")}>Continuar</Button>}
                {step === "time" && <Button color="primary" size="sm" isDisabled={!selectedTime} onPress={() => setStep("confirm")}>Continuar</Button>}
                {step === "confirm" && <Button color="primary" size="sm" onPress={() => setStep("payment")}>Ir para Pagamento</Button>}
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
  const [initialBookingDate, setInitialBookingDate] = useState<number | null>(null);
  const [initialBookingTime, setInitialBookingTime] = useState<string | null>(null);
  
  const { data: teacherData, isLoading } = useProfessor(id!);
  const { data: disp } = useDisponibilidadeProfessor(id!);
  const { data: avaliacoes } = useAvaliacoesProfessor(id!);
  const { data: podeAvaliarData } = usePodeAvaliarProfessor(id!);
  const { mutate: criarAvaliacao, isPending: enviandoAvaliacao } = useCriarAvaliacao();
  const { user } = useAuthStore();
  const isProfUser = user?.role === "PROFESSOR" || user?.role === "professor";
  const isSelf = user?.id === teacherData?.userId;
  const podeAvaliar = !isProfUser && !isSelf && podeAvaliarData?.pode === true;
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewNota, setReviewNota] = useState(5);
  const [reviewComentario, setReviewComentario] = useState("");
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewError, setReviewError] = useState("");

  const slotsToday = useMemo(() => {
    const blocosArray: any[] = Array.isArray(disp?.horarios_configurados)
      ? disp.horarios_configurados
      : (Array.isArray(disp) ? disp : []);
    const todayDay = new Date().getDay();
    const blocos = blocosArray.filter((b: any) => b.dia_semana === todayDay);
    return blocos.map((b: any) => ({
      time: b.hora_inicio,
      label: `${b.hora_inicio} – ${b.hora_fim}`
    }));
  }, [disp]);

  const slotsTomorrow = useMemo(() => {
    const blocosArray: any[] = Array.isArray(disp?.horarios_configurados)
      ? disp.horarios_configurados
      : (Array.isArray(disp) ? disp : []);
    const tomorrowDay = (new Date().getDay() + 1) % 7;
    const blocos = blocosArray.filter((b: any) => b.dia_semana === tomorrowDay);
    return blocos.map((b: any) => ({
      time: b.hora_inicio,
      label: `${b.hora_inicio} – ${b.hora_fim}`
    }));
  }, [disp]);

  const handleSubmitReview = () => {
    setReviewError("");
    criarAvaliacao({ professorId: id!, nota: reviewNota, comentario: reviewComentario || undefined }, {
      onSuccess: () => {
        setReviewOpen(false);
        setReviewNota(5);
        setReviewComentario("");
        setReviewError("");
      },
      onError: (err: any) => {
        setReviewError(err?.response?.data?.message || "Você só pode avaliar este professor após comprar um curso dele ou realizar uma aula agendada.");
      }
    });
  };

  if (isLoading) return <DashboardLayout><div className="p-8 text-center text-zinc-500">Buscando professor...</div></DashboardLayout>;
  if (!teacherData) return <DashboardLayout><div className="p-8 text-center text-zinc-500">Professor não encontrado.</div></DashboardLayout>;

  // Lógica da Bandeira dinâmica
  const countryData = Country.getAllCountries().find(c => c.name === teacherData.pais);

  const teacher = {
    id: teacherData.id,
    name: `${teacherData.nome} ${teacherData.sobrenome}`,
    badge: teacherData.ocupacao || "Professor Certificado",
    headline: teacherData.sobre ? teacherData.sobre.slice(0, 80) + "..." : "Especialista em ensino personalizado.",
    country: teacherData.pais || "País não informado",
    countryCode: countryData?.isoCode?.toLowerCase(),
    rating: teacherData.rating || 5.0,
    reviews: teacherData.total_reviews || 0,
    students: 12,
    lessons: 28, 
    price: teacherData.preco_medio || 60,
    imageUrl: getImageUrl(teacherData.foto_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherData.nome)}&background=006FEE&color=fff`,
    about: teacherData.sobre || "Sem descrição informada.",
    languages: teacherData.idiomas && teacherData.idiomas.length > 0 ? teacherData.idiomas : ["Português (Nativo)"],
    skills: teacherData.especialidades && teacherData.especialidades.length > 0 ? teacherData.especialidades : ["Didática", "Metodologia Ágil", "Prática"],
  };

  const openBooking = () => {
    setInitialBookingDate(null);
    setInitialBookingTime(null);
    setBookingOpen(true);
  };

  const openBookingWithSlot = (dateIdx: number, time: string) => {
    setInitialBookingDate(dateIdx);
    setInitialBookingTime(time);
    setBookingOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="pb-10">
        {/* Hero Banner */}
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 50%, #0a1628 100%)" }}>
          <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12">
            <Link to="/dashboard/teachers" className="inline-flex items-center gap-1.5 text-[12px] mb-6 text-white/50 hover:text-white transition-colors" style={{ fontWeight: 500 }}>
              <ChevronLeft size={14} /> Voltar para professores
            </Link>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="relative shrink-0">
                <Avatar src={teacher.imageUrl} className="w-24 h-24 md:w-32 md:h-32 rounded-2xl" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-[26px] md:text-[34px] text-white" style={{ fontWeight: 800 }}>{teacher.name}</h1>
                  {teacher.countryCode && (
                    <img src={`https://flagcdn.com/w20/${teacher.countryCode}.png`} alt="" className="w-5 h-3.5 rounded-sm shadow-sm" />
                  )}
                  <Chip size="sm" color="primary" variant="flat" className="text-[10px]">{teacher.badge}</Chip>
                </div>

                <p className="text-[14px] text-white/50 max-w-xl mb-6 leading-relaxed">{teacher.headline}</p>

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
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid #f4f4f5" }}>
                <h2 className="text-[16px] mb-3" style={{ color: "#09090b", fontWeight: 700 }}>Sobre o professor</h2>
                <p className="text-[13px] text-zinc-600 leading-relaxed mb-6 whitespace-pre-line">{teacher.about}</p>

                <h3 className="text-[14px] mb-3" style={{ color: "#09090b", fontWeight: 700 }}>Especialidades</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {teacher.skills.map((skill: string) => (
                    <Chip key={skill} size="sm" variant="flat" color="default" className="text-[11px] font-medium">{skill}</Chip>
                  ))}
                </div>

                <h3 className="text-[14px] mb-3" style={{ color: "#09090b", fontWeight: 700 }}>Idiomas</h3>
                <div className="flex items-center gap-2">
                  <Languages size={14} className="text-zinc-400" />
                  <span className="text-[13px] text-zinc-500">{teacher.languages.join(" · ")}</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid #f4f4f5" }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-[16px]" style={{ color: "#09090b", fontWeight: 700 }}>Avaliações ({avaliacoes?.length || 0})</h2>
                    {!podeAvaliar && (
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {isProfUser
                          ? "Professores não podem avaliar outros professores."
                          : isSelf
                          ? "Você não pode avaliar seu próprio perfil."
                          : "Disponível após comprar um curso ou realizar uma aula com este professor."}
                      </p>
                    )}
                  </div>
                  {podeAvaliar && (
                    <Button 
                      size="sm" 
                      color="primary" 
                      variant="flat" 
                      style={{ fontWeight: 600 }} 
                      onPress={() => setReviewOpen(!reviewOpen)}
                    >
                      Avaliar professor
                    </Button>
                  )}
                </div>

                {reviewOpen && (
                  <div className="mb-5 p-4 rounded-xl border border-primary/20 bg-primary/5">
                    <p className="text-[13px] mb-3" style={{ color: "#09090b", fontWeight: 600 }}>Sua avaliação</p>
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map(i => (
                        <button key={i} onMouseEnter={() => setReviewHover(i)} onMouseLeave={() => setReviewHover(0)} onClick={() => setReviewNota(i)}>
                          <Star size={20} className={(reviewHover || reviewNota) >= i ? "fill-amber-400 text-amber-400" : "text-zinc-300"} />
                        </button>
                      ))}
                      <span className="text-[13px] ml-2" style={{ color: "#09090b", fontWeight: 700 }}>{reviewNota}/5</span>
                    </div>
                    <textarea value={reviewComentario} onChange={e => { setReviewComentario(e.target.value); setReviewError(""); }} placeholder="Escreva um comentário sobre sua experiência com este professor..." className="w-full p-3 rounded-xl border border-zinc-200 text-[13px] outline-none resize-none bg-white" rows={3} />
                    
                    {reviewError && (
                      <div className="flex items-center gap-1.5 text-red-500 text-[12px] font-medium mt-2">
                        <AlertCircle size={14} />
                        <span>{reviewError}</span>
                      </div>
                    )}

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="flat" onPress={() => { setReviewOpen(false); setReviewError(""); }}>Cancelar</Button>
                      <Button size="sm" color="primary" style={{ fontWeight: 600 }} isLoading={enviandoAvaliacao} onPress={handleSubmitReview}>Enviar avaliação</Button>
                    </div>
                  </div>
                )}

                {avaliacoes && avaliacoes.length > 0 ? (
                  <div className="space-y-5">
                    {avaliacoes.map((av: any) => (
                      <div key={av.id} className="pb-5" style={{ borderBottom: "1px solid #f4f4f5" }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(av.aluno?.nome || "Aluno")}&background=006FEE&color=fff`} className="w-8 h-8" size="sm" />
                            <div>
                              <p className="text-[13px]" style={{ color: "#09090b", fontWeight: 600 }}>{av.aluno?.nome} {av.aluno?.sobrenome?.charAt(0)}.</p>
                              <p className="text-[11px] text-zinc-400">{new Date(av.criado_em).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                          <div className="flex text-amber-400">
                            {[1,2,3,4,5].map(i => <Star key={i} size={12} className={i <= av.nota ? "fill-current" : "text-zinc-200"} />)}
                          </div>
                        </div>
                        {av.comentario && <p className="text-[13px] text-zinc-600 leading-relaxed">"{av.comentario}"</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-zinc-400 text-center py-6">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
                )}
              </motion.div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-5">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid #f4f4f5" }}>
                  <div className="flex items-end gap-1.5 mb-5">
                    <span className="text-[30px]" style={{ color: "#09090b", fontWeight: 800, lineHeight: 1 }}>R$ {teacher.price}</span>
                    <span className="text-[13px] text-zinc-400 mb-1">/ hora</span>
                  </div>
                  <Button color="primary" className="w-full h-12 text-[14px]" style={{ fontWeight: 600 }} startContent={<CalendarIcon size={18} />} onPress={openBooking}>
                    Agendar Aula
                  </Button>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid #f4f4f5" }}>
                  <h3 className="text-[14px] mb-3" style={{ color: "#09090b", fontWeight: 700 }}>Horários Livres</h3>
                  <p className="text-[10px] text-zinc-400 mb-3">Fuso: Brasília</p>
                  
                  <div className="space-y-2">
                    <p className="text-[11px] text-zinc-400" style={{ fontWeight: 600 }}>Hoje</p>
                    {slotsToday.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        {slotsToday.map((s: { time: string; label: string }) => (
                          <Button key={s.time} size="sm" variant="flat" color="success" className="w-full text-[12px] justify-center" style={{ fontWeight: 600 }} onPress={() => openBookingWithSlot(0, s.time)}>
                            {s.label}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[12px] text-zinc-400 mb-2">Nenhum horário hoje.</p>
                    )}

                    <p className="text-[11px] text-zinc-400 mt-3" style={{ fontWeight: 600 }}>Amanhã</p>
                    {slotsTomorrow.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        {slotsTomorrow.map((s: { time: string; label: string }) => (
                          <Button key={s.time} size="sm" variant="flat" color="success" className="w-full text-[12px] justify-center" style={{ fontWeight: 600 }} onPress={() => openBookingWithSlot(1, s.time)}>
                            {s.label}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[12px] text-zinc-400 mb-2">Nenhum horário amanhã.</p>
                    )}
                  </div>
                  <Button variant="light" color="primary" className="w-full mt-4 text-[12px]" style={{ fontWeight: 600 }} onPress={openBooking}>Ver agenda completa</Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <BookingModal 
          isOpen={bookingOpen} 
          onClose={() => setBookingOpen(false)} 
          teacher={teacher} 
          apiDisp={disp}
          initialDateIdx={initialBookingDate}
          initialTime={initialBookingTime}
        />
      </div>
    </DashboardLayout>
  );
};