import React, { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Search, Star, Clock, Sparkles, Play, ChevronLeft, ChevronRight, BookOpen, ChevronDown, Check, ArrowDownUp } from "lucide-react";
import { Input, Button, Avatar, Skeleton, Chip } from "../components/ui/nextui-shim";
import { motion } from "framer-motion";
import { useCursos, useCursoDestaque, useRegistrarClique } from "../hooks/useDashboard";

const CourseRow = ({ title, courses, onClick }: { title: string; courses: any[]; onClick: (id:string) => void }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => scrollRef.current?.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" });
  if (courses.length === 0) return null;
  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-5 md:px-8">
        <h3 className="text-[15px] font-bold">{title}</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll("left")} className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50"><ChevronLeft size={14} /></button>
          <button onClick={() => scroll("right")} className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50"><ChevronRight size={14} /></button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pl-5 md:pl-8 pr-5 pb-2" style={{ scrollbarWidth: "none" }}>
        {courses.map(course => (
          <div key={course.id} className="shrink-0 w-[260px] sm:w-[280px]">
            <div className="bg-white rounded-2xl overflow-hidden cursor-pointer group hover:shadow-lg border border-zinc-100" onClick={() => onClick(course.id)}>
              <div className="relative h-[140px] overflow-hidden">
                <img src={course.capa_url || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655"} alt={course.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between">
                  <div className="flex items-center gap-1 text-white text-[11px] font-bold"><Star size={11} className="fill-amber-400 text-amber-400" /> 5.0</div>
                  <div className="flex items-center gap-1 text-white/70 text-[10px]"><Clock size={9}/> {course.modulos?.length || 0} módulos</div>
                </div>
              </div>
              <div className="p-3.5">
                <Chip size="sm" color="primary" variant="flat" className="text-[9px] mb-1.5">{course.categoria}</Chip>
                <h4 className="text-[13px] leading-snug line-clamp-2 mb-2.5 font-bold">{course.titulo}</h4>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5"><Avatar src={course.professor?.foto_url} className="w-5 h-5"/><span className="text-[11px] text-zinc-400">{course.professor?.nome}</span></div>
                  <span className="text-[14px] font-bold">R$ {course.preco}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const DashboardCourses = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: cursos = [], isLoading: loadingCursos } = useCursos();
  const { data: destaque, isLoading: loadingDestaque } = useCursoDestaque();
  const { mutate: registrarClique } = useRegistrarClique();

  const handleCourseClick = (id: string) => { registrarClique(id); navigate(`/dashboard/courses/${id}`); };

  if (loadingCursos || loadingDestaque) {
    return (
      <DashboardLayout>
        <div className="pb-10 px-5 md:px-8 pt-6">
          <Skeleton className="max-w-2xl h-12 rounded-2xl mb-6" />
          <Skeleton className="h-[300px] rounded-3xl mb-8" />
          <Skeleton className="h-[200px] rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  const byCategory: Record<string, any[]> = {};
  cursos.forEach((c: any) => { if (!byCategory[c.categoria]) byCategory[c.categoria] = []; byCategory[c.categoria].push(c); });

  return (
    <DashboardLayout>
      <div className="pb-10">
        <div className="px-5 md:px-8 pt-6 pb-4">
          <div className="max-w-3xl flex items-center pl-4 pr-1.5 h-12 rounded-2xl bg-white border border-zinc-200">
            <Search size={16} className="text-zinc-400 shrink-0" />
            <input placeholder="Buscar cursos..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 ml-3 outline-none text-[14px] bg-transparent" />
          </div>
        </div>

        {search.trim() ? (
          <div className="px-5 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cursos.filter((c:any) => c.titulo.toLowerCase().includes(search.toLowerCase())).map((course: any) => (
              <div key={course.id} className="bg-white rounded-2xl border border-zinc-100 p-3.5 cursor-pointer" onClick={() => handleCourseClick(course.id)}>
                <img src={course.capa_url || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655"} className="w-full h-[120px] rounded-xl object-cover mb-2" />
                <h4 className="font-bold text-[13px]">{course.titulo}</h4><p className="text-[11px] text-zinc-400">R$ {course.preco}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {destaque && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-5 md:mx-8 rounded-3xl overflow-hidden relative cursor-pointer" style={{ height: "320px" }} onClick={() => handleCourseClick(destaque.id)}>
                <img src={destaque.capa_url || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655"} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                <div className="absolute inset-0 flex items-center px-12">
                  <div className="max-w-lg">
                    <div className="flex items-center gap-2 mb-3"><Sparkles size={13} className="text-amber-400" /><span className="text-[11px] font-bold text-amber-400 uppercase">Destaque</span></div>
                    <h2 className="text-[34px] font-bold text-white mb-3">{destaque.titulo}</h2>
                    <p className="text-[13px] text-white/50 mb-5">{destaque.descricao}</p>
                    <Button color="primary" className="h-10 font-bold" startContent={<Play size={14}/>}>Acessar · R$ {destaque.preco}</Button>
                  </div>
                </div>
              </motion.div>
            )}
            
            <CourseRow title="Mais Acessados" courses={[...cursos].sort((a,b) => b.cliques - a.cliques).slice(0,6)} onClick={handleCourseClick} />
            {Object.entries(byCategory).map(([cat, crs]) => (
              <CourseRow key={cat} title={cat} courses={crs} onClick={handleCourseClick} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};