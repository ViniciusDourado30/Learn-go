import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { useAuthStore } from "../store/authStore";
import {
  Clock, BookOpen, Star, Trophy, TrendingUp, Users, ArrowRight, Play,
  PlusCircle, BarChart2, Calendar, Flame, Zap, Video, Compass,
} from "lucide-react";
import { Avatar, Progress, Button, Skeleton } from "../components/ui/nextui-shim";
import { StatCard } from "./StatCard";
import { motion } from "framer-motion";

export const DashboardHome = () => {
  const role = useAuthStore((state) => state.role);
  const navigate = useNavigate();
  const isProf = role === "PROFESSOR";
  const [loading, setLoading] = useState(true);

  // TODO: Substituir por chamadas reais à API
  const [inProgressCourses, setInProgressCourses] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<any[]>([]);

  useEffect(() => {
    // Simulação de carregamento até ligarmos a API
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const heroCourse = inProgressCourses[0] || null;

  if (loading) return <DashboardLayout><div className="p-8 text-center text-zinc-500">Carregando painel...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="pb-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 50%, #0a1628 100%)" }}>
          <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-[0.2em] mb-4" style={{ color: "rgba(96,165,250,0.6)", fontWeight: 600 }}>
                  {isProf ? "Painel do Professor" : "Bem-vindo(a)!"} 👋
                </p>
                <h1 className="text-[32px] md:text-[40px] leading-[1.1] mb-4" style={{ color: "white", fontWeight: 800 }}>
                  {isProf ? <>Você tem <span style={{ color: "#60a5fa" }}>{upcomingSessions.length} aulas</span> hoje</> : <>Pronto para <span className="text-blue-400">estudar?</span></>}
                </h1>
                
                {isProf && (
                  <div className="flex items-center gap-3 mt-6">
                    <Button color="primary" className="h-11 px-6 text-[13px]" style={{ fontWeight: 600 }} startContent={<Calendar size={15} />} onPress={() => navigate("/dashboard/agenda")}>Ver agenda</Button>
                    <Button variant="bordered" className="h-11 px-5 text-[13px] border-white/10 text-white/70" startContent={<PlusCircle size={15} />} onPress={() => navigate("/dashboard/create-course")}>Criar curso</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-[1200px] mx-auto px-5 md:px-8 mt-8">
           <h2 className="text-[16px] mb-4 font-bold text-zinc-800">Cursos em andamento</h2>
           {inProgressCourses.length === 0 ? (
             <div className="text-center py-10 bg-zinc-50 rounded-xl border border-zinc-200">
               <BookOpen size={30} className="mx-auto text-zinc-300 mb-3" />
               <p className="text-zinc-500 text-sm">Você ainda não iniciou nenhum curso.</p>
               <Button as={Link} to="/dashboard/courses" color="primary" className="mt-4">Explorar Cursos</Button>
             </div>
           ) : (
             <div className="flex gap-4 overflow-x-auto pb-2">
                {/* Aqui entrará o .map do backend */}
             </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  );
};