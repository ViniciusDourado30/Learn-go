import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { DashboardLayout } from "./DashboardLayout";
import { useRole } from "../hooks/useRole";
import {
  Clock, BookOpen, Star, Trophy,
  TrendingUp, Users, ArrowRight, Play,
  PlusCircle, BarChart2, Calendar, Flame, Zap, Video, Sparkles, Compass,
  ChevronRight, Award,
} from "lucide-react";
import { Avatar, Progress, Button, Chip, Skeleton } from "../components/ui/nextui-shim";
import { StatCard } from "./StatCard";
import { motion } from "motion/react";

const inProgressCourses = [
  {
    id: 1, title: "Inglês Intermediário", instructor: "Sarah Mitchell", progress: 68,
    nextLesson: "Aula 28 – Present Perfect", duration: "18 min",
    thumb: "https://images.unsplash.com/photo-1673515335564-fbe94030e4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1758685848226-eedca8f6bce7?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80",
  },
  {
    id: 2, title: "Cálculo Diferencial", instructor: "Carlos Mendes", progress: 35,
    nextLesson: "Aula 22 – Integrais", duration: "24 min",
    thumb: "https://images.unsplash.com/photo-1758685734363-9ca32535183d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1755552370726-e8a4ce0250ee?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80",
  },
  {
    id: 3, title: "Python do Zero", instructor: "Aiko Tanaka", progress: 82,
    nextLesson: "Aula 46 – APIs FastAPI", duration: "31 min",
    thumb: "https://images.unsplash.com/photo-1733412505442-36cfa59a4240?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1758685847747-597ce085906e?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80",
  },
];

const upcomingSessions = [
  { id: 1, teacher: "Sarah Mitchell", subject: "Conversação em Inglês", time: "19:00", day: "Hoje", avatar: "https://images.unsplash.com/photo-1758685848226-eedca8f6bce7?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80" },
  { id: 2, teacher: "Carlos Mendes", subject: "Cálculo – Dúvidas", time: "14:00", day: "Amanhã", avatar: "https://images.unsplash.com/photo-1755552370726-e8a4ce0250ee?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80" },
  { id: 3, teacher: "Aiko Tanaka", subject: "Python – Projeto Final", time: "10:00", day: "Sex", avatar: "https://images.unsplash.com/photo-1758685847747-597ce085906e?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80" },
];

const upcomingToTeach = [
  { id: 1, student: "Maria João", subject: "Inglês – Conversação", time: "19:00", day: "Hoje", avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80" },
  { id: 2, student: "João Pereira", subject: "Business English", time: "21:00", day: "Hoje", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80" },
  { id: 3, student: "Ana Costa", subject: "IELTS Preparation", time: "09:00", day: "Amanhã", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80" },
];

const weeklyActivity = [
  { day: "Seg", hours: 1.5 }, { day: "Ter", hours: 2.8 }, { day: "Qua", hours: 1.0 },
  { day: "Qui", hours: 3.2 }, { day: "Sex", hours: 2.5 }, { day: "Sáb", hours: 0.5 }, { day: "Dom", hours: 1.8 },
];

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
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 mt-8 space-y-6">
      <div>
        <Skeleton className="h-4 w-40 mb-4 rounded" />
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="shrink-0 w-[320px] h-[240px] rounded-2xl" />)}
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="md:col-span-2 h-[260px] rounded-2xl" />
        <Skeleton className="h-[260px] rounded-2xl" />
      </div>
    </div>
  </div>
);

