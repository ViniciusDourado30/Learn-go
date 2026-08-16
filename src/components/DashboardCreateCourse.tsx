import React, { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useCriarCurso, useUpload } from "../hooks/useDashboard";
import { PlusCircle, Save, LayoutGrid, CheckCircle2, Upload, BookOpen, ArrowRight, ArrowLeft, Sparkles, Video, FileText } from "lucide-react";
import { Button, Input, Chip } from "../components/ui/nextui-shim";
import { motion, AnimatePresence } from "framer-motion";

type AulaConfig = { titulo: string; video_url: string; ordem: number };
type ModuleConfig = { id: string; title: string; lessonCount: number; aulas: AulaConfig[] };

const STEPS = [{ label: "Informações", icon: FileText }, { label: "Estrutura", icon: LayoutGrid }, { label: "Conteúdo", icon: Video }];

export const DashboardCreateCourse = () => {
  const navigate = useNavigate();
  const { mutate: criarCurso, isPending } = useCriarCurso();
  const { mutateAsync: uploadFile, isPending: uploading } = useUpload();

  const [step, setStep] = useState(1);
  const [courseName, setCourseName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseCategory, setCourseCategory] = useState("Programação");
  const [courseThumb, setCourseThumb] = useState("");
  const [moduleCount, setModuleCount] = useState(3);
  const [modules, setModules] = useState<ModuleConfig[]>([
    { id: "m1", title: "Módulo 1", lessonCount: 4, aulas: Array(4).fill({ titulo: "", video_url: "", ordem: 0 }) },
    { id: "m2", title: "Módulo 2", lessonCount: 4, aulas: Array(4).fill({ titulo: "", video_url: "", ordem: 0 }) },
    { id: "m3", title: "Módulo 3", lessonCount: 4, aulas: Array(4).fill({ titulo: "", video_url: "", ordem: 0 }) },
  ]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await uploadFile(e.target.files[0]);
      setCourseThumb(url);
    }
  };

  const handleModuleCount = (n: number) => {
    setModuleCount(n);
    setModules(Array.from({ length: n }).map((_, i) => modules[i] || { id: `m${i + 1}`, title: `Módulo ${i + 1}`, lessonCount: 4, aulas: Array(4).fill({ titulo: "", video_url: "", ordem: 0 }) }));
  };

  const updateLessonCount = (i: number, n: number) => { const c = [...modules]; c[i].lessonCount = n; setModules(c); };
  const updateModuleTitle = (i: number, t: string) => { const c = [...modules]; c[i].title = t; setModules(c); };
  const updateAula = (mIdx: number, aIdx: number, field: string, value: string) => {
    const newMods = [...modules];
    if (!newMods[mIdx].aulas[aIdx]) newMods[mIdx].aulas[aIdx] = { titulo: "", video_url: "", ordem: aIdx + 1 };
    newMods[mIdx].aulas[aIdx] = { ...newMods[mIdx].aulas[aIdx], [field]: value };
    setModules(newMods);
  };

  const handlePublish = () => {
    const dto = {
      titulo: courseName,
      descricao: courseDesc,
      preco: Number(coursePrice),
      categoria: courseCategory,
      capa_url: courseThumb,
      modulos: modules.map((m, i) => ({
        titulo: m.title,
        ordem: i + 1,
        aulas: m.aulas.slice(0, m.lessonCount).map((a, j) => ({ titulo: a.titulo || `Aula ${j + 1}`, video_url: a.video_url || "", ordem: j + 1 }))
      }))
    };
    criarCurso(dto, { onSuccess: () => navigate('/dashboard/courses') });
  };

  const isStep1Valid = courseName.trim() !== "" && courseDesc.trim() !== "" && coursePrice.trim() !== "";
  const totalLessons = modules.reduce((a, m) => a + m.lessonCount, 0);

  return (
    <DashboardLayout>
      <div className="pb-10">
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 100%)" }}>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,111,238,0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />
          <div className="relative z-10 max-w-[720px] mx-auto px-5 md:px-8 py-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,111,238,0.2)" }}>
                <PlusCircle size={20} style={{ color: "#60a5fa" }} />
              </div>
              <div>
                <h1 className="text-[22px]" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.02em" }}>Criar Curso</h1>
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>Configure e publique seu novo curso.</p>
              </div>
            </div>

            <div className="flex items-center gap-0 mt-6">
              {STEPS.map((s, i) => (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px]" style={{ background: step === i + 1 ? "#006FEE" : step > i + 1 ? "rgba(23,201,100,0.2)" : "rgba(255,255,255,0.06)", color: step === i + 1 ? "white" : step > i + 1 ? "#17c964" : "rgba(255,255,255,0.3)", fontWeight: 700 }}>
                      {step > i + 1 ? <CheckCircle2 size={13} /> : i + 1}
                    </div>
                    <span className="text-[12px] hidden sm:block" style={{ color: step === i + 1 ? "white" : "rgba(255,255,255,0.3)", fontWeight: step === i + 1 ? 600 : 400 }}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className="flex-1 mx-3 h-px" style={{ background: step > i + 1 ? "rgba(23,201,100,0.3)" : "rgba(255,255,255,0.06)" }} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[720px] mx-auto px-5 md:px-8 mt-6">
          <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #f4f4f5" }}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
                  <div className="pb-3 border-b border-zinc-100">
                    <h2 className="text-[15px]" style={{ color: "#09090b", fontWeight: 700 }}>Informações Básicas</h2>
                    <p className="text-[12px] mt-0.5" style={{ color: "#a1a1aa" }}>Nome, descrição e preço.</p>
                  </div>
                  <Input label="Nome do Curso" placeholder="Ex: Introdução ao React" value={courseName} onValueChange={setCourseName} variant="bordered" classNames={{ inputWrapper: "border-zinc-200 bg-zinc-50/50 shadow-none" }} />
                  <div>
                    <label className="block text-[12px] mb-1.5" style={{ color: "#3f3f46", fontWeight: 500 }}>Descrição</label>
                    <textarea placeholder="Sobre o que é o curso?" value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none resize-none" style={{ border: "1px solid #e4e4e7", color: "#09090b", background: "#fafafa" }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Preço (R$)" type="number" placeholder="197" value={coursePrice} onValueChange={setCoursePrice} variant="bordered" classNames={{ inputWrapper: "border-zinc-200 bg-zinc-50/50 shadow-none" }} />
                    <div>
                      <label className="block text-[12px] mb-1.5" style={{ color: "#3f3f46", fontWeight: 500 }}>Categoria</label>
                      <select value={courseCategory} onChange={(e) => setCourseCategory(e.target.value)} className="w-full h-10 px-3 rounded-xl text-[13px] outline-none appearance-none" style={{ border: "1px solid #e4e4e7", color: "#09090b", background: "#fafafa" }}>
                        {["Programação", "Idiomas", "Matemática", "Ciências", "Design", "Música"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="relative p-6 rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all overflow-hidden">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                    {courseThumb && <img src={courseThumb} className="absolute inset-0 w-full h-full object-cover opacity-20" />}
                    <Upload size={20} className="text-zinc-300 relative z-10" />
                    <p className="text-[12px] relative z-10" style={{ color: "#71717a", fontWeight: 500 }}>
                      {uploading ? "Enviando..." : courseThumb ? "Capa atualizada!" : "Capa do curso · JPG ou PNG"}
                    </p>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button color="primary" isDisabled={!isStep1Valid} onPress={() => setStep(2)} endContent={<ArrowRight size={14} />} className="text-[13px]" style={{ fontWeight: 600 }}>Próximo</Button>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
                  <div className="pb-3 border-b border-zinc-100">
                    <h2 className="text-[15px]" style={{ color: "#09090b", fontWeight: 700 }}>Estrutura</h2>
                    <p className="text-[12px] mt-0.5" style={{ color: "#a1a1aa" }}>Defina módulos e aulas.</p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] text-primary" style={{ fontWeight: 600 }}>Módulos</span>
                      <Chip size="sm" color="primary" variant="flat">{moduleCount}</Chip>
                    </div>
                    <input type="range" min={1} max={10} value={moduleCount} onChange={(e) => handleModuleCount(parseInt(e.target.value))} className="w-full" style={{ accentColor: "#006FEE" }} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {modules.map((mod, i) => (
                      <div key={mod.id} className="flex items-center gap-2 p-3 rounded-xl border border-zinc-100 bg-zinc-50/50">
                        <BookOpen size={13} className="text-primary shrink-0" />
                        <span className="text-[12px] flex-1" style={{ color: "#3f3f46", fontWeight: 500 }}>Módulo {i + 1}</span>
                        <div className="flex items-center gap-0.5 border border-zinc-200 rounded-lg bg-white">
                          <button onClick={() => updateLessonCount(i, Math.max(1, mod.lessonCount - 1))} className="w-6 h-6 flex items-center justify-center text-zinc-400">−</button>
                          <span className="w-5 text-center text-[12px]" style={{ fontWeight: 700 }}>{mod.lessonCount}</span>
                          <button onClick={() => updateLessonCount(i, Math.min(20, mod.lessonCount + 1))} className="w-6 h-6 flex items-center justify-center text-zinc-400">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "#dcfce7", border: "1px solid #86efac" }}>
                    <Sparkles size={14} className="text-green-600" />
                    <p className="text-[12px] text-green-700" style={{ fontWeight: 500 }}>Total: <strong>{totalLessons} aulas</strong> em <strong>{moduleCount} módulos</strong></p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Button variant="bordered" onPress={() => setStep(1)} startContent={<ArrowLeft size={13} />} className="text-[13px] border-zinc-200">Voltar</Button>
                    <Button color="primary" onPress={() => setStep(3)} endContent={<ArrowRight size={13} />} className="text-[13px]" style={{ fontWeight: 600 }}>Gerar</Button>
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <div>
                      <h2 className="text-[15px]" style={{ color: "#09090b", fontWeight: 700 }}>Conteúdo</h2>
                      <p className="text-[12px] mt-0.5" style={{ color: "#a1a1aa" }}>{totalLessons} aulas em {moduleCount} módulos</p>
                    </div>
                    <Chip size="sm" color="success" variant="flat" startContent={<CheckCircle2 size={10} />}>Gerado</Chip>
                  </div>
                  {modules.map((mod, mIdx) => (
                    <div key={mod.id} className="rounded-xl border border-zinc-100 overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-50 border-b border-zinc-100">
                        <Chip size="sm" color="primary" variant="flat" className="text-[10px]">{mIdx + 1}</Chip>
                        <input type="text" value={mod.title} onChange={(e) => updateModuleTitle(mIdx, e.target.value)} className="flex-1 bg-transparent outline-none text-[13px] border-b border-dashed border-zinc-300" style={{ color: "#3f3f46", fontWeight: 600 }} />
                        <span className="text-[10px] text-zinc-400">{mod.lessonCount} aulas</span>
                      </div>
                      <div className="p-3 space-y-1.5">
                        {Array.from({ length: mod.lessonCount }).map((_, lIdx) => (
                          <div key={lIdx} className="flex flex-col sm:flex-row gap-2 p-2 rounded-lg bg-zinc-50/80">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="w-5 h-5 rounded text-[9px] flex items-center justify-center bg-zinc-200 text-zinc-500" style={{ fontWeight: 700 }}>{lIdx + 1}</span>
                              <input type="text" placeholder="Título da aula" value={mod.aulas[lIdx]?.titulo || ""} onChange={(e) => updateAula(mIdx, lIdx, "titulo", e.target.value)} className="flex-1 bg-transparent text-[12px] outline-none" style={{ color: "#3f3f46" }} />
                            </div>
                            <input type="url" placeholder="URL do vídeo" value={mod.aulas[lIdx]?.video_url || ""} onChange={(e) => updateAula(mIdx, lIdx, "video_url", e.target.value)} className="sm:w-48 text-[11px] px-2.5 py-1 rounded-lg border border-zinc-200 bg-white outline-none" style={{ color: "#71717a" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                    <Button variant="bordered" onPress={() => setStep(2)} startContent={<ArrowLeft size={13} />} className="text-[13px] border-zinc-200">Voltar</Button>
                    <Button color="success" onPress={handlePublish} isLoading={isPending} startContent={!isPending && <Save size={13} />} className="text-[13px] text-white" style={{ fontWeight: 600 }}>Publicar</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};