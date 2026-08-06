import React, { useEffect, useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useNavigate } from "react-router";
import {
  PlayCircle, Clock, BookOpen, Award, Search,
  Flame, Trophy, TrendingUp, CheckCircle2, Play,
  ArrowRight, ChevronRight,
} from "lucide-react";
import { COURSES, Course } from "../data/courses";
import { Avatar, Progress, Button, Skeleton } from "../components/ui/nextui-shim";
import { motion } from "motion/react";
import { StatCard } from "./StatCard";

export const DashboardMyCourses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"progress" | "completed">("progress");

  const enrolled = COURSES.filter((c) => c.enrolled);
  const inProgress = enrolled.filter((c) => (c.progress ?? 0) < 100);
  const completed = enrolled.filter((c) => c.progress === 100);
  const avgProgress = enrolled.length > 0
    ? Math.round(enrolled.reduce((a, c) => a + (c.progress ?? 0), 0) / enrolled.length)
    : 0;

  const spotlightCourse = inProgress.sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))[0];
  const otherCourses = inProgress.filter(c => c.id !== spotlightCourse?.id);
  const displayList = activeTab === "progress" ? inProgress : completed;

  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="pb-10">
          <Skeleton className="h-[260px] mx-5 md:mx-8 mt-6 rounded-3xl" />
          <div className="max-w-[1200px] mx-auto px-5 md:px-8 mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
          <div className="max-w-[1200px] mx-auto px-5 md:px-8 mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-[280px] rounded-2xl" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="pb-10">
        {/* ═══ Spotlight: Current course ═══ */}
        {spotlightCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 100%)" }}
          >
            <div className="absolute inset-0">
              <img src={spotlightCourse.thumb} alt="" className="w-full h-full object-cover opacity-15" style={{ filter: "blur(40px)" }} />
            </div>
            <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* Course image */}
                <div className="w-full lg:w-[380px] shrink-0 rounded-2xl overflow-hidden relative group cursor-pointer"
                  onClick={() => navigate(`/dashboard/courses/${spotlightCourse.id}`)}>
                  <img src={spotlightCourse.thumb} alt={spotlightCourse.title}
                    className="w-full h-[220px] lg:h-[200px] object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur flex items-center justify-center">
                      <Play size={22} className="text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(96,165,250,0.6)", fontWeight: 600 }}>
                    Continue assistindo
                  </p>
                  <h1 className="text-[26px] md:text-[32px] leading-tight mb-2" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.02em" }}>
                    {spotlightCourse.title}
                  </h1>
                  <p className="text-[13px] mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Próxima: Aula {Math.round((spotlightCourse.progress ?? 0) * spotlightCourse.lessons / 100) + 1} · {spotlightCourse.instructor}
                  </p>

                  {/* Progress */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 max-w-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>Progresso</span>
                        <span className="text-[13px]" style={{ color: "#60a5fa", fontWeight: 700 }}>{spotlightCourse.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <div className="h-full rounded-full" style={{ width: `${spotlightCourse.progress}%`, background: "linear-gradient(90deg, #006FEE, #60a5fa)" }} />
                      </div>
                    </div>
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {Math.round((spotlightCourse.progress ?? 0) * spotlightCourse.lessons / 100)}/{spotlightCourse.lessons} aulas
                    </span>
                  </div>

                  <Button color="primary" className="h-11 px-6 text-[13px] gap-2" style={{ fontWeight: 600 }}
                    onPress={() => navigate(`/dashboard/courses/${spotlightCourse.id}`)}>
                    <PlayCircle size={16} /> Continuar assistindo
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          {/* ═══ Stats strip ═══ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 py-6">
            {([
              { icon: Flame, value: String(inProgress.length), label: "Em andamento", color: "#006FEE", hint: "ativos esta semana", delta: "+1", trend: "up" as const, spark: [1, 2, 2, 3, 3, 4, inProgress.length || 1] },
              { icon: Trophy, value: String(completed.length), label: "Concluídos", color: "#17c964", hint: "ao longo do ano", delta: `+${Math.max(completed.length - 1, 0)}`, trend: "up" as const, spark: [0, 1, 1, 2, 2, 3, completed.length || 1] },
              { icon: TrendingUp, value: `${avgProgress}%`, label: "Progresso médio", color: "#f5a524", hint: "média dos cursos", delta: "+8%", trend: "up" as const, spark: [25, 38, 45, 55, 62, 70, avgProgress || 50] },
              { icon: Clock, value: `${enrolled.reduce((a, c) => a + parseFloat(c.duration), 0).toFixed(0)}h`, label: "Tempo investido", color: "#7828c8", hint: "horas em estudo", delta: "+5h", trend: "up" as const, spark: [4, 8, 14, 22, 30, 40, 52] },
            ]).map((s, i) => (
              <StatCard key={s.label} {...s} index={i} />
            ))}
          </div>

          {/* ═══ Other courses horizontal scroll ═══ */}
          {otherCourses.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-[15px] mb-4" style={{ color: "#09090b", fontWeight: 700 }}>Outros cursos em andamento</h2>
              <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {otherCourses.map((course) => (
                  <div key={course.id} className="shrink-0 w-[320px]">
                    <div
                      className="bg-white rounded-2xl overflow-hidden flex cursor-pointer group transition-all hover:shadow-lg"
                      style={{ border: "1px solid #f4f4f5" }}
                      onClick={() => navigate(`/dashboard/courses/${course.id}`)}
                    >
                      <div className="relative w-[110px] shrink-0 overflow-hidden">
                        <img src={course.thumb} alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="text-[13px] line-clamp-2 mb-1" style={{ color: "#09090b", fontWeight: 600 }}>{course.title}</h3>
                          <p className="text-[11px] text-zinc-400 truncate">{course.instructor}</p>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-zinc-400">Progresso</span>
                            <span className="text-[11px]" style={{ color: "#006FEE", fontWeight: 700 }}>{course.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${course.progress}%`, background: "linear-gradient(90deg, #006FEE, #338ef7)" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ═══ Completed section ═══ */}
          {completed.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-[15px] mb-4" style={{ color: "#09090b", fontWeight: 700 }}>Concluídos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {completed.map((course) => (
                  <div key={course.id}
                    className="bg-white rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
                    style={{ border: "1px solid #f4f4f5" }}
                    onClick={() => navigate(`/dashboard/courses/${course.id}`)}>
                    <Avatar src={course.instructorAvatar} className="w-12 h-12 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] truncate" style={{ color: "#09090b", fontWeight: 600 }}>{course.title}</h3>
                      <p className="text-[11px] text-zinc-400 truncate">{course.instructor}</p>
                    </div>
                    <div className="shrink-0">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Award size={15} className="text-green-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Empty state */}
          {enrolled.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpen size={40} className="text-zinc-200 mb-4" />
              <p className="text-[16px] mb-2" style={{ color: "#3f3f46", fontWeight: 700 }}>Nenhum curso ainda</p>
              <p className="text-[13px] text-zinc-400 mb-5">Explore nosso catálogo e comece a aprender.</p>
              <Button color="primary" onPress={() => navigate("/dashboard/courses")}>Explorar cursos</Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
