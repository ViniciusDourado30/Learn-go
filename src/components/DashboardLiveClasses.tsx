import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { useAuthStore } from "../store/authStore";
import { useMeusAgendamentos, getImageUrl } from "../hooks/useDashboard";
import { Video, Calendar as CalendarIcon, Clock, Users, Play } from "lucide-react";
import { Avatar, Button } from "../components/ui/nextui-shim";
import { motion } from "framer-motion";

export const DashboardLiveClasses = () => {
  const role = useAuthStore(state => state.role);
  const { data: agendamentos, isLoading } = useMeusAgendamentos();
  const [now, setNow] = useState(new Date());

  // Atualiza o relógio a cada minuto para destravar os botões na hora certa
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) return <DashboardLayout><div className="p-8 text-center text-zinc-500">A carregar aulas ao vivo...</div></DashboardLayout>;

  const proximasAulas = agendamentos || [];
  const nextClass = proximasAulas.length > 0 ? proximasAulas[0] : null;

  // Lógica de Trava: Libera o botão exatamente 30 minutos antes da aula
  const isClassAvailable = (dateStr: string, timeStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      const [hours, minutes] = timeStr.split(':');
      const classDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
      
      const diffMinutos = (classDate.getTime() - now.getTime()) / (1000 * 60);
      return diffMinutos <= 30 && diffMinutos >= -60; // Libera 30min antes e fecha 1h depois
    } catch {
      return false;
    }
  };

  const formatDataBR = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const nextClassAvailable = nextClass ? isClassAvailable(nextClass.data_aula, nextClass.hora_inicio) : false;

  return (
    <DashboardLayout>
      <div className="pb-10">
        {nextClass ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #1a0a2e 50%, #0d1a3a 100%)" }}>
            <div className="absolute top-0 right-[20%] w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
            <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,111,238,0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />

            <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 py-10 md:py-14">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[11px] uppercase tracking-[0.15em]" style={{ color: "rgba(248,113,113,0.8)", fontWeight: 600 }}>Próxima aula ao vivo</span>
                  </div>
                  <h1 className="text-[28px] md:text-[36px] leading-tight mb-3 text-white font-bold tracking-tight">
                    {nextClass.assunto || "Estudos Gerais"}
                  </h1>
                  <p className="text-[14px] mb-6 text-white/40">
                    {formatDataBR(nextClass.data_aula)} às {nextClass.hora_inicio}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    {[
                      { icon: Clock, text: "1 hora" },
                      { icon: Video, text: "Jitsi Meet" },
                      { icon: Users, text: "1 a 1" },
                    ].map((item, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px]" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <item.icon size={13} /> {item.text}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button color="primary" className="h-11 px-6 text-[14px] gap-2 font-bold" onClick={() => window.open(nextClass.link_reuniao || "https://meet.jit.si/", '_blank')} isDisabled={!nextClassAvailable}>
                      <Play size={15} fill="currentColor" /> {nextClassAvailable ? "Entrar na sala" : "Aguarde o horário"}
                    </Button>
                    <Button variant="bordered" className="h-11 px-5 text-[13px] border-white/10 text-white/60 hover:text-white" as={Link} to="/dashboard/teachers">
                      Agendar nova aula
                    </Button>
                  </div>
                </div>

                <div className="shrink-0">
                  <div className="w-[220px] rounded-2xl p-5 text-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <img src={role === "PROFESSOR" ? `https://ui-avatars.com/api/?name=${nextClass.aluno?.nome}` : (getImageUrl(nextClass.professor?.foto_url) || `https://ui-avatars.com/api/?name=${nextClass.professor?.nome}`)} alt="" className="w-20 h-20 rounded-full object-cover mx-auto border-3 border-white/10 mb-3" />
                    <p className="text-[14px] mb-0.5 text-white font-bold">{role === "PROFESSOR" ? "Aluno(a)" : "Professor(a)"}</p>
                    <p className="text-[12px] text-white/50">{role === "PROFESSOR" ? nextClass.aluno?.nome : nextClass.professor?.nome}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="p-12 text-center">
            <CalendarIcon size={40} className="mx-auto text-zinc-300 mb-4" />
            <p className="text-zinc-500 font-bold text-lg">Você não tem aulas agendadas.</p>
            <Button color="primary" as={Link} to="/dashboard/teachers" className="mt-4">Agendar Sessão</Button>
          </div>
        )}

        {proximasAulas.length > 1 && (
          <div className="max-w-[900px] mx-auto px-5 md:px-8 mt-8">
            <h2 className="text-[16px] mb-5 font-bold text-zinc-900">Outras aulas</h2>
            <div className="relative">
              <div className="absolute left-[23px] top-0 bottom-0 w-px bg-zinc-200" />
              <div className="space-y-4">
                {proximasAulas.slice(1).map((cls:any, i:number) => {
                  const available = isClassAvailable(cls.data_aula, cls.hora_inicio);
                  return (
                    <motion.div key={cls.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex gap-5 relative">
                      <div className="w-[46px] shrink-0 flex justify-center pt-5 relative z-10">
                        <div className="w-3 h-3 rounded-full bg-white border-2 border-primary" />
                      </div>
                      <div className="flex-1 bg-white rounded-2xl overflow-hidden transition-all hover:shadow-md border border-zinc-100">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
                          <Avatar src={role === "PROFESSOR" ? `https://ui-avatars.com/api/?name=${cls.aluno?.nome}` : (getImageUrl(cls.professor?.foto_url) || `https://ui-avatars.com/api/?name=${cls.professor?.nome}`)} className="w-11 h-11 shrink-0" size="sm" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-[14px] mb-1 font-bold text-zinc-900">Aula de {cls.assunto || "Estudos Gerais"}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-[12px] text-zinc-400">
                              <span className="flex items-center gap-1"><Video size={11} /> Jitsi Meet</span>
                              <span className="flex items-center gap-1"><Clock size={11} /> {cls.hora_inicio}</span>
                            </div>
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-2 text-right">
                            <div>
                              <p className="text-[13px] mb-1 font-bold text-zinc-900">{formatDataBR(cls.data_aula)}</p>
                            </div>
                            <Button size="sm" color={available ? "primary" : "default"} onClick={() => window.open(cls.link_reuniao || "https://meet.jit.si/", '_blank')} isDisabled={!available} style={{ fontWeight: 600 }}>
                              {available ? "Entrar na sala" : "Aguarde"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};