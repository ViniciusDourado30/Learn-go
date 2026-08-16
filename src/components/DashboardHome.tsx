import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { useAuthStore } from "../store/authStore";
import { useCursos, usePerfil, useMeusAgendamentos } from "../hooks/useDashboard";
import { Clock, BookOpen, Star, Trophy, TrendingUp, Users, ArrowRight, Play, PlusCircle, BarChart2, Calendar, Flame, Zap, Video, Sparkles, Compass, ChevronRight, Award, AlertTriangle } from "lucide-react";
import { Avatar, Button, Skeleton } from "../components/ui/nextui-shim";
import { StatCard } from "./StatCard";
import { motion, AnimatePresence } from "framer-motion";

const SkeletonHome = () => (
  <div className="pb-10">
    <div className="px-5 md:px-8 py-12" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 50%, #0a1628 100%)" }}>
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-4">
          <Skeleton className="h-3 w-32 rounded" style={{ background: "rgba(255,255,255,0.1)" }} />
          <Skeleton className="h-10 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
          <Skeleton className="h-10 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
          <Skeleton className="h-4 w-2/3 rounded mt-4" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="flex gap-3 mt-8"><Skeleton className="h-11 w-44 rounded-xl" style={{ background: "rgba(255,255,255,0.08)" }} /><Skeleton className="h-11 w-32 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }} /></div>
        </div>
        <Skeleton className="hidden lg:block w-[340px] h-[260px] rounded-2xl" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>
    </div>
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 mt-8 space-y-6">
      <div>
        <Skeleton className="h-4 w-40 mb-4 rounded" />
        <div className="flex gap-4 overflow-hidden">{[...Array(3)].map((_, i) => <Skeleton key={i} className="shrink-0 w-[320px] h-[240px] rounded-2xl" />)}</div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="md:col-span-2 h-[260px] rounded-2xl" /><Skeleton className="h-[260px] rounded-2xl" />
      </div>
    </div>
  </div>
);

