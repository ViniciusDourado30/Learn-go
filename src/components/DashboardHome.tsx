import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { useAuthStore } from "../store/authStore";
import { useCursos, usePerfil, useMeusAgendamentos, getImageUrl } from "../hooks/useDashboard";
import { Clock, BookOpen, Star, Trophy, TrendingUp, Users, ArrowRight, Play, PlusCircle, BarChart2, Calendar, Flame, Zap, Video, Sparkles, Compass, CheckCircle2 } from "lucide-react";
import { Avatar, Button, Skeleton, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Chip } from "../components/ui/nextui-shim";
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
        </div>
      </div>
    </div>
  </div>
);


const LEVEL_COLOR: Record<string, "success" | "warning" | "danger" | "default"> = {
  "Iniciante": "success",
  "Intermediário": "warning",
  "Avançado": "danger",
};

// MODAL RESTAURADO DO FIGMA – com dados dinâmicos do backend
const CourseDetailModal = ({ course, isOpen, onClose }: { course: any; isOpen: boolean; onClose: () => void }) => {
  const navigate = useNavigate();
  const [openModule, setOpenModule] = useState<number | null>(0);
  if (!course) return null;

  const totalAulas = course.modulos?.reduce((acc: number, m: any) => acc + (m.aulas?.length || 0), 0) || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1" style={{ borderBottom: "1px solid #f4f4f5", padding: "1.25rem 1.5rem" }}>
          <h2 className="text-[18px]" style={{ color: "#09090b", fontWeight: 700 }}>{course.titulo}</h2>
          <div className="flex items-center gap-2">
            <Avatar src={getImageUrl(course.professor?.foto_url)} className="w-5 h-5" size="sm" />
            <span className="text-[12px] text-zinc-500">{course.professor?.nome} {course.professor?.sobrenome}</span>
            <Chip size="sm" variant="flat" color={LEVEL_COLOR[course.nivel] ?? "default"} className="text-[9px] h-5 ml-1">
              {course.nivel || "Todos os níveis"}
            </Chip>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="px-1 py-5 space-y-5">
            <p className="text-[13px] leading-relaxed text-zinc-600">{course.descricao}</p>
            <div className="flex items-center gap-4 text-[12px] text-zinc-500">
              <span className="flex items-center gap-1">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-zinc-800" style={{ fontWeight: 700 }}>5.0</span>
                <span className="text-zinc-400 ml-0.5">({course.cliques || 0})</span>
              </span>
              <span className="flex items-center gap-1"><Clock size={12} />{course.duracao_total_minutos || 0} min</span>
              <span className="flex items-center gap-1"><BookOpen size={12} />{totalAulas} aulas</span>
            </div>

            {course.modulos && course.modulos.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "#a1a1aa", fontWeight: 700 }}>Conteúdo</p>
                <div className="space-y-1.5">
                  {course.modulos.map((mod: any, i: number) => (
                    <div key={mod.id || i} className="border border-zinc-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenModule(openModule === i ? null : i)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-zinc-50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center shrink-0" style={{ fontWeight: 700 }}>{i + 1}</span>
                          <span className="text-[13px] text-zinc-800" style={{ fontWeight: 600 }}>{mod.titulo}</span>
                        </div>
                        <span className="text-[11px] text-zinc-400">{mod.aulas?.length || 0} aulas</span>
                      </button>
                      {openModule === i && (
                        <div className="px-4 pb-3 pt-1 bg-zinc-50/80 border-t border-zinc-100">
                          {(mod.aulas || []).slice(0, 3).map((aula: any, j: number) => (
                            <div key={aula.id || j} className="flex items-center gap-2 py-1.5 text-[12px] text-zinc-500">
                              <Play size={10} className="text-zinc-400 shrink-0" />
                              <span>Aula {j + 1} – {aula.titulo}</span>
                              <span className="ml-auto text-zinc-400">{aula.duracao_minutos || 0} min</span>
                            </div>
                          ))}
                          {(mod.aulas?.length || 0) > 3 && (
                            <p className="text-[11px] text-primary pt-1" style={{ fontWeight: 600 }}>
                              + {mod.aulas.length - 3} aulas
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "#a1a1aa", fontWeight: 700 }}>Incluso</p>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {["Acesso vitalício", "Certificado de conclusão", "Garantia de 7 dias", "Suporte do professor"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px] text-zinc-600">
                    <CheckCircle2 size={13} className="text-primary shrink-0" />{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter style={{ borderTop: "1px solid #f4f4f5" }}>
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-[10px] text-zinc-400">Valor</p>
              <p className="text-[24px]" style={{ color: "#09090b", fontWeight: 800 }}>R$ {course.preco}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="bordered" onPress={onClose} className="text-[13px]">Fechar</Button>
              <Button color="primary" className="text-[13px]" style={{ fontWeight: 600 }}
                onPress={() => { onClose(); navigate(`/dashboard/checkout/${course.id}`); }}>
                Comprar curso
              </Button>
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};


export const DashboardHome = () => {
  const role = useAuthStore((state) => state.role);
  const navigate = useNavigate();
  const isProf = role === "PROFESSOR";

  const { data: perfilData, isLoading: loadingPerfil } = usePerfil();
  const { data: cursos, isLoading: loadingCursos } = useCursos();
  const { data: agendamentos, isLoading: loadingAgendamentos } = useMeusAgendamentos();

  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const loading = loadingPerfil || loadingCursos || loadingAgendamentos;
  const isProfileIncomplete = perfilData && (!perfilData.profile?.telefone || !perfilData.profile?.cidade || !perfilData.profile?.sobre);
  const upcomingToTeach = isProf && agendamentos ? agendamentos.slice(0,3) : [];
  const heroCourse = cursos && cursos.length > 0 ? cursos[0] : null;

  if (loading) return <DashboardLayout><SkeletonHome /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="pb-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 50%, #0a1628 100%)" }}>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,111,238,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
          
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
                      <Button color="primary" className="h-11 px-6 text-[13px] gap-2.5" style={{ fontWeight: 600 }} onPress={() => setSelectedCourse(heroCourse)}>
                        <Play size={15} fill="currentColor" /> Acessar Curso
                      </Button>
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
                  {(isProf ? [
                        { icon: Users, value: "0", label: "Alunos", color: "#60a5fa", hint: "0 este mês", delta: "0%", trend: "up" as const },
                        { icon: Star, value: "5.0", label: "Avaliação", color: "#fbbf24", hint: "0 reviews", delta: "0", trend: "up" as const },
                        { icon: TrendingUp, value: "R$0", label: "Ganhos", color: "#34d399", hint: "vs. R$0 ant", delta: "0%", trend: "up" as const },
                      ] : [
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
                  <div className="rounded-2xl overflow-hidden cursor-pointer group" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }} onClick={() => setSelectedCourse(heroCourse)}>
                    <div className="relative h-[180px]">
                      <img src={getImageUrl(heroCourse.capa_url) || "https://images.unsplash.com/photo-1524178232363"} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
                      <div className="absolute bottom-3 left-4 right-4"><p className="text-white text-[14px] mb-1 font-bold">{heroCourse.titulo}</p><p className="text-white/50 text-[11px]">{heroCourse.categoria}</p></div>
                    </div>
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
                    <div onClick={() => setSelectedCourse(course)} className="bg-white rounded-2xl overflow-hidden cursor-pointer group transition-all hover:shadow-lg border border-zinc-100">
                      <div className="relative h-[140px] overflow-hidden">
                        <img src={getImageUrl(course.capa_url) || "https://images.unsplash.com/photo-1524178232363"} alt={course.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-[14px] mb-1 font-bold">{course.titulo}</h3>
                        <p className="text-[11px] mb-3 text-zinc-400">{course.categoria}</p>
                        <div className="flex items-center justify-between"><span className="text-[14px] font-bold text-zinc-900">R$ {course.preco}</span></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
        
        <CourseDetailModal course={selectedCourse} isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} />
      </div>
    </DashboardLayout>
  );
};