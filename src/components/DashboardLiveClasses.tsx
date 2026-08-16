import React from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { useAuthStore } from "../store/authStore";
import { useMeusAgendamentos } from "../hooks/useDashboard";
import { Video, Calendar as CalendarIcon, Clock, Users, Play } from "lucide-react";
import { Avatar, Button } from "../components/ui/nextui-shim";
import { motion } from "framer-motion";

export const DashboardLiveClasses = () => {
  const role = useAuthStore(state => state.role);
  const { data: agendamentos, isLoading } = useMeusAgendamentos();

  if (isLoading) return <DashboardLayout><div className="p-8 text-center text-zinc-500">Buscando aulas ao vivo...</div></DashboardLayout>;

  const proximasAulas = agendamentos || [];
  const nextClass = proximasAulas.length > 0 ? proximasAulas[0] : null;

  return (
    <DashboardLayout>
      <div className="pb-10">
        {nextClass ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative overflow-hidden bg-slate-900">
            <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 py-10 md:py-14">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span className="text-[11px] uppercase tracking-[0.15em] font-bold text-red-400">Próxima aula ao vivo</span></div>
                  <h1 className="text-[28px] md:text-[36px] font-bold text-white mb-3">Aula de {nextClass.assunto || "Estudos"}</h1>
                  <p className="text-[14px] text-white/40 mb-6">Dia {nextClass.data_aula} às {nextClass.hora_inicio}</p>
                  <Button color="primary" className="h-11 px-6 font-bold" onClick={() => window.open(nextClass.link_reuniao, '_blank')} isDisabled={!nextClass.link_reuniao}>
                    <Play size={15} fill="currentColor" className="mr-2" /> Entrar na sala do Zoom
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="p-10 text-center"><p className="text-zinc-500">Nenhuma aula agendada no momento.</p></div>
        )}

        {proximasAulas.length > 1 && (
          <div className="max-w-[900px] mx-auto px-5 md:px-8 mt-8">
            <h2 className="text-[16px] mb-5 font-bold">Outras aulas</h2>
            <div className="space-y-4">
              {proximasAulas.slice(1).map((cls: any) => (
                <div key={cls.id} className="flex-1 bg-white rounded-2xl overflow-hidden border border-zinc-100 p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-bold mb-1">Aula de {cls.assunto || "Estudos"}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-[12px] text-zinc-400">
                        <span className="flex items-center gap-1"><Clock size={11} />{cls.hora_inicio} às {cls.hora_fim}</span>
                        <span className="flex items-center gap-1"><Video size={11} />{cls.status}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right"><p className="text-[13px] font-bold">{cls.data_aula}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};