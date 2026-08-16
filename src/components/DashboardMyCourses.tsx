import React, { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useMeusCursos } from "../hooks/useDashboard";
import { PlayCircle, Clock, BookOpen, Award, Flame, Trophy, TrendingUp, Play } from "lucide-react";
import { Button, Skeleton } from "../components/ui/nextui-shim";
import { motion } from "framer-motion";
import { StatCard } from "./StatCard";

export const DashboardMyCourses = () => {
  const navigate = useNavigate();
  const { data: cursosEnrolados, isLoading } = useMeusCursos();
  
  const enrolled = cursosEnrolados || [];
  const inProgress = enrolled; // Simulação: tudo em progresso para a view
  const completed = [];
  const avgProgress = 0;
  
  const spotlightCourse = inProgress[0];
  const otherCourses = inProgress.filter((c:any) => c.id !== spotlightCourse?.id);

  if (isLoading) return (
    <DashboardLayout>
      <div className="pb-10"><Skeleton className="h-[260px] mx-5 md:mx-8 mt-6 rounded-3xl" /><div className="max-w-[1200px] mx-auto px-5 md:px-8 mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="pb-10">
        {spotlightCourse && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 100%)" }}>
            <div className="absolute inset-0"><img src={spotlightCourse.capa_url || "https://images.unsplash.com/photo-1524178232363"} className="w-full h-full object-cover opacity-15 blur-[40px]" /></div>
            <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-8 items-center">
              <div className="w-full lg:w-[380px] shrink-0 rounded-2xl overflow-hidden relative cursor-pointer" onClick={() => navigate(`/dashboard/courses/${spotlightCourse.id}`)}>
                <img src={spotlightCourse.capa_url || "https://images.unsplash.com/photo-1524178232363"} className="w-full h-[200px] object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20"><div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur flex items-center justify-center"><Play size={22} fill="white" className="text-white ml-1"/></div></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3 text-blue-400">Continue assistindo</p>
                <h1 className="text-[32px] font-bold text-white mb-2">{spotlightCourse.titulo}</h1>
                <p className="text-[13px] text-white/40 mb-5">Com {spotlightCourse.professor?.nome}</p>
                <Button color="primary" className="h-11 px-6 font-bold" startContent={<PlayCircle size={16}/>} onPress={() => navigate(`/dashboard/courses/${spotlightCourse.id}`)}>Continuar assistindo</Button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 py-6">
            <StatCard icon={Flame} value={enrolled.length} label="Em andamento" color="#006FEE" />
            <StatCard icon={Trophy} value="0" label="Concluídos" color="#17c964" />
            <StatCard icon={TrendingUp} value="0%" label="Progresso médio" color="#f5a524" />
            <StatCard icon={Clock} value="0h" label="Tempo investido" color="#7828c8" />
          </div>

          {otherCourses.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h2 className="text-[15px] font-bold mb-4">Outros cursos em andamento</h2>
              <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {otherCourses.map((course:any) => (
                  <div key={course.id} className="shrink-0 w-[320px] bg-white rounded-2xl flex cursor-pointer border border-zinc-100 hover:shadow-lg" onClick={() => navigate(`/dashboard/courses/${course.id}`)}>
                    <div className="w-[110px] shrink-0 overflow-hidden"><img src={course.capa_url || "https://images.unsplash.com/photo-1524178232363"} className="w-full h-full object-cover" /></div>
                    <div className="flex-1 p-3.5 flex flex-col justify-between"><h3 className="text-[13px] font-bold line-clamp-2">{course.titulo}</h3><p className="text-[11px] text-zinc-400">{course.professor?.nome}</p></div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {enrolled.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpen size={40} className="text-zinc-200 mb-4" />
              <p className="text-[16px] font-bold mb-2">Nenhum curso ainda</p>
              <Button color="primary" onPress={() => navigate("/dashboard/courses")}>Explorar cursos</Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};