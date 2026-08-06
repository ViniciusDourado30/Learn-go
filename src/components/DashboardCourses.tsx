import React, { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useNavigate } from "react-router";
import {
  Search, Star, Clock, BookOpen, Play, Users, X,
  ChevronDown, ChevronRight, ChevronLeft as ChevronLeftIcon,
  Award, Video, FileText, CheckCircle2, ArrowRight, SlidersHorizontal,
  Sparkles, Check, ArrowDownUp, BarChart3,
} from "lucide-react";
import { COURSES, Course, Level, Category } from "../data/courses";
import { Input, Button, Chip, Avatar, Progress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Skeleton } from "../components/ui/nextui-shim";
import { motion } from "motion/react";

const CATEGORIES: Category[] = ["Idiomas", "Programação", "Matemática", "Ciências", "Design", "Música"];

const LEVEL_COLOR: Record<Level, "success" | "warning" | "danger"> = {
  Iniciante: "success", Intermediário: "warning", Avançado: "danger",
};

// Horizontal scroll row
const CourseRow = ({ title, courses, onOpenModal }: { title: string; courses: Course[]; onOpenModal: (c: Course) => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" });
  };

  useEffect(() => { checkScroll(); }, [courses]);

  if (courses.length === 0) return null;

  return (
    <section className="relative group/row">
      <div className="flex items-center justify-between mb-3 px-5 md:px-8">
        <h3 className="text-[15px]" style={{ color: "#09090b", fontWeight: 700 }}>{title}</h3>
        <div className="flex items-center gap-2">
          {canScrollLeft && (
            <button onClick={() => scroll("left")} className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors" aria-label="Rolar para esquerda">
              <ChevronLeftIcon size={14} className="text-zinc-500" />
            </button>
          )}
          {canScrollRight && (
            <button onClick={() => scroll("right")} className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors" aria-label="Rolar para direita">
              <ChevronRight size={14} className="text-zinc-500" />
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} onScroll={checkScroll} className="flex gap-4 overflow-x-auto pl-5 md:pl-8 pr-5 pb-2" style={{ scrollbarWidth: "none" }}>
        {courses.map((course) => (
          <div key={course.id} className="shrink-0 w-[260px] sm:w-[280px]">
            <div
              className="bg-white rounded-2xl overflow-hidden cursor-pointer group transition-all hover:shadow-lg"
              style={{ border: "1px solid #f4f4f5" }}
              onClick={() => course.enrolled ? navigate(`/dashboard/courses/${course.id}`) : onOpenModal(course)}
            >
              <div className="relative h-[140px] overflow-hidden">
                <img src={course.thumb} alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />
                {course.isBestseller && (
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px]"
                    style={{ background: "rgba(245,165,36,0.9)", color: "white", fontWeight: 700 }}>
                    Mais vendido
                  </div>
                )}
                {course.isNew && !course.isBestseller && (
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px]"
                    style={{ background: "rgba(23,201,100,0.9)", color: "white", fontWeight: 700 }}>
                    Novo
                  </div>
                )}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-white text-[11px]" style={{ fontWeight: 700 }}>{course.rating}</span>
                    <span className="text-white/50 text-[10px]">({course.students > 1000 ? `${(course.students/1000).toFixed(1)}k` : course.students})</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-[10px]">
                    <span className="flex items-center gap-0.5"><Clock size={9} />{course.duration}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <Chip size="sm" variant="flat" color={LEVEL_COLOR[course.level]} className="text-[9px] h-5">
                    {course.level}
                  </Chip>
                  <span className="text-[10px]" style={{ color: "#a1a1aa", fontWeight: 500 }}>{course.category}</span>
                </div>
                <h4 className="text-[13px] leading-snug line-clamp-2 mb-2.5" style={{ color: "#09090b", fontWeight: 600 }}>{course.title}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Avatar src={course.instructorAvatar} className="w-5 h-5" size="sm" />
                    <span className="text-[11px] text-zinc-400 truncate">{course.instructor}</span>
                  </div>
                  {course.enrolled ? (
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "#dcfce7", color: "#16a34a", fontWeight: 600 }}>Inscrito</span>
                  ) : (
                    <span className="text-[14px]" style={{ color: "#09090b", fontWeight: 800 }}>R$ {course.price}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Featured hero
const FeaturedHero = ({ course, onOpenModal }: { course: Course; onOpenModal: (c: Course) => void }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-3xl overflow-hidden mx-5 md:mx-8 cursor-pointer group"
      style={{ height: "320px" }}
      onClick={() => course.enrolled ? navigate(`/dashboard/courses/${course.id}`) : onOpenModal(course)}
    >
      <img src={course.thumb} alt={course.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)" }} />
      <div className="absolute inset-0 flex items-center px-8 md:px-12">
        <div className="max-w-lg">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={13} style={{ color: "#fbbf24" }} />
            <span className="text-[11px] uppercase tracking-[0.15em]" style={{ color: "rgba(251,191,36,0.8)", fontWeight: 600 }}>Destaque</span>
          </div>
          <h2 className="text-[28px] md:text-[34px] leading-[1.15] mb-3" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {course.title}
          </h2>
          <p className="text-[13px] line-clamp-2 mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
            {course.description}
          </p>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Avatar src={course.instructorAvatar} className="w-7 h-7" size="sm" />
              <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{course.instructor}</span>
            </div>
            <span className="flex items-center gap-1 text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>
              <Star size={11} className="fill-amber-400 text-amber-400" /> {course.rating}
            </span>
            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>
              {course.students.toLocaleString("pt-BR")} alunos
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button color="primary" className="h-10 px-5 text-[13px]" style={{ fontWeight: 600 }}
              startContent={<Play size={14} fill="currentColor" />}>
              {course.enrolled ? "Continuar" : `Comprar · R$ ${course.price}`}
            </Button>
            <Button variant="bordered" className="h-10 px-4 text-[13px] border-white/20 text-white/70" style={{ fontWeight: 500 }}>
              Detalhes
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Course detail modal (same as before)
const CourseDetailModal = ({ course, isOpen, onClose }: { course: Course | null; isOpen: boolean; onClose: () => void }) => {
  const navigate = useNavigate();
  const [openModule, setOpenModule] = useState<number | null>(0);
  if (!course) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1" style={{ borderBottom: "1px solid #f4f4f5", padding: "1.25rem 1.5rem" }}>
          <h2 className="text-[18px]" style={{ color: "#09090b", fontWeight: 700 }}>{course.title}</h2>
          <div className="flex items-center gap-2">
            <Avatar src={course.instructorAvatar} className="w-5 h-5" size="sm" />
            <span className="text-[12px] text-zinc-500">{course.instructor}</span>
            <Chip size="sm" variant="flat" color={LEVEL_COLOR[course.level]} className="text-[9px] h-5 ml-1">{course.level}</Chip>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="px-1 py-5 space-y-5">
            <p className="text-[13px] leading-relaxed text-zinc-600">{course.description}</p>
            <div className="flex items-center gap-4 text-[12px] text-zinc-500">
              <span className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /><span className="text-zinc-800" style={{ fontWeight: 700 }}>{course.rating}</span> ({course.students.toLocaleString("pt-BR")})</span>
              <span className="flex items-center gap-1"><Clock size={12} />{course.duration}</span>
              <span className="flex items-center gap-1"><BookOpen size={12} />{course.lessons} aulas</span>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "#a1a1aa", fontWeight: 700 }}>Conteúdo</p>
              <div className="space-y-1.5">
                {course.syllabus.map((mod, i) => (
                  <div key={i} className="border border-zinc-100 rounded-xl overflow-hidden">
                    <button onClick={() => setOpenModule(openModule === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center shrink-0" style={{ fontWeight: 700 }}>{i + 1}</span>
                        <span className="text-[13px] text-zinc-800" style={{ fontWeight: 600 }}>{mod.title}</span>
                      </div>
                      <span className="text-[11px] text-zinc-400">{mod.lessons} aulas</span>
                    </button>
                    {openModule === i && (
                      <div className="px-4 pb-3 pt-1 bg-zinc-50/80 border-t border-zinc-100">
                        {Array.from({ length: Math.min(3, mod.lessons) }).map((_, j) => (
                          <div key={j} className="flex items-center gap-2 py-1.5 text-[12px] text-zinc-500">
                            <Play size={10} className="text-zinc-400 shrink-0" />
                            <span>Aula {j + 1} – {mod.title} parte {j + 1}</span>
                            <span className="ml-auto text-zinc-400">~12 min</span>
                          </div>
                        ))}
                        {mod.lessons > 3 && <p className="text-[11px] text-primary pt-1" style={{ fontWeight: 600 }}>+ {mod.lessons - 3} aulas</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "#a1a1aa", fontWeight: 700 }}>Incluso</p>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {course.includes.map((item, i) => (
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
              <p className="text-[24px]" style={{ color: "#09090b", fontWeight: 800 }}>R$ {course.price}</p>
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

// Main page
export const DashboardCourses = () => {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [filterLevel, setFilterLevel] = useState<Level | "all">("all");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "newest" | "price-asc" | "price-desc">("popular");
  const [openFilter, setOpenFilter] = useState<null | "category" | "level" | "sort">(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!openFilter) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-filter-pop]")) setOpenFilter(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openFilter]);

  const activeFilterCount =
    (filterCategory !== "all" ? 1 : 0) +
    (filterLevel !== "all" ? 1 : 0) +
    (sortBy !== "popular" ? 1 : 0);

  const clearFilters = () => {
    setFilterCategory("all");
    setFilterLevel("all");
    setSortBy("popular");
  };

  const openModal = (c: Course) => { setSelectedCourse(c); onOpen(); };

  const matchesFilters = (c: Course) => {
    if (filterCategory !== "all" && c.category !== filterCategory) return false;
    if (filterLevel !== "all" && c.level !== filterLevel) return false;
    return true;
  };

  const sortCourses = (list: Course[]) => {
    const arr = [...list];
    switch (sortBy) {
      case "rating": arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      case "newest": arr.sort((a, b) => b.id - a.id); break;
      case "price-asc": arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0)); break;
      case "price-desc": arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0)); break;
      default: break;
    }
    return arr;
  };

  const notEnrolled = sortCourses(COURSES.filter((c) => !c.enrolled).filter(matchesFilters));
  const featuredCourse = COURSES.find((c) => c.id === 6) || notEnrolled[0];

  // Group by category
  const byCategory: Record<string, Course[]> = {};
  CATEGORIES.forEach((cat) => {
    const items = notEnrolled.filter((c) => c.category === cat);
    if (items.length > 0) byCategory[cat] = items;
  });

  // Search results
  const searchResults = search.trim()
    ? sortCourses(COURSES.filter((c) =>
        (c.title.toLowerCase().includes(search.toLowerCase()) ||
         c.instructor.toLowerCase().includes(search.toLowerCase()) ||
         c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) &&
        matchesFilters(c)
      ))
    : null;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="pb-10">
          <div className="px-5 md:px-8 pt-6 pb-4">
            <Skeleton className="max-w-2xl h-12 rounded-2xl" />
          </div>
          <div className="px-5 md:px-8 mb-6">
            <Skeleton className="h-[280px] rounded-3xl" />
          </div>
          <div className="px-5 md:px-8 space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-5 w-48 mb-4 rounded" />
                <div className="flex gap-4 overflow-hidden">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="shrink-0 w-[280px] h-[260px] rounded-2xl" />
                  ))}
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
        {/* Search bar with inline filters */}
        <div className="px-5 md:px-8 pt-6 pb-4">
          <div className="max-w-3xl">
            <div className="flex items-center pl-4 pr-1.5 h-12 rounded-2xl bg-white transition-colors"
              style={{ border: "1px solid #e4e4e7" }}>
              <Search size={16} className="text-zinc-300 shrink-0" />
              <input
                placeholder="Buscar cursos, professores, tags..."
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
                    style={{
                      background: filterCategory !== "all" ? "#eff6ff" : (openFilter === "category" ? "#f4f4f5" : "transparent"),
                      color: filterCategory !== "all" ? "#006FEE" : "#3f3f46",
                      fontWeight: 600,
                    }}
                  >
                    <BookOpen size={13} />
                    <span className="hidden sm:inline">{filterCategory === "all" ? "Categoria" : filterCategory}</span>
                    <ChevronDown size={12} className="hidden sm:inline" style={{ transform: openFilter === "category" ? "rotate(180deg)" : undefined, transition: "transform 0.15s" }} />
                  </button>
                  {openFilter === "category" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-zinc-100 shadow-xl z-30 py-1.5"
                    >
                      <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider" style={{ color: "#a1a1aa", fontWeight: 700 }}>Categoria</p>
                      {(["all" as const, ...CATEGORIES]).map((c) => {
                        const active = filterCategory === c;
                        return (
                          <button
                            key={c}
                            onClick={() => { setFilterCategory(c); setOpenFilter(null); }}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-50 transition-colors text-left"
                          >
                            <span className="text-[12px]" style={{ color: active ? "#006FEE" : "#3f3f46", fontWeight: active ? 600 : 500 }}>
                              {c === "all" ? "Todas" : c}
                            </span>
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
                    style={{
                      background: filterLevel !== "all" ? "#eff6ff" : (openFilter === "level" ? "#f4f4f5" : "transparent"),
                      color: filterLevel !== "all" ? "#006FEE" : "#3f3f46",
                      fontWeight: 600,
                    }}
                  >
                    <BarChart3 size={13} />
                    <span>{filterLevel === "all" ? "Nível" : filterLevel}</span>
                    <ChevronDown size={12} style={{ transform: openFilter === "level" ? "rotate(180deg)" : undefined, transition: "transform 0.15s" }} />
                  </button>
                  {openFilter === "level" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl border border-zinc-100 shadow-xl z-30 py-1.5"
                    >
                      <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider" style={{ color: "#a1a1aa", fontWeight: 700 }}>Nível</p>
                      {(["all", "Iniciante", "Intermediário", "Avançado"] as const).map((l) => {
                        const active = filterLevel === l;
                        return (
                          <button
                            key={l}
                            onClick={() => { setFilterLevel(l as Level | "all"); setOpenFilter(null); }}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-50 transition-colors text-left"
                          >
                            <span className="text-[12px]" style={{ color: active ? "#006FEE" : "#3f3f46", fontWeight: active ? 600 : 500 }}>
                              {l === "all" ? "Todos" : l}
                            </span>
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
                        : sortBy === "newest" ? "Mais novos"
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
                        { v: "newest", label: "Mais novos" },
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
          /* Search results */
          <div className="px-5 md:px-8">
            <p className="text-[12px] mb-4" style={{ color: "#a1a1aa" }}>
              <span style={{ color: "#09090b", fontWeight: 700 }}>{searchResults.length}</span> resultado{searchResults.length !== 1 ? "s" : ""} para "{search}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchResults.map((course) => (
                <div key={course.id}
                  className="bg-white rounded-2xl overflow-hidden cursor-pointer group transition-all hover:shadow-lg"
                  style={{ border: "1px solid #f4f4f5" }}
                  onClick={() => course.enrolled ? undefined : openModal(course)}>
                  <div className="relative h-[130px] overflow-hidden">
                    <img src={course.thumb} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      <span className="text-white text-[11px]" style={{ fontWeight: 700 }}>{course.rating}</span>
                    </div>
                  </div>
                  <div className="p-3.5">
                    <h4 className="text-[13px] line-clamp-2 mb-2" style={{ color: "#09090b", fontWeight: 600 }}>{course.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-400">{course.instructor}</span>
                      <span className="text-[13px]" style={{ color: "#09090b", fontWeight: 800 }}>
                        {course.enrolled ? "Inscrito" : `R$ ${course.price}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Browse mode: hero + rows */
          <div className="space-y-8">
            {/* Featured hero */}
            {featuredCourse && <FeaturedHero course={featuredCourse} onOpenModal={openModal} />}

            {/* Category rows */}
            {Object.entries(byCategory).map(([cat, courses]) => (
              <CourseRow key={cat} title={cat} courses={courses} onOpenModal={openModal} />
            ))}

            {/* Popular row */}
            <CourseRow
              title="Mais populares"
              courses={[...notEnrolled].sort((a, b) => b.students - a.students).slice(0, 6)}
              onOpenModal={openModal}
            />
          </div>
        )}

        <CourseDetailModal course={selectedCourse} isOpen={isOpen} onClose={onClose} />
      </div>
    </DashboardLayout>
  );
};
