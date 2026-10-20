import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { useAuthStore } from "../store/authStore";
import { useMeusAgendamentos, getImageUrl } from "../hooks/useDashboard";
import { Video, Calendar as CalendarIcon, Clock, Users, Play, CheckCircle2 } from "lucide-react";
import { Avatar, Button, Chip } from "../components/ui/nextui-shim";
import { motion } from "framer-motion";

export const DashboardLiveClasses = () => {
  const role = useAuthStore(state => state.role);
  const { data: agendamentos, isLoading } = useMeusAgendamentos();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) return <DashboardLayout><div className="p-8 text-center text-zinc-500">A carregar aulas ao vivo...</div></DashboardLayout>;

  const todasAulas = (agendamentos || []).sort((a: any, b: any) => {
    return `${a.data_aula}T${a.hora_inicio}`.localeCompare(`${b.data_aula}T${b.hora_inicio}`);
  });

  const isClassPast = (dateStr: string, timeStr: string, status?: string) => {
    if (status === "CONCLUIDA" || status === "REALIZADA") return true;
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const [hours, minutes] = timeStr.split(":").map(Number);
      const classEndDate = new Date(year, month - 1, day, hours + 1, minutes);
      return classEndDate.getTime() < now.getTime();
    } catch {
      return false;
    }
  };

  const isClassAvailable = (dateStr: string, timeStr: string, status?: string) => {
    if (status === "CONCLUIDA" || status === "REALIZADA") return false;
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const [hours, minutes] = timeStr.split(":").map(Number);
      const classDate = new Date(year, month - 1, day, hours, minutes);
      
      const diffMinutos = (classDate.getTime() - now.getTime()) / (1000 * 60);
      return diffMinutos <= 30 && diffMinutos >= -60;
    } catch {
      return false;
    }
  };

  const formatDataBR = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const aulasPendentes = todasAulas.filter((cls: any) => !isClassPast(cls.data_aula, cls.hora_inicio, cls.status));
  const nextClass = aulasPendentes.length > 0 ? aulasPendentes[0] : null;
  const nextClassAvailable = nextClass ? isClassAvailable(nextClass.data_aula, nextClass.hora_inicio, nextClass.status) : false;

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
                    {/* Integração Jitsi - abertura da sala de aula ao vivo */}
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
                    <img src={role === "PROFESSOR" ? `https://ui-avatars.com/api/?name=${encodeURIComponent(nextClass.aluno?.nome || "Aluno")}&background=006FEE&color=fff` : (getImageUrl(nextClass.professor?.foto_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(nextClass.professor?.nome || "Professor")}&background=006FEE&color=fff`)} alt="" className="w-20 h-20 rounded-full object-cover mx-auto border-3 border-white/10 mb-3" />
                    <p className="text-[14px] mb-0.5 text-white font-bold">{role === "PROFESSOR" ? "Aluno(a)" : "Professor(a)"}</p>
                    <p className="text-[12px] text-white/50">{role === "PROFESSOR" ? `${nextClass.aluno?.nome || ""} ${nextClass.aluno?.sobrenome || ""}`.trim() : `${nextClass.professor?.nome || ""} ${nextClass.professor?.sobrenome || ""}`.trim()}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="p-12 text-center bg-white border-b border-zinc-100">
            <CalendarIcon size={40} className="mx-auto text-zinc-300 mb-4" />
            <p className="text-zinc-700 font-bold text-lg mb-1">Você não tem aulas agendadas pendentes.</p>
            <p className="text-zinc-400 text-sm mb-4">Todas as suas aulas anteriores foram concluídas ou você ainda não agendou uma sessão.</p>
            <Button color="primary" as={Link} to="/dashboard/teachers" className="font-semibold">Agendar Nova Sessão</Button>
          </div>
        )}

        {todasAulas.length > 0 && (
          <div className="max-w-[900px] mx-auto px-5 md:px-8 mt-8">
            <h2 className="text-[16px] mb-5 font-bold text-zinc-900">Histórico e Agenda de Aulas ({todasAulas.length})</h2>
            <div className="relative">
              <div className="absolute left-[23px] top-0 bottom-0 w-px bg-zinc-200" />
              <div className="space-y-4">
                {todasAulas.map((cls: any, i: number) => {
                  const past = isClassPast(cls.data_aula, cls.hora_inicio, cls.status);
                  const available = isClassAvailable(cls.data_aula, cls.hora_inicio, cls.status);
                  const personName = role === "PROFESSOR"
                    ? `${cls.aluno?.nome || "Aluno"} ${cls.aluno?.sobrenome || ""}`.trim()
                    : `${cls.professor?.nome || "Professor"} ${cls.professor?.sobrenome || ""}`.trim();
                  const personAvatar = role === "PROFESSOR"
                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(personName)}&background=006FEE&color=fff`
                    : (getImageUrl(cls.professor?.foto_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(personName)}&background=006FEE&color=fff`);

                  return (
                    <motion.div key={cls.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="flex gap-5 relative">
                      <div className="w-[46px] shrink-0 flex justify-center pt-5 relative z-10">
                        <div className={`w-3.5 h-3.5 rounded-full bg-white border-2 ${past ? "border-green-500" : "border-primary"}`} />
                      </div>
                      <div className={`flex-1 rounded-2xl overflow-hidden transition-all hover:shadow-md border ${past ? "bg-zinc-50/70 border-zinc-200/60" : "bg-white border-zinc-100"}`}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
                          <Avatar src={personAvatar} className="w-11 h-11 shrink-0" size="sm" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`text-[14px] font-bold ${past ? "text-zinc-600 line-through" : "text-zinc-900"}`}>
                                Aula de {cls.assunto || "Estudos Gerais"}
                              </h3>
                              {past ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-100 text-green-700">
                                  <CheckCircle2 size={10} /> Concluída
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700">
                                  Agendada
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-zinc-500 mb-1">Com: <strong>{personName}</strong></p>
                            <div className="flex flex-wrap items-center gap-3 text-[12px] text-zinc-400">
                              <span className="flex items-center gap-1"><Video size={11} /> Jitsi Meet</span>
                              <span className="flex items-center gap-1"><Clock size={11} /> {cls.hora_inicio}</span>
                            </div>
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-2 text-right">
                            <div>
                              <p className="text-[13px] mb-1 font-bold text-zinc-900">{formatDataBR(cls.data_aula)}</p>
                            </div>
                            {past ? (
                              <Button size="sm" variant="flat" color="success" isDisabled className="text-[12px] font-semibold opacity-70" startContent={<CheckCircle2 size={12} />}>
                                Concluída
                              </Button>
                            ) : (
                              <Button size="sm" color={available ? "primary" : "default"} onClick={() => window.open(cls.link_reuniao || "https://meet.jit.si/", '_blank')} isDisabled={!available} style={{ fontWeight: 600 }}>
                                {available ? "Entrar na sala" : "Aguarde"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};