import React from "react";
import { Link } from "react-router";
import { DashboardLayout } from "./DashboardLayout";
import { Video, Calendar as CalendarIcon, Clock, Users, Play, ArrowRight, Sparkles } from "lucide-react";
import { Avatar, Button, Chip } from "../components/ui/nextui-shim";
import { motion } from "motion/react";

const liveClasses = [
  { id: 1, title: "Conversação em Grupo - Nível Intermediário", teacher: "Sarah Mitchell", date: "Hoje, 19:00", duration: "1h", platform: "Zoom", students: "8/10", status: "next" as const, avatar: "https://images.unsplash.com/photo-1758685848226-eedca8f6bce7?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80" },
  { id: 2, title: "Tira Dúvidas: Cálculo e Limites", teacher: "Carlos Mendes", date: "Amanhã, 14:00", duration: "1h 30m", platform: "Google Meet", students: "12/20", status: "upcoming" as const, avatar: "https://images.unsplash.com/photo-1755552370726-e8a4ce0250ee?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80" },
  { id: 3, title: "Mentoria: Projetos em React", teacher: "David Kim", date: "25 de Out, 18:00", duration: "2h", platform: "Teams", students: "5/15", status: "upcoming" as const, avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80" },
];

export const DashboardLiveClasses = () => {
  const nextClass = liveClasses[0];
  const upcoming = liveClasses.slice(1);

  return (
    <DashboardLayout>
      <div className="pb-10">
        {/* ═══ Hero: Next Live Class ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #1a0a2e 50%, #0d1a3a 100%)" }}
        >
          <div className="absolute top-0 right-[20%] w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,111,238,0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />

          <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 py-10 md:py-14">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[11px] uppercase tracking-[0.15em]" style={{ color: "rgba(248,113,113,0.8)", fontWeight: 600 }}>
                    Próxima aula ao vivo
                  </span>
                </div>
                <h1 className="text-[28px] md:text-[36px] leading-tight mb-3" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  {nextClass.title}
                </h1>
                <p className="text-[14px] mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
                  com {nextClass.teacher} · {nextClass.date}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-8">
                  {[
                    { icon: Clock, text: nextClass.duration },
                    { icon: Video, text: nextClass.platform },
                    { icon: Users, text: nextClass.students + " alunos" },
                  ].map((item, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px]"
                      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <item.icon size={13} /> {item.text}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <Button color="primary" className="h-11 px-6 text-[14px] gap-2" style={{ fontWeight: 600 }}>
                    <Play size={15} fill="currentColor" /> Entrar na sala
                  </Button>
                  <Button variant="bordered" className="h-11 px-5 text-[13px] border-white/10 text-white/60"
                    as={Link} to="/dashboard/teachers">
                    Agendar nova aula
                  </Button>
                </div>
              </div>

              {/* Teacher card */}
              <div className="shrink-0">
                <div className="w-[220px] rounded-2xl p-5 text-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <img src={nextClass.avatar} alt="" className="w-20 h-20 rounded-full object-cover mx-auto border-3 border-white/10 mb-3" />
                  <p className="text-[14px] mb-0.5" style={{ color: "white", fontWeight: 700 }}>{nextClass.teacher}</p>
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>Professora</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ Upcoming timeline ═══ */}
        <div className="max-w-[900px] mx-auto px-5 md:px-8 mt-8">
          <h2 className="text-[16px] mb-5" style={{ color: "#09090b", fontWeight: 700 }}>Próximas aulas</h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[23px] top-0 bottom-0 w-px" style={{ background: "#e4e4e7" }} />

            <div className="space-y-4">
              {upcoming.map((cls, i) => (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex gap-5 relative"
                >
                  {/* Timeline dot */}
                  <div className="w-[46px] shrink-0 flex justify-center pt-5 relative z-10">
                    <div className="w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: "#006FEE" }} />
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-white rounded-2xl overflow-hidden transition-all hover:shadow-md"
                    style={{ border: "1px solid #f4f4f5" }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
                      <Avatar src={cls.avatar} className="w-11 h-11 shrink-0" size="sm" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[14px] mb-1" style={{ color: "#09090b", fontWeight: 700 }}>{cls.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-[12px] text-zinc-400">
                          <span>{cls.teacher}</span>
                          <span className="flex items-center gap-1"><Video size={11} />{cls.platform}</span>
                          <span className="flex items-center gap-1"><Clock size={11} />{cls.duration}</span>
                          <span className="flex items-center gap-1"><Users size={11} />{cls.students}</span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[13px] mb-1" style={{ color: "#09090b", fontWeight: 700 }}>
                          {cls.date.split(",")[0]}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {cls.date.includes(",") ? cls.date.split(",")[1].trim() : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Schedule CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4"
            style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1px solid #bfdbfe" }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#006FEE" }}>
              <CalendarIcon size={22} className="text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-[14px]" style={{ color: "#09090b", fontWeight: 700 }}>Agendar nova aula</p>
              <p className="text-[12px] mt-0.5" style={{ color: "#71717a" }}>Escolha um professor e marque uma sessão.</p>
            </div>
            <Button color="primary" size="sm" className="text-[12px]" style={{ fontWeight: 600 }}
              startContent={<CalendarIcon size={14} />}
              as={Link} to="/dashboard/teachers">
              Agendar
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};
