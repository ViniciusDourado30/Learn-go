import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { useAuthStore } from "../store/authStore";
import { usePerfil, useMeusCursos, useMeusAgendamentos, useAtividadeSemanal, getImageUrl } from "../hooks/useDashboard";
import {
  Clock, BookOpen, Star, Trophy,
  TrendingUp, Users, ArrowRight, Play,
  PlusCircle, BarChart2, Calendar, Flame, Zap, Video, Sparkles, Compass,
  ChevronRight, Award,
} from "lucide-react";
import { Avatar, Progress, Button, Chip, Skeleton } from "../components/ui/nextui-shim";
import { StatCard } from "./StatCard";
import { motion } from "framer-motion";

const SkeletonHome = () => (
  <div className="pb-10">
    <div className="px-5 md:px-8 py-12" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 50%, #0a1628 100%)" }}>
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-4">
          <Skeleton className="h-3 w-32 rounded" style={{ background: "rgba(255,255,255,0.1)" }} />
          <Skeleton className="h-10 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
          <Skeleton className="h-10 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
          <Skeleton className="h-4 w-2/3 rounded mt-4" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="flex gap-3 mt-8">
            <Skeleton className="h-11 w-44 rounded-xl" style={{ background: "rgba(255,255,255,0.08)" }} />
            <Skeleton className="h-11 w-32 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
          <div className="flex gap-3 mt-10">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-28 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }} />)}
          </div>
        </div>
        <Skeleton className="hidden lg:block w-[340px] h-[260px] rounded-2xl" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>
    </div>
  </div>
);