export const DashboardHome = () => {
  const { role } = useRole();
  const navigate = useNavigate();
  const isProf = role === "professor";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);
  const totalHours = weeklyActivity.reduce((a, d) => a + d.hours, 0).toFixed(1);
  const maxH = Math.max(...weeklyActivity.map(x => x.hours));
  const heroCourse = inProgressCourses[2]; // highest progress

  if (loading) return <DashboardLayout><SkeletonHome /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="pb-10">
        {/* ═══ HERO: Continue Watching / Today's Agenda ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 50%, #0a1628 100%)" }}
        >
          {/* BG blurs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,111,238,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute bottom-0 left-[30%] w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />

          <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              {/* Left text */}
              <div className="flex-1 min-w-0">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <p className="text-[11px] uppercase tracking-[0.2em] mb-4" style={{ color: "rgba(96,165,250,0.6)", fontWeight: 600 }}>
                    {isProf ? "Painel do Professor" : "Bom dia, Alex"} 👋
                  </p>
                  <h1 className="text-[32px] md:text-[40px] leading-[1.1] mb-4" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.03em" }}>
                    {isProf ? (
                      <>Você tem <span style={{ color: "#60a5fa" }}>3 aulas</span> hoje</>
                    ) : (
                      <>Continue de onde<br /><span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #a78bfa)" }}>parou.</span></>
                    )}
                  </h1>
                  <p className="text-[14px] max-w-md mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {isProf
                      ? "Gerencie sua agenda, acompanhe alunos e crie conteúdo."
                      : `${heroCourse.title} – ${heroCourse.nextLesson}`}
                  </p>

                  {!isProf && (
                    <div className="flex items-center gap-4">
                      <Button color="primary" className="h-11 px-6 text-[13px] gap-2.5" style={{ fontWeight: 600 }}
                        onPress={() => navigate(`/dashboard/courses/${heroCourse.id}`)}>
                        <Play size={15} fill="currentColor" /> Continuar · {heroCourse.duration}
                      </Button>
                      <div className="hidden sm:flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden">
                          <img src={heroCourse.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>Instrutor</p>
                          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{heroCourse.instructor}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isProf && (
                    <div className="flex items-center gap-3">
                      <Button color="primary" className="h-11 px-6 text-[13px]" style={{ fontWeight: 600 }}
                        startContent={<Calendar size={15} />}
                        onPress={() => navigate("/dashboard/agenda")}>
                        Ver agenda
                      </Button>
                      <Button variant="bordered" className="h-11 px-5 text-[13px] border-white/10 text-white/70 hover:text-white"
                        startContent={<PlusCircle size={15} />}
                        onPress={() => navigate("/dashboard/create-course")}>
                        Criar curso
                      </Button>
                    </div>
                  )}
                </motion.div>

                {/* Stat cards refined */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="grid grid-cols-3 gap-3 mt-10 max-w-[560px]"
                >
                  {(isProf
                    ? [
                        { icon: Users, value: "142", label: "Alunos", color: "#60a5fa", hint: "+12 este mês", delta: "+9%", trend: "up" as const, spark: [110, 118, 125, 130, 134, 138, 142] },
                        { icon: Star, value: "4.9", label: "Avaliação", color: "#fbbf24", hint: "238 reviews", delta: "+0.2", trend: "up" as const, spark: [4.4, 4.5, 4.6, 4.7, 4.7, 4.8, 4.9] },
                        { icon: TrendingUp, value: "R$4.250", label: "Março", color: "#34d399", hint: "vs. R$3.180 fev", delta: "+33%", trend: "up" as const, spark: [2200, 2700, 3100, 3180, 3500, 3900, 4250] },
                      ]
                    : [
                        { icon: Flame, value: "12 dias", label: "Sequência", color: "#fb923c", hint: "recorde 28 dias", delta: "novo", trend: "up" as const, spark: [3, 5, 7, 8, 9, 11, 12] },
                        { icon: Trophy, value: "2.840", label: "XP", color: "#a78bfa", hint: "Nível 14", delta: "+340", trend: "up" as const, spark: [1800, 2050, 2200, 2400, 2550, 2700, 2840] },
                        { icon: BookOpen, value: "93", label: "Aulas feitas", color: "#60a5fa", hint: "este mês: 18", delta: "+18", trend: "up" as const, spark: [40, 50, 62, 70, 78, 86, 93] },
                      ]
                  ).map((s, i) => (
                    <StatCard key={s.label} {...s} variant="dark" index={i} />
                  ))}
                </motion.div>
              </div>

              {/* Right: hero course card / next class */}
              {!isProf && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                  className="hidden lg:block w-[340px] shrink-0"
                >
                  <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="relative h-[180px]">
                      <img src={heroCourse.thumb} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="text-white text-[14px] mb-1" style={{ fontWeight: 700 }}>{heroCourse.title}</p>
                        <p className="text-white/50 text-[11px]">{heroCourse.nextLesson}</p>
                      </div>
                      <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                        <Play size={14} className="text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>Progresso</span>
                        <span className="text-[12px]" style={{ color: "#60a5fa", fontWeight: 700 }}>{heroCourse.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <div className="h-full rounded-full" style={{ width: `${heroCourse.progress}%`, background: "linear-gradient(90deg, #006FEE, #60a5fa)" }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {isProf && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                  className="hidden lg:block w-[320px] shrink-0"
                >
                  <div className="rounded-2xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-[11px] uppercase tracking-wider mb-3" style={{ color: "rgba(96,165,250,0.5)", fontWeight: 600 }}>Próximas aulas</p>
                    {upcomingToTeach.map((s) => (
                      <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-white/5 cursor-pointer">
                        <img src={s.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] truncate" style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{s.student}</p>
                          <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>{s.subject}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[12px]" style={{ color: "white", fontWeight: 700 }}>{s.time}</p>
                          <p className="text-[9px]" style={{ color: s.day === "Hoje" ? "#60a5fa" : "rgba(255,255,255,0.3)" }}>{s.day}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ═══ BENTO GRID SECTION ═══ */}
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 -mt-1">
          {/* Continue watching - horizontal scroll */}
          {!isProf && (
            <motion.section
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[16px]" style={{ color: "#09090b", fontWeight: 700 }}>Em andamento</h2>
                  <p className="text-[12px] mt-0.5" style={{ color: "#a1a1aa" }}>3 cursos ativos</p>
                </div>
                <Link to="/dashboard/my-courses" className="flex items-center gap-1 text-[12px] hover:opacity-70 transition-opacity"
                  style={{ color: "#006FEE", fontWeight: 600 }}>
                  Ver todos <ArrowRight size={13} />
                </Link>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {inProgressCourses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.08 }}
                    className="shrink-0 w-[300px] sm:w-[340px]"
                  >
                    <div
                      onClick={() => navigate(`/dashboard/courses/${course.id}`)}
                      className="bg-white rounded-2xl overflow-hidden cursor-pointer group transition-all hover:shadow-lg"
                      style={{ border: "1px solid #f4f4f5" }}
                    >
                      <div className="relative h-[140px] overflow-hidden">
                        <img src={course.thumb} alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <div className="flex items-center gap-2">
                            <img src={course.avatar} alt="" className="w-6 h-6 rounded-full border border-white/30" />
                            <span className="text-white/70 text-[11px]">{course.instructor}</span>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <Play size={12} className="text-white ml-0.5" fill="white" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-[14px] mb-1" style={{ color: "#09090b", fontWeight: 700 }}>{course.title}</h3>
                        <p className="text-[11px] mb-3" style={{ color: "#a1a1aa" }}>{course.nextLesson}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${course.progress}%`, background: "linear-gradient(90deg, #006FEE, #338ef7)" }} />
                            </div>
                          </div>
                          <span className="text-[12px] shrink-0" style={{ color: "#006FEE", fontWeight: 700 }}>{course.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Explore CTA */}
                <div className="shrink-0 w-[220px]">
                  <Link to="/dashboard/courses"
                    className="h-full min-h-[240px] flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-[#006FEE]/30 hover:bg-[#006FEE]/5 transition-all p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#eff6ff" }}>
                      <Compass size={22} style={{ color: "#006FEE" }} />
                    </div>
                    <div>
                      <p className="text-[13px]" style={{ color: "#006FEE", fontWeight: 700 }}>Explorar</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#a1a1aa" }}>Descubra novos cursos</p>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.section>
          )}

          {/* Bento grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* Activity chart */}
            <div className="bg-white rounded-2xl p-5 md:col-span-2" style={{ border: "1px solid #f4f4f5" }}>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-[15px]" style={{ color: "#09090b", fontWeight: 700 }}>
                    Atividade {isProf ? "de Ensino" : "Semanal"}
                  </h3>
                  <p className="text-[11px] mt-0.5" style={{ color: "#a1a1aa" }}>Horas por dia esta semana</p>
                </div>
                <div className="text-right">
                  <p className="text-[24px]" style={{ color: "#09090b", fontWeight: 800, lineHeight: 1 }}>{totalHours}h</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <TrendingUp size={11} className="text-green-500" />
                    <span className="text-[11px] text-green-500" style={{ fontWeight: 600 }}>+2.3h</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-3 h-24">
                {weeklyActivity.map((d) => {
                  const pct = (d.hours / maxH) * 100;
                  const isToday = d.day === "Qua";
                  return (
                    <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-full rounded-xl transition-all relative group cursor-pointer"
                        style={{
                          height: `${Math.max(pct * 0.8, 8)}px`,
                          background: isToday
                            ? "linear-gradient(180deg, #006FEE, #338ef7)"
                            : "#f4f4f5",
                          borderRadius: "8px",
                        }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-zinc-800 text-white text-[9px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{ fontWeight: 600 }}>
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
                  <span className="text-[11px]" style={{ color: "#006FEE", fontWeight: 700 }}>{totalHours}h / 15h</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min((parseFloat(totalHours) / 15) * 100, 100)}%`, background: "linear-gradient(90deg, #006FEE, #60a5fa)" }} />
                </div>
              </div>
            </div>

            {/* Schedule / Next sessions */}
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #f4f4f5" }}>
              <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <h3 className="text-[15px]" style={{ color: "#09090b", fontWeight: 700 }}>
                  {isProf ? "Próximas aulas" : "Agenda"}
                </h3>
                <Link to="/dashboard/agenda" className="text-[11px] hover:opacity-70" style={{ color: "#006FEE", fontWeight: 600 }}>
                  Ver tudo
                </Link>
              </div>

              <div className="px-3 pb-2">
                {(isProf ? upcomingToTeach : upcomingSessions).map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors"
                    style={{ borderBottom: i < 2 ? "1px solid #fafafa" : "none" }}>
                    <Avatar src={s.avatar} className="w-9 h-9 shrink-0" size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] truncate" style={{ color: "#09090b", fontWeight: 600 }}>
                        {"teacher" in s ? s.teacher : s.student}
                      </p>
                      <p className="text-[10px] truncate" style={{ color: "#a1a1aa" }}>{s.subject}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[12px]" style={{ color: "#09090b", fontWeight: 700 }}>{s.time}</p>
                      <p className="text-[9px]" style={{ color: s.day === "Hoje" ? "#006FEE" : "#a1a1aa", fontWeight: s.day === "Hoje" ? 600 : 400 }}>{s.day}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 pb-4 pt-1">
                <Button
                  as={Link}
                  to="/dashboard/teachers"
                  variant="flat"
                  color="primary"
                  size="sm"
                  className="w-full text-[12px]"
                  style={{ fontWeight: 600 }}
                  startContent={<Zap size={13} />}
                >
                  Agendar sessão
                </Button>
              </div>
            </div>
          </motion.section>

          {/* Quick actions - Professor */}
          {isProf && (
            <motion.section
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
              className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {[
                { icon: PlusCircle, label: "Criar Curso", desc: "Novo conteúdo", path: "/dashboard/create-course", gradient: "linear-gradient(135deg, #eff6ff, #dbeafe)" },
                { icon: BarChart2, label: "Relatório", desc: "Desempenho", path: "/dashboard/availability", gradient: "linear-gradient(135deg, #dcfce7, #bbf7d0)" },
                { icon: Users, label: "Alunos", desc: "142 ativos", path: "/dashboard/teachers", gradient: "linear-gradient(135deg, #f3e8ff, #e9d5ff)" },
                { icon: Video, label: "Ao Vivo", desc: "3 sessões hoje", path: "/dashboard/agenda", gradient: "linear-gradient(135deg, #fef9c3, #fef08a)" },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.path}
                  className="rounded-2xl p-5 flex items-start gap-4 group transition-all hover:shadow-md cursor-pointer"
                  style={{ background: action.gradient, border: "1px solid rgba(0,0,0,0.04)" }}
                >
                  <action.icon size={20} style={{ color: "#3f3f46" }} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[13px]" style={{ color: "#09090b", fontWeight: 700 }}>{action.label}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#71717a" }}>{action.desc}</p>
                  </div>
                </Link>
              ))}
            </motion.section>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};