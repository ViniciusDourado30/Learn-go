import React, { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Search, Star, Clock, Sparkles, Play, ChevronLeft, ChevronRight, BookOpen, ChevronDown, Check, ArrowDownUp, CheckCircle2, X, BarChart3 } from "lucide-react";
import { Input, Button, Avatar, Skeleton, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "../components/ui/nextui-shim";
import { motion } from "framer-motion";
import { useCursos, useCursoDestaque, useRegistrarClique, getImageUrl } from "../hooks/useDashboard";

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

const CourseRow = ({ title, courses, onClick }: { title: string; courses: any[]; onClick: (course:any) => void }) => {
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
            <div className="bg-white rounded-2xl overflow-hidden cursor-pointer group hover:shadow-lg border border-zinc-100" onClick={() => onClick(course)}>
              <div className="relative h-[140px] overflow-hidden">
                <img src={getImageUrl(course.capa_url) || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655"} alt={course.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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
                  <div className="flex items-center gap-1.5"><Avatar src={getImageUrl(course.professor?.foto_url)} className="w-5 h-5"/><span className="text-[11px] text-zinc-400 truncate w-24">{course.professor?.nome}</span></div>
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
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const navigate = useNavigate();
  const CATEGORIES = ["Programação", "Design", "Marketing", "Negócios", "Idiomas"];
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");

  const activeFilterCount = (filterCategory !== "all" ? 1 : 0) + (filterLevel !== "all" ? 1 : 0) + (sortBy !== "popular" ? 1 : 0);
  const clearFilters = () => { setFilterCategory("all"); setFilterLevel("all"); setSortBy("popular"); };

  // Click outside to close filter popovers
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (!(e.target as Element).closest('[data-filter-pop]')) setOpenFilter(null); };
    if (openFilter) document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [openFilter]);

  const { data: cursos = [], isLoading: loadingCursos } = useCursos();
  const { data: destaque, isLoading: loadingDestaque } = useCursoDestaque();
  const { mutate: registrarClique } = useRegistrarClique();

  const handleCourseClick = (course: any) => { 
    registrarClique(course.id); 
    setSelectedCourse(course); // ABRE O MODAL EM VEZ DE NAVEGAR
  };

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

  // Filtragem
  let filteredCursos = cursos.filter((c: any) => 
    c.titulo.toLowerCase().includes(search.toLowerCase()) &&
    (filterCategory === "all" || c.categoria === filterCategory) &&
    (filterLevel === "all" || (c.nivel || "Iniciante") === filterLevel)
  );

  // Ordenação
  if (sortBy === "rating") filteredCursos.sort((a: any, b: any) => (b.rating || 5) - (a.rating || 5));
  if (sortBy === "price-asc") filteredCursos.sort((a: any, b: any) => a.preco - b.preco);
  if (sortBy === "price-desc") filteredCursos.sort((a: any, b: any) => b.preco - a.preco);
  if (sortBy === "newest") filteredCursos.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const byCategory: Record<string, any[]> = {};
  filteredCursos.forEach((c: any) => { if (!byCategory[c.categoria]) byCategory[c.categoria] = []; byCategory[c.categoria].push(c); });

  return (
    <DashboardLayout>
      <div className="pb-10">
        <div className="px-5 md:px-8 pt-6 pb-4">
          <div className="max-w-3xl relative">
            <div className="flex items-center pl-4 pr-1.5 h-12 rounded-2xl bg-white transition-colors" style={{ border: "1px solid #e4e4e7" }}>
              <Search size={16} className="text-zinc-300 shrink-0" />
              <input
                placeholder="Buscar cursos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 ml-3 outline-none text-[14px] text-zinc-800 placeholder:text-zinc-400 bg-transparent min-w-0"
              />
              {search && (
                <button onClick={() => setSearch("")} className="p-1 mr-1 hover:bg-zinc-100 rounded-lg shrink-0" aria-label="Limpar busca">
                  <X size={14} className="text-zinc-400" />
                </button>
              )}

              {/* Vertical divider */}
              <div className="h-6 w-px bg-zinc-200 mx-1.5 shrink-0" />

              {/* Filter chips inline */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Category filter */}
                <div className="relative" data-filter-pop>
                  <button
                    onClick={() => setOpenFilter(openFilter === "category" ? null : "category")}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] transition-colors"
                    style={{ background: filterCategory !== "all" ? "#eff6ff" : (openFilter === "category" ? "#f4f4f5" : "transparent"), color: filterCategory !== "all" ? "#006FEE" : "#3f3f46", fontWeight: 600 }}
                  >
                    <BookOpen size={13} />
                    <span className="hidden sm:inline">{filterCategory === "all" ? "Categoria" : filterCategory}</span>
                    <ChevronDown size={12} className="hidden sm:inline" style={{ transform: openFilter === "category" ? "rotate(180deg)" : undefined, transition: "transform 0.15s" }} />
                  </button>
                  {openFilter === "category" && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-zinc-100 shadow-xl z-30 py-1.5">
                      <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider" style={{ color: "#a1a1aa", fontWeight: 700 }}>Categoria</p>
                      {(["all", ...CATEGORIES]).map((c) => {
                        const active = filterCategory === c;
                        return (
                          <button key={c} onClick={() => { setFilterCategory(c); setOpenFilter(null); }} className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-50 transition-colors text-left">
                            <span className="text-[12px]" style={{ color: active ? "#006FEE" : "#3f3f46", fontWeight: active ? 600 : 500 }}>{c === "all" ? "Todas" : c}</span>
                            {active && <Check size={13} style={{ color: "#006FEE" }} />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>

                {/* Level filter */}
                <div className="relative hidden md:block" data-filter-pop>
                  <button
                    onClick={() => setOpenFilter(openFilter === "level" ? null : "level")}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] transition-colors"
                    style={{ background: filterLevel !== "all" ? "#eff6ff" : (openFilter === "level" ? "#f4f4f5" : "transparent"), color: filterLevel !== "all" ? "#006FEE" : "#3f3f46", fontWeight: 600 }}
                  >
                    <Star size={13} />
                    <span>{filterLevel === "all" ? "Nível" : filterLevel}</span>
                    <ChevronDown size={12} style={{ transform: openFilter === "level" ? "rotate(180deg)" : undefined, transition: "transform 0.15s" }} />
                  </button>
                  {openFilter === "level" && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl border border-zinc-100 shadow-xl z-30 py-1.5">
                      <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider" style={{ color: "#a1a1aa", fontWeight: 700 }}>Nível</p>
                      {(["all", "Iniciante", "Intermediário", "Avançado"]).map((l) => {
                        const active = filterLevel === l;
                        return (
                          <button key={l} onClick={() => { setFilterLevel(l); setOpenFilter(null); }} className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-50 transition-colors text-left">
                            <span className="text-[12px]" style={{ color: active ? "#006FEE" : "#3f3f46", fontWeight: active ? 600 : 500 }}>{l === "all" ? "Todos" : l}</span>
                            {active && <Check size={13} style={{ color: "#006FEE" }} />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>

                {/* Sort */}
                <div className="relative" data-filter-pop>
                  <button
                    onClick={() => setOpenFilter(openFilter === "sort" ? null : "sort")}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] transition-colors"
                    style={{ background: sortBy !== "popular" ? "#eff6ff" : (openFilter === "sort" ? "#f4f4f5" : "transparent"), color: sortBy !== "popular" ? "#006FEE" : "#3f3f46", fontWeight: 600 }}
                  >
                    <ArrowDownUp size={13} />
                    <span className="hidden sm:inline">
                      {sortBy === "popular" ? "Popular" : sortBy === "rating" ? "Avaliação" : sortBy === "newest" ? "Mais novos" : sortBy === "price-asc" ? "Menor preço" : "Maior preço"}
                    </span>
                    <ChevronDown size={12} className="hidden sm:inline" style={{ transform: openFilter === "sort" ? "rotate(180deg)" : undefined, transition: "transform 0.15s" }} />
                  </button>
                  {openFilter === "sort" && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-zinc-100 shadow-xl z-30 py-1.5">
                      <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider" style={{ color: "#a1a1aa", fontWeight: 700 }}>Ordenar por</p>
                      {[
                        { v: "popular", label: "Popularidade" },
                        { v: "rating", label: "Melhor avaliação" },
                        { v: "newest", label: "Mais novos" },
                        { v: "price-asc", label: "Menor preço" },
                        { v: "price-desc", label: "Maior preço" },
                      ].map((o) => {
                        const active = sortBy === o.v;
                        return (
                          <button key={o.v} onClick={() => { setSortBy(o.v); setOpenFilter(null); }} className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-50 transition-colors text-left">
                            <span className="text-[12px]" style={{ color: active ? "#006FEE" : "#3f3f46", fontWeight: active ? 600 : 500 }}>{o.label}</span>
                            {active && <Check size={13} style={{ color: "#006FEE" }} />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>

                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="flex items-center gap-1 h-9 px-2.5 rounded-xl text-[11px] hover:bg-red-50 transition-colors" style={{ color: "#dc2626", fontWeight: 600 }} aria-label="Limpar filtros">
                    <X size={11} /> <span className="hidden sm:inline">Limpar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {search.trim() || activeFilterCount > 0 ? (
          <div className="px-5 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCursos.map((course: any) => (
              <div key={course.id} className="bg-white rounded-2xl border border-zinc-100 p-3.5 cursor-pointer" onClick={() => handleCourseClick(course)}>
                <img src={getImageUrl(course.capa_url) || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655"} className="w-full h-[120px] rounded-xl object-cover mb-2" />
                <h4 className="font-bold text-[13px]">{course.titulo}</h4><p className="text-[11px] text-zinc-400">R$ {course.preco}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {destaque && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-5 md:mx-8 rounded-3xl overflow-hidden relative cursor-pointer" style={{ height: "320px" }} onClick={() => handleCourseClick(destaque)}>
                <img src={getImageUrl(destaque.capa_url) || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655"} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                <div className="absolute inset-0 flex items-center px-12">
                  <div className="max-w-lg">
                    <div className="flex items-center gap-2 mb-3"><Sparkles size={13} className="text-amber-400" /><span className="text-[11px] font-bold text-amber-400 uppercase">Destaque</span></div>
                    <h2 className="text-[34px] font-bold text-white mb-3">{destaque.titulo}</h2>
                    <p className="text-[13px] text-white/50 mb-5 line-clamp-3">{destaque.descricao}</p>
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

        {/* Renderiza o modal quando tem um curso selecionado */}
        <CourseDetailModal course={selectedCourse} isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} />
        
      </div>
    </DashboardLayout>
  );
};