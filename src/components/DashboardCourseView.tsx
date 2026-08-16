import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCurso, useMatricular } from "../hooks/useDashboard";
import { ChevronLeft, PlayCircle, SkipForward, BookOpen } from "lucide-react";
import { Button, Progress, Chip } from "../components/ui/nextui-shim";
import { DashboardLayout } from "./DashboardLayout";

export const DashboardCourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCurso(id!);
  const { mutate: matricular, isPending } = useMatricular();
  
  const [activeModule, setActiveModule] = useState<number>(0);
  const [activeLesson, setActiveLesson] = useState<number>(0);

  if (isLoading) return <DashboardLayout><div className="p-8 text-center text-zinc-500">Buscando detalhes do curso...</div></DashboardLayout>;
  if (!course) return <DashboardLayout><div className="p-8 text-center text-zinc-500">Curso não encontrado.</div></DashboardLayout>;

  const currentMod = course.modulos[activeModule];
  const currentVideo = currentMod?.aulas[activeLesson]?.video_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-white">
      <header className="h-14 flex items-center justify-between px-4 lg:px-6 shrink-0 z-10 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <Button isIconOnly variant="light" size="sm" onPress={() => navigate("/dashboard/courses")}><ChevronLeft size={18} /></Button>
          <h1 className="text-[13px] font-bold">{course.titulo}</h1>
        </div>
        <Button color="primary" size="sm" isLoading={isPending} onPress={() => matricular(course.id)}>
          Matricular-se no curso
        </Button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="bg-black w-full aspect-video lg:aspect-[21/9] relative flex justify-center">
            <video controls className="w-full h-full object-contain bg-black" src={currentVideo} controlsList="nodownload" />
          </div>
          <div className="p-4 border-b border-zinc-100">
            <h2 className="text-[16px] font-bold mb-0.5">{currentMod?.aulas[activeLesson]?.titulo || "Aula"}</h2>
            <p className="text-[12px] text-zinc-400">Módulo {activeModule + 1} · {currentMod?.titulo}</p>
          </div>
        </div>

        <div className="w-full lg:w-[320px] xl:w-[360px] flex flex-col shrink-0 border-l border-zinc-100">
          <div className="p-4 border-b border-zinc-100"><h3 className="text-[13px] font-bold">Conteúdo</h3></div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {course.modulos.length === 0 ? (
               <div className="p-4 text-center text-sm text-zinc-500">Nenhum módulo.</div>
            ) : (
              course.modulos.map((mod: any, modIdx: number) => {
                const isModActive = activeModule === modIdx;
                return (
                  <div key={mod.id} className="rounded-xl border border-zinc-100 overflow-hidden">
                    <button onClick={() => setActiveModule(isModActive ? -1 : modIdx)} className="w-full flex items-center justify-between p-3.5 text-left bg-zinc-50 hover:bg-zinc-100">
                      <div className="flex-1 pr-3"><p className="text-[9px] font-bold text-zinc-400">Módulo {modIdx + 1}</p><h4 className="text-[12px] font-bold">{mod.titulo}</h4></div>
                    </button>
                    {isModActive && (
                      <div className="pb-1">
                        {mod.aulas.map((aula: any, lessIdx: number) => (
                          <button key={aula.id} onClick={() => setActiveLesson(lessIdx)} className={`w-full flex items-center gap-2.5 py-2 px-3.5 text-left ${activeLesson === lessIdx ? "bg-primary/5 text-primary" : "text-zinc-600 hover:bg-zinc-50"}`}>
                            <PlayCircle size={14} className={activeLesson === lessIdx ? "text-primary" : "text-zinc-400"} />
                            <p className="text-[12px] font-semibold">{lessIdx + 1}. {aula.titulo}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};