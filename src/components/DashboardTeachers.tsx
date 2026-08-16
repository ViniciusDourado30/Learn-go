import React, { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import { Search, Star, Heart, Languages, ChevronRight, ChevronLeft as ChevronLeftIcon, X, Sparkles, ChevronDown, Check, ArrowDownUp, BookOpen, Zap } from "lucide-react";
import { Skeleton } from "../components/ui/nextui-shim";
import { motion } from "framer-motion";
import { useProfessores } from "../hooks/useDashboard";

const TeacherRow = ({ title, teachers, favorites, onToggleFavorite }: { title: string; teachers: any[]; favorites: string[]; onToggleFavorite: (id: string) => void }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => scrollRef.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  if (teachers.length === 0) return null;
  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-5 md:px-8">
        <h3 className="text-[15px]" style={{ color: "#09090b", fontWeight: 700 }}>{title}</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll("left")} className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50"><ChevronLeftIcon size={14} className="text-zinc-500" /></button>
          <button onClick={() => scroll("right")} className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50"><ChevronRight size={14} className="text-zinc-500" /></button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pl-5 md:pl-8 pr-5 pb-2" style={{ scrollbarWidth: "none" }}>
        {teachers.map((teacher) => (
          <Link key={teacher.id} to={`/dashboard/teachers/${teacher.id}`} className="shrink-0 w-[260px] bg-white rounded-2xl overflow-hidden transition-all hover:shadow-lg group" style={{ border: "1px solid #f4f4f5" }}>
            <div className="relative px-5 pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={teacher.foto_url || `https://ui-avatars.com/api/?name=${teacher.nome}`} className="w-14 h-14 rounded-full object-cover" />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div><h4 className="text-[14px]" style={{ color: "#09090b", fontWeight: 700 }}>{teacher.nome} {teacher.sobrenome}</h4><p className="text-[11px]" style={{ color: "#71717a" }}>{teacher.ocupacao || "Professor"}</p></div>
                </div>
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(teacher.id); }} className="p-1.5 rounded-full hover:bg-zinc-50 transition-colors">
                  <Heart size={15} className={favorites.includes(teacher.id) ? "fill-red-500 text-red-500" : "text-zinc-300"} />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Star size={12} className="fill-amber-400 text-amber-400" /><span className="text-[12px]" style={{ color: "#09090b", fontWeight: 700 }}>{teacher.rating || 5.0}</span><span className="text-[10px] text-zinc-400">({teacher.total_reviews || 0})</span><span className="mx-1 text-zinc-200">·</span><span className="text-[10px] text-zinc-500">{teacher.pais || "Brasil"}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {(teacher.especialidades?.length ? teacher.especialidades : ["Geral"]).slice(0, 3).map((tag: string) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#f4f4f5", color: "#71717a", fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderTop: "1px solid #f4f4f5" }}>
              <div><span className="text-[10px] text-zinc-400">Por aula</span><p className="text-[16px]" style={{ color: "#09090b", fontWeight: 800 }}>R$ {teacher.preco_medio}</p></div>
              <span className="text-[12px] flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "#006FEE", fontWeight: 600 }}>Ver perfil <ChevronRight size={13} /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const FeaturedTeacher = ({ teacher }: { teacher: any }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-5 md:mx-8 rounded-3xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 100%)", minHeight: "260px" }}>
    <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,111,238,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />
    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-10">
      <div className="relative shrink-0">
        <img src={teacher.foto_url || `https://ui-avatars.com/api/?name=${teacher.nome}`} className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/10" />
        <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-3 border-[#0d1a3a] rounded-full" />
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center gap-2 justify-center md:justify-start mb-2"><Sparkles size={13} style={{ color: "#fbbf24" }} /><span className="text-[11px] uppercase tracking-[0.15em]" style={{ color: "rgba(251,191,36,0.7)", fontWeight: 600 }}>Professor destaque</span></div>
        <h2 className="text-[28px] md:text-[32px] mb-2" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.02em" }}>{teacher.nome} {teacher.sobrenome}</h2>
        <p className="text-[14px] mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{teacher.ocupacao || "Professor"} · {teacher.pais || "Brasil"}</p>
        <div className="flex items-center gap-4 justify-center md:justify-start mb-6">
          <span className="flex items-center gap-1 text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}><Star size={13} className="fill-amber-400 text-amber-400" /> {teacher.rating || 5.0}</span>
          <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>{teacher.total_reviews || 0} avaliações</span>
          <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}><Languages size={13} className="inline mr-1" />{teacher.idiomas?.[0] || "Português"}</span>
        </div>
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <Link to={`/dashboard/teachers/${teacher.id}`} className="bg-blue-600 text-white rounded-xl h-10 px-5 text-[13px] flex items-center" style={{ fontWeight: 600 }}>Ver perfil completo</Link>
          <span className="text-[22px]" style={{ color: "white", fontWeight: 800 }}>R$ {teacher.preco_medio}<span className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>/aula</span></span>
        </div>
      </div>
    </div>
  </motion.div>
);

export const DashboardTeachers = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const { data: professores, isLoading } = useProfessores();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="pb-10">
          <div className="px-5 md:px-8 pt-6 pb-4"><Skeleton className="max-w-2xl h-12 rounded-2xl" /></div>
          <Skeleton className="h-[300px] mx-5 md:mx-8 rounded-3xl" />
          <div className="max-w-[1200px] mx-auto px-5 md:px-8 mt-8 space-y-8">
            {[...Array(2)].map((_, i) => (<div key={i}><Skeleton className="h-5 w-48 mb-4 rounded" /><div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{[...Array(4)].map((_, j) => <Skeleton key={j} className="h-[260px] rounded-2xl" />)}</div></div>))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const filteredTeachers = professores ? professores.filter((t: any) => 
    t.nome.toLowerCase().includes(search.toLowerCase()) || 
    t.sobrenome.toLowerCase().includes(search.toLowerCase()) ||
    (t.ocupacao && t.ocupacao.toLowerCase().includes(search.toLowerCase()))
  ) : [];

  const featuredTeacher = professores && professores.length > 0 ? professores[0] : null;

  return (
    <DashboardLayout>
      <div className="pb-10">
        <div className="px-5 md:px-8 pt-6 pb-5">
          <div className="max-w-3xl">
            <div className="flex items-center pl-4 pr-1.5 h-12 rounded-2xl bg-white" style={{ border: "1px solid #e4e4e7" }}>
              <Search size={16} className="text-zinc-300 shrink-0" />
              <input placeholder="Buscar professores, especialidades..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 ml-3 outline-none text-[14px] text-zinc-800 placeholder:text-zinc-400 bg-transparent min-w-0" />
              {search && <button onClick={() => setSearch("")} className="p-1 mr-1 hover:bg-zinc-100 rounded-lg shrink-0"><X size={14} className="text-zinc-400" /></button>}
            </div>
          </div>
        </div>

        {search.trim() ? (
          <div className="px-5 md:px-8">
            <p className="text-[12px] mb-4" style={{ color: "#a1a1aa" }}>{filteredTeachers.length} resultados</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTeachers.map((teacher: any) => (
                <Link key={teacher.id} to={`/dashboard/teachers/${teacher.id}`} className="bg-white rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-lg border border-zinc-100">
                  <div className="relative shrink-0"><img src={teacher.foto_url || `https://ui-avatars.com/api/?name=${teacher.nome}`} className="w-14 h-14 rounded-full object-cover" /></div>
                  <div className="flex-1 min-w-0"><h4 className="text-[14px] font-bold truncate">{teacher.nome} {teacher.sobrenome}</h4><p className="text-[11px] text-zinc-400 truncate">{teacher.ocupacao || "Professor"}</p></div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {featuredTeacher && <FeaturedTeacher teacher={featuredTeacher} />}
            <TeacherRow title="Todos os Professores" teachers={professores || []} favorites={favorites} onToggleFavorite={(id) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id])} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};