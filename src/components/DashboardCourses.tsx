import React, { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Search, Star, Clock, BookOpen, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Course, Category, Level } from "../data/courses";
import { Input, Button, Chip, Avatar, Skeleton } from "../components/ui/nextui-shim";

export const DashboardCourses = () => {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Course[]>([]); // TODO: Fetch do backend
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <DashboardLayout><div className="p-8 text-center text-zinc-500">Buscando cursos...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="pb-10">
        <div className="px-5 md:px-8 pt-6 pb-4">
          <div className="max-w-3xl flex items-center pl-4 pr-1.5 h-12 rounded-2xl bg-white border border-zinc-200">
            <Search size={16} className="text-zinc-300" />
            <input placeholder="Buscar cursos..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 ml-3 outline-none text-[14px]" />
          </div>
        </div>

        <div className="px-5 md:px-8">
          {courses.length === 0 ? (
             <div className="text-center py-20">
               <p className="text-zinc-400">Nenhum curso disponível no momento.</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {/* Loop nos cursos vindo da API entrará aqui */}
             </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};