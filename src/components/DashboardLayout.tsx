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
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const getNavItems = (role: string | null): NavItem[] => [
  { icon: LayoutGrid, label: "Início", path: "/dashboard" },
  { icon: Compass, label: "Explorar", path: "/dashboard/courses" },
  { icon: BookOpen, label: "Meus Cursos", path: "/dashboard/my-courses" },
  { icon: Users, label: "Professores", path: "/dashboard/teachers" },
  { icon: Calendar, label: "Agenda", path: "/dashboard/agenda", badge: 2 },
  ...(role === "PROFESSOR"
    ? [
        { icon: PlusCircle, label: "Criar", path: "/dashboard/create-course" },
        { icon: CalendarClock, label: "Disponibilidade", path: "/dashboard/availability" },
      ]
    : []),
];

const mockNotifications = [
  { id: "1", type: "class" as const, title: "Aula confirmada", desc: "Sua aula com Sarah Jenkins foi agendada para amanhã às 14:00.", time: "Há 5 min", read: false, icon: Calendar, iconBg: "#eff6ff", iconColor: "#006FEE" },
  { id: "2", type: "message" as const, title: "Nova mensagem", desc: 'Carlos Mendes: "Olá! Vi que você se inscreveu no meu curso..."', time: "Há 20 min", read: false, icon: MessageSquare, iconBg: "#f3e8ff", iconColor: "#7c3aed" },
  { id: "3", type: "review" as const, title: "Nova avaliação", desc: "Um aluno deixou 5 estrelas na sua aula de conversação.", time: "Há 1 hora", read: false, icon: Star, iconBg: "#fef9c3", iconColor: "#d97706" },
  { id: "4", type: "live" as const, title: "Aula ao vivo em 30min", desc: "Conversação em Grupo - Nível Intermediário começa em breve.", time: "Há 2 horas", read: true, icon: Video, iconBg: "#fce4ec", iconColor: "#e11d48" },
  { id: "5", type: "class" as const, title: "Lembrete de aula", desc: "Você tem uma aula de Cálculo com David Kim amanhã às 18:00.", time: "Há 3 horas", read: true, icon: Clock, iconBg: "#dcfce7", iconColor: "#16a34a" },
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
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const isActive = (path: string) =>
    path === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(path);

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    navigate("/");
  };

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const removeNotif = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

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
                {item.badge && !active && <span className="w-1.5 h-1.5 rounded-full bg-[#006FEE] absolute top-1.5 right-1.5" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => setSearchOpen(!searchOpen)} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-zinc-100" style={{ color: "#71717a" }} aria-label="Buscar">
            <Search size={17} />
          </button>

          {role === "PROFESSOR" && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]" style={{ background: "#fef9c3", color: "#a16207", fontWeight: 600 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Professor
            </div>
          )}

          <Link to="/dashboard/help" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-zinc-100"
            style={{ color: location.pathname.startsWith("/dashboard/help") ? "#006FEE" : "#71717a", background: location.pathname.startsWith("/dashboard/help") ? "#eff6ff" : undefined }}
            aria-label="Ajuda" title="Central de Ajuda">
            <HelpCircle size={17} />
          </Link>

          <div className="relative" data-notif-menu>
            <Badge content={unreadCount > 0 ? String(unreadCount) : undefined} color="primary" size="sm" shape="circle">
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-zinc-100"
                style={{ color: notifOpen ? "#006FEE" : "#71717a", background: notifOpen ? "#eff6ff" : undefined }} aria-label="Notificações">
                <Bell size={17} />
              </button>
            </Badge>

            <AnimatePresence>
              {notifOpen && (
                <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-[360px] bg-white rounded-2xl border border-zinc-100 shadow-xl z-50 overflow-hidden">
                  <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f4f4f5" }}>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px]" style={{ color: "#09090b", fontWeight: 700 }}>Notificações</h3>
                      {unreadCount > 0 && <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: "#006FEE", color: "white", fontWeight: 700 }}>{unreadCount}</span>}
                    </div>
                    {unreadCount > 0 && <button onClick={markAllRead} className="flex items-center gap-1 text-[11px] hover:opacity-70 transition-opacity" style={{ color: "#006FEE", fontWeight: 600 }}><Check size={12} /> Marcar tudo lido</button>}
                  </div>
                  <div className="max-h-[380px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-12 text-center"><Bell size={28} className="text-zinc-200 mx-auto mb-3" /><p className="text-[13px] text-zinc-400">Nenhuma notificação</p></div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="group flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-zinc-50 cursor-pointer relative" style={{ background: n.read ? undefined : "#fafcff" }} onClick={() => markRead(n.id)}>
                          {!n.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: "#006FEE" }} />}
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: n.iconBg }}><n.icon size={15} style={{ color: n.iconColor }} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] mb-0.5" style={{ color: "#09090b", fontWeight: n.read ? 500 : 700 }}>{n.title}</p>
                            <p className="text-[11px] leading-relaxed truncate" style={{ color: "#71717a" }}>{n.desc}</p>
                            <p className="text-[10px] mt-1" style={{ color: "#a1a1aa" }}>{n.time}</p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); removeNotif(n.id); }} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-zinc-200 shrink-0 mt-1" aria-label="Remover notificação"><X size={12} className="text-zinc-400" /></button>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="px-5 py-3 text-center" style={{ borderTop: "1px solid #f4f4f5" }}>
                      <button className="text-[11px] hover:opacity-70 transition-opacity" style={{ color: "#006FEE", fontWeight: 600 }} onClick={() => { setNotifOpen(false); navigate("/dashboard/agenda"); }}>Ver todas as notificações</button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" data-profile-menu>
            <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="flex items-center gap-2.5 py-1.5 px-2 rounded-full transition-colors hover:bg-zinc-50">
              <Avatar src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=100&h=100" className="w-8 h-8" isBordered color="primary" size="sm" />
              <div className="hidden md:block text-left">
                <p className="text-[12px]" style={{ color: "#09090b", fontWeight: 600 }}>Minha Conta</p>
                <p className="text-[10px]" style={{ color: "#a1a1aa" }}>{role === "ALUNO" ? "Aluno Premium" : "Prof. Verificado"}</p>
              </div>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-zinc-100 shadow-xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-zinc-100">
                    <p className="text-[13px]" style={{ color: "#09090b", fontWeight: 600 }}>Minha Conta</p>
                  </div>
                  <button onClick={() => { setProfileOpen(false); navigate("/dashboard/profile"); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-50 transition-colors">
                    <UserIcon size={15} style={{ color: "#71717a" }} /> <span className="text-[12px]" style={{ color: "#3f3f46", fontWeight: 500 }}>Meu Perfil</span>
                  </button>
                  <button onClick={() => { setProfileOpen(false); navigate("/dashboard/help"); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-50 transition-colors">
                    <HelpCircle size={15} style={{ color: "#71717a" }} /> <span className="text-[12px]" style={{ color: "#3f3f46", fontWeight: 500 }}>Ajuda & Suporte</span>
                  </button>
                  <div className="h-px bg-zinc-100 mx-3 my-1" />
                  <button onClick={() => { handleLogout(); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors">
                    <LogOut size={15} className="text-red-400" /> <span className="text-[12px] text-red-500" style={{ fontWeight: 500 }}>Sair</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-[60px] left-0 right-0 z-40 bg-white border-b border-zinc-100 shadow-lg">
            <div className="max-w-2xl mx-auto flex items-center gap-3 px-5 py-4">
              <Search size={18} className="text-zinc-300 shrink-0" />
              <input autoFocus placeholder="Buscar cursos, professores, aulas..." className="flex-1 outline-none text-[15px] text-zinc-800 placeholder:text-zinc-400 bg-transparent" />
              <button onClick={() => setSearchOpen(false)} className="p-1.5 rounded-lg hover:bg-zinc-100" aria-label="Fechar busca"><X size={16} className="text-zinc-400" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto relative" style={{ background: "#fafafa" }}>
        {children}
      </main>

      <nav className="lg:hidden flex items-center justify-around h-16 shrink-0 bg-white px-2" style={{ borderTop: "1px solid #f4f4f5" }}>
        {navItems.slice(0, 5).map((item) => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all relative">
              <item.icon size={20} strokeWidth={active ? 2.5 : 1.8} style={{ color: active ? "#006FEE" : "#a1a1aa" }} />
              <span className="text-[9px]" style={{ color: active ? "#006FEE" : "#a1a1aa", fontWeight: active ? 700 : 500 }}>{item.label}</span>
              {active && <motion.div layoutId="dock-indicator" className="absolute -top-1 w-5 h-0.5 rounded-full" style={{ background: "#006FEE" }} />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};