export const DashboardHome = () => {
  const role = useAuthStore((state) => state.role);
  const navigate = useNavigate();
  const isProf = role === "PROFESSOR";

  const { data: perfilData, isLoading: loadingPerfil } = usePerfil();
  const { data: cursos, isLoading: loadingCursos } = useCursos();
  const { data: agendamentos, isLoading: loadingAgendamentos } = useMeusAgendamentos();

  const loading = loadingPerfil || loadingCursos || loadingAgendamentos;

  const isProfileIncomplete = perfilData && (!perfilData.profile?.telefone || !perfilData.profile?.cidade || !perfilData.profile?.sobre);
  const upcomingToTeach = isProf && agendamentos ? agendamentos.slice(0,3) : [];
  const heroCourse = cursos && cursos.length > 0 ? cursos[0] : null;

  if (loading) return <DashboardLayout><SkeletonHome /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="pb-10">
        <AnimatePresence>
          {isProfileIncomplete && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="bg-amber-50 border-b border-amber-200">
              <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle size={16} />
                  <span className="text-sm font-semibold">Termine de configurar seu perfil.</span>
                  <span className="text-xs hidden sm:inline">Adicione foto, bio e localização para começar.</span>
                </div>
                <Button size="sm" color="warning" variant="flat" onPress={() => navigate('/dashboard/profile')} className="w-fit font-bold">Completar Perfil</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 50%, #0a1628 100%)" }}>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,111,238,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute bottom-0 left-[30%] w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", filter: "blur(50px)" }} />

          <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              <div className="flex-1 min-w-0">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <p className="text-[11px] uppercase tracking-[0.2em] mb-4" style={{ color: "rgba(96,165,250,0.6)", fontWeight: 600 }}>
                    {isProf ? "Painel do Professor" : `Bom dia, ${perfilData?.user?.nome || 'Aluno'}`} 👋
                  </p>
                  <h1 className="text-[32px] md:text-[40px] leading-[1.1] mb-4" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.03em" }}>
                    {isProf ? (
                      <>Você tem <span style={{ color: "#60a5fa" }}>{upcomingToTeach.length} aulas</span> agendadas</>
                    ) : (
                      <>Continue de onde<br /><span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #a78bfa)" }}>parou.</span></>
                    )}
                  </h1>
                  <p className="text-[14px] max-w-md mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {isProf ? "Gerencie sua agenda, acompanhe alunos e crie conteúdo." : heroCourse ? `${heroCourse.titulo} – Explore o catálogo` : "Explore o catálogo de cursos disponíveis."}
                  </p>

                  {!isProf && heroCourse && (
                    <div className="flex items-center gap-4">
                      <Button color="primary" className="h-11 px-6 text-[13px] gap-2.5" style={{ fontWeight: 600 }} onPress={() => navigate(`/dashboard/courses/${heroCourse.id}`)}>
                        <Play size={15} fill="currentColor" /> Acessar Curso
                      </Button>
                      <div className="hidden sm:flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden">
                          <img src={heroCourse.professor?.foto_url || `https://ui-avatars.com/api/?name=${heroCourse.professor?.nome}`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>Instrutor</p>
                          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{heroCourse.professor?.nome}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isProf && (
                    <div className="flex items-center gap-3">
                      <Button color="primary" className="h-11 px-6 text-[13px]" style={{ fontWeight: 600 }} startContent={<Calendar size={15} />} onPress={() => navigate("/dashboard/agenda")}>Ver agenda</Button>
                      <Button variant="bordered" className="h-11 px-5 text-[13px] border-white/10 text-white/70 hover:text-white" startContent={<PlusCircle size={15} />} onPress={() => navigate("/dashboard/create-course")}>Criar curso</Button>
                    </div>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-3 gap-3 mt-10 max-w-[560px]">
                  {(isProf
                    ? [
                        { icon: Users, value: "0", label: "Alunos", color: "#60a5fa", hint: "0 este mês", delta: "0%", trend: "up" as const },
                        { icon: Star, value: "5.0", label: "Avaliação", color: "#fbbf24", hint: "0 reviews", delta: "0", trend: "up" as const },
                        { icon: TrendingUp, value: "R$0", label: "Ganhos", color: "#34d399", hint: "vs. R$0 ant", delta: "0%", trend: "up" as const },
                      ]
                    : [
                        { icon: Flame, value: "0 dias", label: "Sequência", color: "#fb923c", hint: "recorde 0 dias", delta: "novo", trend: "up" as const },
                        { icon: Trophy, value: "0", label: "XP", color: "#a78bfa", hint: "Nível 1", delta: "0", trend: "up" as const },
                        { icon: BookOpen, value: "0", label: "Aulas", color: "#60a5fa", hint: "este mês: 0", delta: "0", trend: "up" as const },
                      ]
                  ).map((s, i) => (
                    <StatCard key={s.label} {...s} variant="dark" index={i} />
                  ))}
                </motion.div>
              </div>

              {!isProf && heroCourse && (
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block w-[340px] shrink-0">
                  <div className="rounded-2xl overflow-hidden cursor-pointer group" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }} onClick={() => navigate(`/dashboard/courses/${heroCourse.id}`)}>
                    <div className="relative h-[180px]">
                      <img src={heroCourse.capa_url || "https://images.unsplash.com/photo-1524178232363"} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
                      <div className="absolute bottom-3 left-4 right-4"><p className="text-white text-[14px] mb-1 font-bold">{heroCourse.titulo}</p><p className="text-white/50 text-[11px]">{heroCourse.categoria}</p></div>
                      <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"><Play size={14} className="text-white ml-0.5" fill="white" /></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {isProf && (
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block w-[320px] shrink-0">
                  <div className="rounded-2xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-[11px] uppercase tracking-wider mb-3" style={{ color: "rgba(96,165,250,0.5)", fontWeight: 600 }}>Próximas aulas agendadas</p>
                    {upcomingToTeach.length === 0 ? <p className="text-xs text-white/50 px-2 pb-2">Nenhuma aula marcada.</p> : upcomingToTeach.map((s:any) => (
                      <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-white/5 cursor-pointer">
                        <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center"><Calendar size={14} className="text-blue-400"/></div>
                        <div className="flex-1 min-w-0"><p className="text-[12px] truncate text-white/80 font-bold">Com aluno(a)</p><p className="text-[10px] truncate text-white/30">{s.assunto || "Geral"}</p></div>
                        <div className="text-right shrink-0"><p className="text-[12px] font-bold text-white">{s.hora_inicio}</p><p className="text-[9px] text-[#60a5fa]">{s.data_aula}</p></div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="max-w-[1200px] mx-auto px-5 md:px-8 -mt-1">
          {!isProf && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div><h2 className="text-[16px] font-bold">Cursos Disponíveis</h2><p className="text-[12px] mt-0.5 text-zinc-400">{cursos?.length || 0} cursos na plataforma</p></div>
                <Link to="/dashboard/courses" className="flex items-center gap-1 text-[12px] hover:opacity-70 transition-opacity text-[#006FEE] font-bold">Ver todos <ArrowRight size={13} /></Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {(cursos || []).slice(0, 5).map((course: any, i: number) => (
                  <motion.div key={course.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.08 }} className="shrink-0 w-[300px] sm:w-[340px]">
                    <div onClick={() => navigate(`/dashboard/courses/${course.id}`)} className="bg-white rounded-2xl overflow-hidden cursor-pointer group transition-all hover:shadow-lg border border-zinc-100">
                      <div className="relative h-[140px] overflow-hidden">
                        <img src={course.capa_url || "https://images.unsplash.com/photo-1524178232363"} alt={course.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <div className="flex items-center gap-2"><img src={course.professor?.foto_url || `https://ui-avatars.com/api/?name=${course.professor?.nome}`} className="w-6 h-6 rounded-full border border-white/30" /><span className="text-white/70 text-[11px]">{course.professor?.nome}</span></div>
                          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white/30 transition-colors"><Play size={12} className="text-white ml-0.5" fill="white" /></div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-[14px] mb-1 font-bold">{course.titulo}</h3>
                        <p className="text-[11px] mb-3 text-zinc-400">{course.categoria}</p>
                        <div className="flex items-center justify-between"><span className="text-[14px] font-bold text-zinc-900">R$ {course.preco}</span></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="shrink-0 w-[220px]">
                  <Link to="/dashboard/courses" className="h-full min-h-[240px] flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-[#006FEE]/30 hover:bg-[#006FEE]/5 transition-all p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50"><Compass size={22} className="text-blue-500" /></div>
                    <div><p className="text-[13px] font-bold text-blue-500">Explorar</p><p className="text-[11px] mt-0.5 text-zinc-400">Descubra novos cursos</p></div>
                  </Link>
                </div>
              </div>
            </motion.section>
          )}

          {isProf && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: PlusCircle, label: "Criar Curso", desc: "Novo conteúdo", path: "/dashboard/create-course", gradient: "linear-gradient(135deg, #eff6ff, #dbeafe)" },
                { icon: BarChart2, label: "Relatório", desc: "Desempenho", path: "/dashboard/availability", gradient: "linear-gradient(135deg, #dcfce7, #bbf7d0)" },
                { icon: Users, label: "Alunos", desc: "ativos", path: "/dashboard/teachers", gradient: "linear-gradient(135deg, #f3e8ff, #e9d5ff)" },
                { icon: Video, label: "Ao Vivo", desc: "sessões agendadas", path: "/dashboard/agenda", gradient: "linear-gradient(135deg, #fef9c3, #fef08a)" },
              ].map((action) => (
                <Link key={action.label} to={action.path} className="rounded-2xl p-5 flex items-start gap-4 group transition-all hover:shadow-md cursor-pointer" style={{ background: action.gradient, border: "1px solid rgba(0,0,0,0.04)" }}>
                  <action.icon size={20} style={{ color: "#3f3f46" }} className="mt-0.5 shrink-0" />
                  <div><p className="text-[13px] font-bold text-zinc-900">{action.label}</p><p className="text-[11px] mt-0.5 text-zinc-500">{action.desc}</p></div>
                </Link>
              ))}
            </motion.section>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};