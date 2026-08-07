import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid, Users, BookOpen, GraduationCap, Compass, PlusCircle,
  Clock, LogOut, SwitchCamera, Bell, Search, X, ChevronRight,
  Calendar, CalendarClock, Check, MessageSquare, Star, Video, Trash2,
  HelpCircle, User as UserIcon,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Avatar, Badge, Button } from "../components/ui/nextui-shim";
import { motion, AnimatePresence } from "framer-motion"; // Ajustado para framer-motion padrão

interface NavItem { icon: React.ElementType; label: string; path: string; badge?: number; }

const getNavItems = (role: string | null): NavItem[] => [
  { icon: LayoutGrid, label: "Início", path: "/dashboard" },
  { icon: Compass, label: "Explorar", path: "/dashboard/courses" },
  { icon: BookOpen, label: "Meus Cursos", path: "/dashboard/my-courses" },
  { icon: Users, label: "Professores", path: "/dashboard/teachers" },
  { icon: Calendar, label: "Agenda", path: "/dashboard/agenda", badge: 0 },
  ...(role === "PROFESSOR" ? [
    { icon: PlusCircle, label: "Criar", path: "/dashboard/create-course" },
    { icon: CalendarClock, label: "Disponibilidade", path: "/dashboard/availability" },
  ] : []),
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);
  
  const navItems = getNavItems(role);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  
  // TODO: Buscar notificações do backend
  const [notifications, setNotifications] = useState<any[]>([]);

  const isActive = (path: string) => path === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(path);

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    navigate("/");
  };

  useEffect(() => {
    if (!profileOpen && !notifOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (profileOpen && !target.closest("[data-profile-menu]")) setProfileOpen(false);
      if (notifOpen && !target.closest("[data-notif-menu]")) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen, notifOpen]);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-white">
      <header className="h-[60px] flex items-center px-5 shrink-0 relative z-30" style={{ borderBottom: "1px solid #f4f4f5" }}>
        <Link to="/dashboard" className="flex items-center gap-2.5 outline-none shrink-0 mr-8">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#006FEE" }}>
            <GraduationCap size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[17px] tracking-tight hidden sm:block" style={{ color: "#09090b", fontWeight: 700 }}>
            Learn<span style={{ color: "#006FEE" }}>&</span>Go
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path} className="flex items-center gap-2 px-3.5 py-2 rounded-full transition-all outline-none relative"
                style={{ background: active ? "#006FEE" : "transparent", color: active ? "white" : "#71717a" }}>
                <item.icon size={15} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[13px]" style={{ fontWeight: active ? 600 : 500 }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => setSearchOpen(!searchOpen)} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-zinc-100" style={{ color: "#71717a" }}>
            <Search size={17} />
          </button>

          {role === "PROFESSOR" && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]" style={{ background: "#fef9c3", color: "#a16207", fontWeight: 600 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Professor
            </div>
          )}

          <div className="relative" data-profile-menu>
            <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="flex items-center gap-2.5 py-1.5 px-2 rounded-full transition-colors hover:bg-zinc-50">
              <Avatar src="" className="w-8 h-8" isBordered color="primary" size="sm" />
              <div className="hidden md:block text-left">
                <p className="text-[12px]" style={{ color: "#09090b", fontWeight: 600 }}>Minha Conta</p>
                <p className="text-[10px]" style={{ color: "#a1a1aa" }}>{role}</p>
              </div>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-zinc-100 shadow-xl py-2 z-50">
                  <button onClick={() => { setProfileOpen(false); navigate("/dashboard/profile"); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-50 transition-colors">
                    <UserIcon size={15} style={{ color: "#71717a" }} /> <span className="text-[12px]" style={{ color: "#3f3f46", fontWeight: 500 }}>Meu Perfil</span>
                  </button>
                  <button onClick={() => { handleLogout(); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors">
                    <LogOut size={15} className="text-red-400" /> <span className="text-[12px] text-red-500" style={{ fontWeight: 500 }}>Sair</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative" style={{ background: "#fafafa" }}>
        {children}
      </main>
    </div>
  );
};