export const DashboardHome = () => {
  const { user } = useAuthStore();
  const role = user?.role;
  const navigate = useNavigate();
  const isProf = role === "professor" || role === "PROFESSOR";
  
  const { data: perfil, isLoading: loadingPerfil } = usePerfil();
  const { data: meusCursosData, isLoading: loadingCursos } = useMeusCursos();
  const { data: agendamentosData, isLoading: loadingAgendamentos } = useMeusAgendamentos();
  const { data: atividadeData, isLoading: loadingAtividade } = useAtividadeSemanal();

  const handleProfOnly = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (isProf) {
      navigate(path);
    } else {
      alert("Esta função é exclusiva para professores.");
    }
  };

  const loading = loadingPerfil || loadingCursos || loadingAgendamentos || loadingAtividade;

  const nome = perfil?.user?.nome || perfil?.nome || user?.nome || "Usuário";
  const saudacao = new Date().getHours() < 12 ? "Bom dia" : new Date().getHours() < 18 ? "Boa tarde" : "Boa noite";

  // Dynamic Courses mapping
  const enrolled = (meusCursosData || []).map((c: any) => ({
    id: c.id,
    title: c.titulo,
    instructor: c.professor?.nome + " " + (c.professor?.sobrenome || ""),
    progress: c.progress || 0,
    nextLesson: c.modulos?.[0]?.aulas?.[0]?.titulo || "Aula introdutória",
    duration: c.duracao_total_minutos ? `${c.duracao_total_minutos} min` : "0 min",
    thumb: getImageUrl(c.capa_url) || "https://images.unsplash.com/photo-1524178232363",
    avatar: getImageUrl(c.professor?.foto_url) || "https://ui-avatars.com/api/?name=Prof"
  }));

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    return timeStr.slice(0, 5);
  };

  const getDayLabel = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      const diffDays = Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return "Hoje";
      if (diffDays === 1) return "Amanhã";
      if (diffDays === -1) return "Ontem";
      const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      return `${weekdays[date.getDay()]}, ${d}/${m}`;
    } catch {
      return dateStr;
    }
  };

  const isPastClass = (dateStr: string, timeStr: string) => {
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      const [h, min] = timeStr.split(":").map(Number);
      const classEnd = new Date(y, m - 1, d, h + 1, min);
      return classEnd.getTime() < Date.now();
    } catch {
      return false;
    }
  };

  const proximasAulasRaw = (agendamentosData || [])
    .filter((a: any) => a.status !== "CONCLUIDA" && !isPastClass(a.data_aula, a.hora_inicio))
    .sort((a: any, b: any) => {
      return `${a.data_aula}T${a.hora_inicio}`.localeCompare(`${b.data_aula}T${b.hora_inicio}`);
    });

  const proximasAulas = proximasAulasRaw.slice(0, 3).map((a: any) => {
    const otherPersonName = isProf
      ? `${a.aluno?.nome || "Aluno"} ${a.aluno?.sobrenome || ""}`.trim()
      : `${a.professor?.nome || "Professor"} ${a.professor?.sobrenome || ""}`.trim();
    
    const otherPersonAvatar = isProf
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(otherPersonName)}&background=006FEE&color=fff`
      : (getImageUrl(a.professor?.foto_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherPersonName)}&background=006FEE&color=fff`);

    return {
      id: a.id,
      name: otherPersonName,
      subject: a.assunto || (isProf ? "Mentoria / Aula particular" : "Aula ao vivo"),
      time: formatTime(a.hora_inicio),
      day: getDayLabel(a.data_aula),
      avatar: otherPersonAvatar
    };
  });

  const aulasHojeCount = (agendamentosData || []).filter((a: any) => 
    a.status !== "CONCLUIDA" && getDayLabel(a.data_aula) === "Hoje" && !isPastClass(a.data_aula, a.hora_inicio)
  ).length;

  const weeklyActivity = atividadeData?.weeklyActivity || [
    { day: "Seg", hours: 0 },
    { day: "Ter", hours: 0 },
    { day: "Qua", hours: 0 },
    { day: "Qui", hours: 0 },
    { day: "Sex", hours: 0 },
    { day: "Sáb", hours: 0 },
    { day: "Dom", hours: 0 },
  ];
  const totalHoras = atividadeData?.totalHoras ?? 0;
  const maxH = Math.max(...weeklyActivity.map((x: any) => x.hours), 1.0);

  const daysMap = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const todayDayName = daysMap[new Date().getDay()];

  if (loading) return <DashboardLayout><SkeletonHome /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="pb-10">
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 50%, #0a1628 100%)" }}
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,111,238,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute bottom-0 left-[30%] w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />

          <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              
              <div className="flex-1 min-w-0">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <p className="text-[11px] uppercase tracking-[0.2em] mb-4" style={{ color: "rgba(96,165,250,0.6)", fontWeight: 600 }}>
                    {isProf ? "Painel do Professor" : `${saudacao}, ${nome}`} 👋
                  </p>
                  <h1 className="text-[32px] md:text-[40px] leading-[1.1] mb-4" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.03em" }}>
                    Você tem <span style={{ color: "#60a5fa" }}>{aulasHojeCount} aula{aulasHojeCount !== 1 ? "s" : ""}</span> hoje
                  </h1>
                  <p className="text-[14px] max-w-md mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Gerencie sua agenda, acompanhe {isProf ? "alunos e crie conteúdo" : "seus estudos e mentores"}.
                  </p>

                  <div className="flex items-center gap-3">
                    <Button color="primary" className="h-11 px-6 text-[13px]" style={{ fontWeight: 600 }}
                      startContent={<Calendar size={15} />}
                      onPress={() => navigate("/dashboard/agenda")}>
                      Ver agenda
                    </Button>
                    <Button variant="bordered" className="h-11 px-5 text-[13px] border-white/10 text-white/70 hover:text-white"
                      startContent={<PlusCircle size={15} />}
                      onPress={(e) => handleProfOnly(e as any, "/dashboard/create-course")}>
                      Criar curso
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="grid grid-cols-3 gap-3 mt-10 max-w-[560px]"
                >
                  <StatCard icon={Users} value={isProf ? "142" : String(enrolled.length)} label={isProf ? "Alunos" : "Cursos ativos"} color="#60a5fa" hint={isProf ? "+12 este mês" : "ativos"} delta={isProf ? "+9%" : "novo"} trend="up" spark={[110, 118, 125, 130, 134, 138, 142]} variant="dark" index={0} />
                  
                  {/* Rating Card Dynamic: if student -> locked, if prof -> shows rating */}
                  <div className="bg-white/5 rounded-xl p-4 flex flex-col justify-between" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(251,191,36,0.1)" }}>
                           <Star size={12} className="text-amber-400" />
                        </div>
                        <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Avaliação</span>
                     </div>
                     {isProf ? (
                        <>
                           <p className="text-[24px] text-white font-bold">{perfil?.profile?.rating || perfil?.rating || "5.0"}</p>
                           <p className="text-[11px] text-amber-400 mt-1">{perfil?.profile?.total_reviews || perfil?.total_reviews || 0} avaliações</p>
                        </>
                     ) : (
                        <>
                           <p className="text-[14px] text-white/50 font-bold mt-1">N/A</p>
                           <p className="text-[10px] text-white/30 mt-1">Apenas professores</p>
                        </>
                     )}
                  </div>

                  <StatCard icon={TrendingUp} value={isProf ? "R$4.250" : `${totalHoras}h`} label={isProf ? "Março" : "Tempo estudado"} color="#34d399" hint={isProf ? "vs. R$3.180 fev" : "esta semana"} delta={isProf ? "+33%" : "+2.3h"} trend="up" spark={[2, 3, 5, 8, 9, 11, totalHoras || 12]} variant="dark" index={2} />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="hidden lg:block w-[320px] shrink-0"
              >
                <div className="rounded-2xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] uppercase tracking-wider" style={{ color: "rgba(96,165,250,0.5)", fontWeight: 600 }}>Próximas aulas</p>
                    <Link to="/dashboard/agenda" className="text-[10px] text-blue-400 hover:underline">Ver tudo</Link>
                  </div>
                  {proximasAulas.length > 0 ? (
                    proximasAulas.map((s) => (
                      <div key={s.id} onClick={() => navigate("/dashboard/agenda")} className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-white/5 cursor-pointer">
                        <img src={s.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] truncate" style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{s.name}</p>
                          <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>{s.subject}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[12px]" style={{ color: "white", fontWeight: 700 }}>{s.time}</p>
                          <p className="text-[9px]" style={{ color: s.day === "Hoje" ? "#60a5fa" : "rgba(255,255,255,0.3)" }}>{s.day}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 px-2">
                      <Calendar size={28} className="mx-auto text-white/20 mb-2" />
                      <p className="text-[12px] text-white/60 font-medium">Nenhuma aula agendada</p>
                      <Button size="sm" variant="flat" color="primary" className="mt-3 text-[11px]" onPress={() => navigate(isProf ? "/dashboard/agenda" : "/dashboard/teachers")}>
                        {isProf ? "Ver agenda" : "Agendar aula"}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* BENTO GRID SECTION */}
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 -mt-1">
          <motion.section
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* Activity chart - 100% Dynamic */}
            <div className="bg-white rounded-2xl p-5 md:col-span-2 shadow-sm hover:shadow-md transition-shadow" style={{ border: "1px solid #f4f4f5" }}>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-[15px]" style={{ color: "#09090b", fontWeight: 700 }}>
                    Atividade {isProf ? "de Ensino" : "Semanal"}
                  </h3>
                  <p className="text-[11px] mt-0.5" style={{ color: "#a1a1aa" }}>Horas por dia esta semana (cursos gravados + aulas ao vivo)</p>
                </div>
                <div className="text-right">
                  <p className="text-[24px]" style={{ color: "#09090b", fontWeight: 800, lineHeight: 1 }}>{totalHoras}h</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <TrendingUp size={11} className="text-green-500" />
                    <span className="text-[11px] text-green-500" style={{ fontWeight: 600 }}>Total</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-3 h-24">
                {weeklyActivity.map((d: any) => {
                  const pct = maxH > 0 ? (d.hours / maxH) * 100 : 0;
                  const isToday = d.day === todayDayName;
                  return (
                    <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-full rounded-xl transition-all relative group cursor-pointer"
                        style={{
                          height: `${Math.max(pct * 0.8, 8)}px`,
                          background: isToday
                            ? "linear-gradient(180deg, #006FEE, #338ef7)"
                            : d.hours > 0 ? "#93c5fd" : "#f4f4f5",
                          borderRadius: "8px",
                        }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-zinc-800 text-white text-[9px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20" style={{ fontWeight: 600 }}>
                          {d.hours}h
                        </div>
                      </div>
                      <span className="text-[10px]" style={{ color: isToday ? "#006FEE" : "#a1a1aa", fontWeight: isToday ? 700 : 500 }}>
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 pt-4" style={{ borderTop: "1px solid #f4f4f5" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px]" style={{ color: "#71717a" }}>Meta semanal</span>
                  <span className="text-[11px]" style={{ color: "#006FEE", fontWeight: 700 }}>{totalHoras}h / 15h</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((totalHoras / 15) * 100, 100)}%`, background: "linear-gradient(90deg, #006FEE, #60a5fa)" }} />
                </div>
              </div>
            </div>

            {/* Schedule / Next sessions - Matching Agenda */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow" style={{ border: "1px solid #f4f4f5" }}>
              <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <h3 className="text-[15px]" style={{ color: "#09090b", fontWeight: 700 }}>
                  Agenda
                </h3>
                <Link to="/dashboard/agenda" className="text-[11px] hover:opacity-70" style={{ color: "#006FEE", fontWeight: 600 }}>
                  Ver tudo
                </Link>
              </div>

              <div className="px-3 pb-2">
                {proximasAulas.length > 0 ? (
                  proximasAulas.map((s, i) => (
                    <div key={s.id} onClick={() => navigate("/dashboard/agenda")} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors"
                      style={{ borderBottom: i < proximasAulas.length - 1 ? "1px solid #fafafa" : "none" }}>
                      <Avatar src={s.avatar} className="w-9 h-9 shrink-0" size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] truncate" style={{ color: "#09090b", fontWeight: 600 }}>
                          {s.name}
                        </p>
                        <p className="text-[10px] truncate" style={{ color: "#a1a1aa" }}>{s.subject}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[12px]" style={{ color: "#09090b", fontWeight: 700 }}>{s.time}</p>
                        <p className="text-[9px]" style={{ color: s.day === "Hoje" ? "#006FEE" : "#a1a1aa", fontWeight: s.day === "Hoje" ? 600 : 400 }}>{s.day}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center px-4">
                    <Calendar size={24} className="mx-auto text-zinc-300 mb-2" />
                    <p className="text-[12px] text-zinc-500 font-medium">Nenhuma aula para os próximos dias</p>
                  </div>
                )}
              </div>

              <div className="px-4 pb-4 pt-1">
                <Button
                  variant="flat"
                  color="primary"
                  size="sm"
                  className="w-full text-[12px]"
                  style={{ fontWeight: 600 }}
                  startContent={<Zap size={13} />}
                  onPress={() => navigate(isProf ? "/dashboard/agenda" : "/dashboard/teachers")}
                >
                  {isProf ? "Ver agenda completa" : "Agendar sessão"}
                </Button>
              </div>
            </div>
          </motion.section>

          {/* Quick actions - For Both, but alert for student on prof-only actions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {[
              { icon: PlusCircle, label: "Criar Curso", desc: "Novo conteúdo", path: "/dashboard/create-course", gradient: "linear-gradient(135deg, #eff6ff, #dbeafe)" },
              { icon: BarChart2, label: "Relatório", desc: "Desempenho", path: "/dashboard/availability", gradient: "linear-gradient(135deg, #dcfce7, #bbf7d0)" },
              { icon: Users, label: "Professores", desc: "Explorar mentores", path: "/dashboard/teachers", gradient: "linear-gradient(135deg, #f3e8ff, #e9d5ff)" },
              { icon: Video, label: "Ao Vivo", desc: `${proximasAulas.length} agendadas`, path: "/dashboard/agenda", gradient: "linear-gradient(135deg, #fef9c3, #fef08a)" },
            ].map((action) => (
              <div
                key={action.label}
                onClick={(e) => action.path === "/dashboard/teachers" || action.path === "/dashboard/agenda" ? navigate(action.path) : handleProfOnly(e as any, action.path)}
                className="rounded-2xl p-5 flex items-start gap-4 group transition-all hover:shadow-md cursor-pointer"
                style={{ background: action.gradient, border: "1px solid rgba(0,0,0,0.04)" }}
              >
                <action.icon size={20} style={{ color: "#3f3f46" }} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-[13px]" style={{ color: "#09090b", fontWeight: 700 }}>{action.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "#71717a" }}>{action.desc}</p>
                </div>
              </div>
            ))}
          </motion.section>
        </div>
      </div>
    </DashboardLayout>
  );
};
