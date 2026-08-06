import React, { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Link } from "react-router";
import {
  Search, Star, Heart, Languages, ChevronRight,
  ChevronLeft as ChevronLeftIcon, ArrowRight, X, Sparkles,
  ChevronDown, Check, ArrowDownUp, BookOpen, Zap,
} from "lucide-react";
import { Avatar, Chip, Button, Skeleton } from "../components/ui/nextui-shim";
import { motion } from "motion/react";

const MOCK_TEACHERS = [
  { id: 1, name: "Sarah Jenkins", role: "Tutora Nativa de Inglês", subject: "Idiomas", country: "Estados Unidos", countryCode: "us", languages: ["Inglês (Nativo)", "Espanhol"], rating: 4.9, reviews: 128, price: 65, imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2.5&w=256&h=256", tags: ["Conversação", "IELTS", "Negócios"], availableToday: true },
  { id: 2, name: "Mateo Rossi", role: "Especialista em Espanhol", subject: "Idiomas", country: "Espanha", countryCode: "es", languages: ["Espanhol (Nativo)", "Inglês", "Italiano"], rating: 4.8, reviews: 94, price: 50, imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2.5&w=256&h=256", tags: ["Iniciantes", "Gramática", "DELE"], availableToday: false },
  { id: 3, name: "Chen Wei", role: "Professor de Mandarim", subject: "Idiomas", country: "China", countryCode: "cn", languages: ["Mandarim (Nativo)", "Inglês"], rating: 5.0, reviews: 215, price: 80, imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2.5&w=256&h=256", tags: ["HSK 1-6", "Mandarim Prático"], availableToday: true },
  { id: 4, name: "Arthur Silva", role: "Matemática e Lógica", subject: "Matemática", country: "Brasil", countryCode: "br", languages: ["Português (Nativo)", "Inglês"], rating: 4.7, reviews: 62, price: 45, imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2.5&w=256&h=256", tags: ["Enem", "Cálculo 1", "Estatística"], availableToday: true },
  { id: 5, name: "Emma Laurent", role: "Professora de Francês", subject: "Idiomas", country: "França", countryCode: "fr", languages: ["Francês (Nativo)", "Inglês"], rating: 4.9, reviews: 104, price: 70, imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2.5&w=256&h=256", tags: ["DELF", "Cultura Francesa"], availableToday: false },
  { id: 6, name: "David Kim", role: "Tutor de Programação", subject: "Programação", country: "Canadá", countryCode: "ca", languages: ["Inglês (Nativo)", "Coreano"], rating: 4.8, reviews: 156, price: 90, imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2.5&w=256&h=256", tags: ["React", "JavaScript", "Mentoria"], availableToday: true },
  { id: 7, name: "Laura Schmidt", role: "Alemão para Negócios", subject: "Idiomas", country: "Alemanha", countryCode: "de", languages: ["Alemão (Nativo)", "Inglês", "Espanhol"], rating: 4.9, reviews: 88, price: 75, imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2.5&w=256&h=256", tags: ["TestDaF", "Conversação", "B2"], availableToday: true },
  { id: 8, name: "Kenji Tanaka", role: "Coreano e Japonês", subject: "Idiomas", country: "Japão", countryCode: "jp", languages: ["Japonês (Nativo)", "Coreano", "Inglês"], rating: 5.0, reviews: 312, price: 85, imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2.5&w=256&h=256", tags: ["JLPT", "TOPIK", "Cultura"], availableToday: true },
];

type Teacher = typeof MOCK_TEACHERS[0];

// Horizontal scroll row for teachers
const TeacherRow = ({ title, teachers, favorites, onToggleFavorite }: {
  title: string; teachers: Teacher[]; favorites: number[]; onToggleFavorite: (id: number) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  if (teachers.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-5 md:px-8">
        <h3 className="text-[15px]" style={{ color: "#09090b", fontWeight: 700 }}>{title}</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll("left")} className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50" aria-label="Rolar esquerda">
            <ChevronLeftIcon size={14} className="text-zinc-500" />
          </button>
          <button onClick={() => scroll("right")} className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50" aria-label="Rolar direita">
            <ChevronRight size={14} className="text-zinc-500" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pl-5 md:pl-8 pr-5 pb-2" style={{ scrollbarWidth: "none" }}>
        {teachers.map((teacher) => (
          <Link key={teacher.id} to={`/dashboard/teachers/${teacher.id}`}
            className="shrink-0 w-[260px] bg-white rounded-2xl overflow-hidden transition-all hover:shadow-lg group"
            style={{ border: "1px solid #f4f4f5" }}>
            {/* Top section with avatar */}
            <div className="relative px-5 pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={teacher.imageUrl} alt={teacher.name} className="w-14 h-14 rounded-full object-cover" />
                    {teacher.availableToday && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-[14px]" style={{ color: "#09090b", fontWeight: 700 }}>{teacher.name}</h4>
                    <p className="text-[11px]" style={{ color: "#71717a" }}>{teacher.role}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(teacher.id); }}
                  className="p-1.5 rounded-full hover:bg-zinc-50 transition-colors"
                  aria-label="Favoritar"
                >
                  <Heart size={15} className={favorites.includes(teacher.id) ? "fill-red-500 text-red-500" : "text-zinc-300"} />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-[12px]" style={{ color: "#09090b", fontWeight: 700 }}>{teacher.rating}</span>
                <span className="text-[10px] text-zinc-400">({teacher.reviews})</span>
                <span className="mx-1 text-zinc-200">·</span>
                <img src={`https://flagcdn.com/w20/${teacher.countryCode}.png`} alt="" className="w-4 h-3 rounded-sm" />
                <span className="text-[10px] text-zinc-500">{teacher.country}</span>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {teacher.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#f4f4f5", color: "#71717a", fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderTop: "1px solid #f4f4f5" }}>
              <div>
                <span className="text-[10px] text-zinc-400">Por aula</span>
                <p className="text-[16px]" style={{ color: "#09090b", fontWeight: 800 }}>R$ {teacher.price}</p>
              </div>
              <span className="text-[12px] flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "#006FEE", fontWeight: 600 }}>
                Ver perfil <ChevronRight size={13} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

// Featured teacher spotlight
const FeaturedTeacher = ({ teacher }: { teacher: Teacher }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mx-5 md:mx-8 rounded-3xl overflow-hidden relative"
    style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 100%)", minHeight: "260px" }}
  >
    <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,111,238,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />
    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-10">
      <div className="relative shrink-0">
        <img src={teacher.imageUrl} alt={teacher.name}
          className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/10" />
        <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-3 border-[#0d1a3a] rounded-full" />
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
          <Sparkles size={13} style={{ color: "#fbbf24" }} />
          <span className="text-[11px] uppercase tracking-[0.15em]" style={{ color: "rgba(251,191,36,0.7)", fontWeight: 600 }}>Professor destaque</span>
        </div>
        <h2 className="text-[28px] md:text-[32px] mb-2" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.02em" }}>{teacher.name}</h2>
        <p className="text-[14px] mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{teacher.role} · {teacher.country}</p>
        <div className="flex items-center gap-4 justify-center md:justify-start mb-6">
          <span className="flex items-center gap-1 text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}>
            <Star size={13} className="fill-amber-400 text-amber-400" /> {teacher.rating}
          </span>
          <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>{teacher.reviews} avaliações</span>
          <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            <Languages size={13} className="inline mr-1" />{teacher.languages[0]}
          </span>
        </div>
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <Button as={Link} to={`/dashboard/teachers/${teacher.id}`}
            color="primary" className="h-10 px-5 text-[13px]" style={{ fontWeight: 600 }}>
            Ver perfil completo
          </Button>
          <span className="text-[22px]" style={{ color: "white", fontWeight: 800 }}>R$ {teacher.price}<span className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>/aula</span></span>
        </div>
      </div>
    </div>
  </motion.div>
);

export const DashboardTeachers = () => {
  const [favorites, setFavorites] = useState<number[]>([1, 4]);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "price-asc" | "price-desc">("popular");
  const [openFilter, setOpenFilter] = useState<null | "subject" | "sort">(null);

  useEffect(() => {
    if (!openFilter) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-filter-pop]")) setOpenFilter(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openFilter]);

  const subjects = Array.from(new Set(MOCK_TEACHERS.map(t => t.subject)));
  const activeFilterCount = (filterSubject !== "all" ? 1 : 0) + (filterAvailable ? 1 : 0) + (sortBy !== "popular" ? 1 : 0);
  const clearFilters = () => { setFilterSubject("all"); setFilterAvailable(false); setSortBy("popular"); };
  const toggleFavorite = (id: number) => setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);

  const matches = (t: Teacher) => {
    if (filterSubject !== "all" && t.subject !== filterSubject) return false;
    if (filterAvailable && !t.availableToday) return false;
    return true;
  };
  const sortTeachers = (list: Teacher[]) => {
    const arr = [...list];
    switch (sortBy) {
      case "rating": arr.sort((a, b) => b.rating - a.rating); break;
      case "price-asc": arr.sort((a, b) => a.price - b.price); break;
      case "price-desc": arr.sort((a, b) => b.price - a.price); break;
      default: break;
    }
    return arr;
  };
  const filteredTeachers = sortTeachers(MOCK_TEACHERS.filter(matches));

  const featuredTeacher = MOCK_TEACHERS.find(t => t.id === 3)!;
  const availableToday = filteredTeachers.filter(t => t.availableToday && t.id !== featuredTeacher.id);
  const languageTeachers = filteredTeachers.filter(t => t.subject === "Idiomas");
  const otherTeachers = filteredTeachers.filter(t => t.subject !== "Idiomas");

  const searchResults = search.trim()
    ? sortTeachers(MOCK_TEACHERS.filter(t =>
        (t.name.toLowerCase().includes(search.toLowerCase()) ||
         t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
         t.subject.toLowerCase().includes(search.toLowerCase())) &&
        matches(t)
      ))
    : (activeFilterCount > 0 ? filteredTeachers : null);

  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="pb-10">
          <div className="px-5 md:px-8 pt-6 pb-4">
            <Skeleton className="max-w-2xl h-12 rounded-2xl" />
          </div>
          <Skeleton className="h-[300px] mx-5 md:mx-8 rounded-3xl" />
          <div className="max-w-[1200px] mx-auto px-5 md:px-8 mt-8 space-y-8">
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-5 w-48 mb-4 rounded" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, j) => <Skeleton key={j} className="h-[260px] rounded-2xl" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="pb-10">
        {/* Search with inline filters */}
        <div className="px-5 md:px-8 pt-6 pb-5">
          <div className="max-w-3xl">
            <div className="flex items-center pl-4 pr-1.5 h-12 rounded-2xl bg-white" style={{ border: "1px solid #e4e4e7" }}>
              <Search size={16} className="text-zinc-300 shrink-0" />
              <input placeholder="Buscar professores, especialidades..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="flex-1 ml-3 outline-none text-[14px] text-zinc-800 placeholder:text-zinc-400 bg-transparent min-w-0" />
              {search && (
                <button onClick={() => setSearch("")} className="p-1 mr-1 hover:bg-zinc-100 rounded-lg shrink-0" aria-label="Limpar">
                  <X size={14} className="text-zinc-400" />
                </button>
              )}

              <div className="h-6 w-px bg-zinc-200 mx-1.5 shrink-0" />

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Subject */}
                <div className="relative" data-filter-pop>
                  <button
                    onClick={() => setOpenFilter(openFilter === "subject" ? null : "subject")}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] transition-colors"
                    style={{
                      background: filterSubject !== "all" ? "#eff6ff" : (openFilter === "subject" ? "#f4f4f5" : "transparent"),
                      color: filterSubject !== "all" ? "#006FEE" : "#3f3f46",
                      fontWeight: 600,
                    }}
                  >
                    <BookOpen size={13} />
                    <span className="hidden sm:inline">{filterSubject === "all" ? "Matéria" : filterSubject}</span>
                    <ChevronDown size={12} className="hidden sm:inline" style={{ transform: openFilter === "subject" ? "rotate(180deg)" : undefined, transition: "transform 0.15s" }} />
                  </button>
                  {openFilter === "subject" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-zinc-100 shadow-xl z-30 py-1.5"
                    >
                      <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider" style={{ color: "#a1a1aa", fontWeight: 700 }}>Matéria</p>
                      {(["all", ...subjects]).map((s) => {
                        const active = filterSubject === s;
                        return (
                          <button
                            key={s}
                            onClick={() => { setFilterSubject(s); setOpenFilter(null); }}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-50 transition-colors text-left"
                          >
                            <span className="text-[12px]" style={{ color: active ? "#006FEE" : "#3f3f46", fontWeight: active ? 600 : 500 }}>
                              {s === "all" ? "Todas" : s}
                            </span>
                            {active && <Check size={13} style={{ color: "#006FEE" }} />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>

                {/* Available now toggle */}
                <button
                  onClick={() => setFilterAvailable((v) => !v)}
                  className="hidden md:flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] transition-colors"
                  style={{
                    background: filterAvailable ? "#dcfce7" : "transparent",
                    color: filterAvailable ? "#15803d" : "#3f3f46",
                    fontWeight: 600,
                  }}
                  aria-pressed={filterAvailable}
                >
                  <Zap size={13} className={filterAvailable ? "fill-current" : ""} />
                  <span>Hoje</span>
                </button>

                {/* Sort */}
                <div className="relative" data-filter-pop>
                  <button
                    onClick={() => setOpenFilter(openFilter === "sort" ? null : "sort")}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] transition-colors"
                    style={{
                      background: sortBy !== "popular" ? "#eff6ff" : (openFilter === "sort" ? "#f4f4f5" : "transparent"),
                      color: sortBy !== "popular" ? "#006FEE" : "#3f3f46",
                      fontWeight: 600,
                    }}
                  >
                    <ArrowDownUp size={13} />
                    <span className="hidden sm:inline">
                      {sortBy === "popular" ? "Popular"
                        : sortBy === "rating" ? "Avaliação"
                        : sortBy === "price-asc" ? "Menor preço"
                        : "Maior preço"}
                    </span>
                    <ChevronDown size={12} className="hidden sm:inline" style={{ transform: openFilter === "sort" ? "rotate(180deg)" : undefined, transition: "transform 0.15s" }} />
                  </button>
                  {openFilter === "sort" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-zinc-100 shadow-xl z-30 py-1.5"
                    >
                      <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider" style={{ color: "#a1a1aa", fontWeight: 700 }}>Ordenar por</p>
                      {([
                        { v: "popular", label: "Popularidade" },
                        { v: "rating", label: "Melhor avaliação" },
                        { v: "price-asc", label: "Menor preço" },
                        { v: "price-desc", label: "Maior preço" },
                      ] as const).map((o) => {
                        const active = sortBy === o.v;
                        return (
                          <button
                            key={o.v}
                            onClick={() => { setSortBy(o.v); setOpenFilter(null); }}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-50 transition-colors text-left"
                          >
                            <span className="text-[12px]" style={{ color: active ? "#006FEE" : "#3f3f46", fontWeight: active ? 600 : 500 }}>{o.label}</span>
                            {active && <Check size={13} style={{ color: "#006FEE" }} />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 h-9 px-2.5 rounded-xl text-[11px] hover:bg-red-50 transition-colors"
                    style={{ color: "#dc2626", fontWeight: 600 }}
                    aria-label="Limpar filtros"
                  >
                    <X size={11} /> <span className="hidden sm:inline">Limpar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {searchResults ? (
          <div className="px-5 md:px-8">
            <p className="text-[12px] mb-4" style={{ color: "#a1a1aa" }}>
              <span style={{ color: "#09090b", fontWeight: 700 }}>{searchResults.length}</span> resultado{searchResults.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchResults.map(teacher => (
                <Link key={teacher.id} to={`/dashboard/teachers/${teacher.id}`}
                  className="bg-white rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-lg"
                  style={{ border: "1px solid #f4f4f5" }}>
                  <div className="relative shrink-0">
                    <img src={teacher.imageUrl} alt="" className="w-14 h-14 rounded-full object-cover" />
                    {teacher.availableToday && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] truncate" style={{ color: "#09090b", fontWeight: 700 }}>{teacher.name}</h4>
                    <p className="text-[11px] text-zinc-400 truncate">{teacher.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      <span className="text-[11px]" style={{ color: "#09090b", fontWeight: 600 }}>{teacher.rating}</span>
                      <span className="text-[10px] text-zinc-400">· R$ {teacher.price}/aula</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured teacher */}
            <FeaturedTeacher teacher={featuredTeacher} />

            {/* Available today */}
            <TeacherRow title="Disponíveis hoje" teachers={availableToday} favorites={favorites} onToggleFavorite={toggleFavorite} />

            {/* Languages */}
            <TeacherRow title="Professores de idiomas" teachers={languageTeachers} favorites={favorites} onToggleFavorite={toggleFavorite} />

            {/* Other subjects */}
            {otherTeachers.length > 0 && (
              <TeacherRow title="Outras especialidades" teachers={otherTeachers} favorites={favorites} onToggleFavorite={toggleFavorite} />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
