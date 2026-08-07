import React, { useEffect, useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useAuthStore } from "../store/authStore";
import {
  Mail, Phone, MapPin, Briefcase, Edit3, Camera, Check, X,
  Globe, Lock, Bell as BellIcon, Trash2, Star, Award, BookOpen, Save,
} from "lucide-react";
import { Avatar, Button, Input, Textarea, Switch, Skeleton, Chip } from "../components/ui/nextui-shim";
import { motion } from "framer-motion";
import { StatCard } from "./StatCard";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  occupation: string;
  language: string;
  avatar: string;
}

const INITIAL_DATA: ProfileData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  occupation: "",
  language: "",
  avatar: "",
};

const SkeletonProfile = () => (
  <div className="max-w-[1000px] mx-auto px-5 md:px-8 py-8 space-y-6">
    <Skeleton className="h-[180px] rounded-3xl" />
    <div className="grid md:grid-cols-3 gap-4">
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-24 rounded-2xl" />
      <Skeleton className="h-24 rounded-2xl" />
    </div>
    <Skeleton className="h-[400px] rounded-2xl" />
  </div>
);

export const DashboardProfile = () => {
  const role = useAuthStore((state) => state.role);
  
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState<ProfileData>(INITIAL_DATA);
  const [draft, setDraft] = useState<ProfileData>(INITIAL_DATA);
  
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [marketingNotif, setMarketingNotif] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // TODO: Chamar API para buscar os dados do usuário logado e preencher o state 'data'
    // Exemplo: api.get('/auth/perfil').then(res => setData(res.data));
    
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const startEdit = () => { setDraft(data); setEditing(true); };
  const cancelEdit = () => { setEditing(false); setDraft(data); };
  const saveEdit = () => {
    // TODO: Chamar API (ex: useMutation do TanStack) para enviar 'draft' para o banco
    // api.patch('/auth/perfil', draft).then(() => { ... })
    
    setData(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const update = (k: keyof ProfileData, v: string) => setDraft((d) => ({ ...d, [k]: v }));

  // TODO: Buscar estatísticas reais do backend
  const stats: Array<{ icon: any; label: string; value: string; color: string; hint: string; delta: string; trend: "up" | "down" | "flat"; spark: number[] }> = role === "PROFESSOR"
    ? [
        { icon: BookOpen, label: "Cursos publicados", value: "0", color: "#006FEE", hint: "0 em rascunho", delta: "0", trend: "flat", spark: [0,0,0,0,0] },
        { icon: Star, label: "Avaliação média", value: "0.0", color: "#d97706", hint: "0 reviews", delta: "0", trend: "flat", spark: [0,0,0,0,0] },
        { icon: Award, label: "Alunos ativos", value: "0", color: "#7c3aed", hint: "este mês", delta: "0%", trend: "flat", spark: [0,0,0,0,0] },
      ]
    : [
        { icon: BookOpen, label: "Cursos ativos", value: "0", color: "#006FEE", hint: "0 quase concluídos", delta: "0", trend: "flat", spark: [0,0,0,0,0] },
        { icon: Award, label: "Sequência atual", value: "0 dias", color: "#16a34a", hint: "recorde: 0 dias", delta: "0", trend: "flat", spark: [0,0,0,0,0] },
        { icon: Star, label: "XP acumulado", value: "0", color: "#d97706", hint: "Nível 1", delta: "0", trend: "flat", spark: [0,0,0,0,0] },
      ];

  return (
    <DashboardLayout>
      {loading ? <SkeletonProfile /> : (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="max-w-[1000px] mx-auto px-5 md:px-8 py-8 pb-16"
        >
          {/* Hero card */}
          <div className="relative rounded-3xl overflow-hidden mb-6"
            style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 60%, #0a1628 100%)" }}>
            <div className="absolute top-0 right-0 w-[360px] h-[360px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(0,111,238,0.18) 0%, transparent 70%)", filter: "blur(60px)" }} />
            <div className="relative p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
              <div className="relative shrink-0">
                <img src={data.avatar || "https://ui-avatars.com/api/?name=User&background=006FEE&color=fff"} alt={data.name || "User"}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }} />
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#006FEE] hover:bg-[#005bcc] transition-colors">
                  <Camera size={14} className="text-white" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Chip size="sm" color={role === "PROFESSOR" ? "warning" : "primary"} variant="flat" className="text-[10px]">
                    {role === "PROFESSOR" ? "Professor Verificado" : "Aluno Premium"}
                  </Chip>
                </div>
                <h1 className="text-[24px] md:text-[28px] mb-1" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  {data.name || "Seu Nome"}
                </h1>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {data.occupation || "Sua Ocupação"} · {data.location || "Sua Localização"}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!editing ? (
                  <Button color="primary" size="sm" startContent={<Edit3 size={13} />} onPress={startEdit} className="text-[12px]" style={{ fontWeight: 600 }}>
                    Editar perfil
                  </Button>
                ) : (
                  <>
                    <Button variant="flat" size="sm" startContent={<X size={13} />} onPress={cancelEdit}
                      className="text-[12px] bg-white/10 text-white hover:bg-white/20" style={{ fontWeight: 600 }}>
                      Cancelar
                    </Button>
                    <Button color="primary" size="sm" startContent={<Save size={13} />} onPress={saveEdit} className="text-[12px]" style={{ fontWeight: 600 }}>
                      Salvar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {saved && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{ background: "#dcfce7", color: "#15803d" }}>
              <Check size={15} /> <span className="text-[12px]" style={{ fontWeight: 600 }}>Perfil atualizado com sucesso!</span>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} index={i} />
            ))}
          </div>

          {/* Personal Info */}
          <div className="bg-white rounded-2xl p-5 md:p-6 mb-4" style={{ border: "1px solid #f4f4f5" }}>
            <h2 className="text-[15px] mb-4" style={{ color: "#09090b", fontWeight: 700 }}>Informações pessoais</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {editing ? (
                <>
                  <Input label="Nome completo" value={draft.name} onValueChange={(v) => update("name", v)} />
                  <Input label="E-mail" type="email" value={draft.email} onValueChange={(v) => update("email", v)} />
                  <Input label="Telefone" value={draft.phone} onValueChange={(v) => update("phone", v)} />
                  <Input label="Localização" value={draft.location} onValueChange={(v) => update("location", v)} />
                  <Input label="Ocupação" value={draft.occupation} onValueChange={(v) => update("occupation", v)} />
                  <Input label="Idioma" value={draft.language} onValueChange={(v) => update("language", v)} />
                  <div className="md:col-span-2">
                    <Textarea label="Sobre você" value={draft.bio} onValueChange={(v) => update("bio", v)} minRows={3} />
                  </div>
                </>
              ) : (
                <>
                  {[
                    { icon: Mail, label: "E-mail", value: data.email || "-" },
                    { icon: Phone, label: "Telefone", value: data.phone || "-" },
                    { icon: MapPin, label: "Localização", value: data.location || "-" },
                    { icon: Briefcase, label: "Ocupação", value: data.occupation || "-" },
                    { icon: Globe, label: "Idioma", value: data.language || "-" },
                  ].map((f) => (
                    <div key={f.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "#fafafa" }}>
                      <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0" style={{ border: "1px solid #f4f4f5" }}>
                        <f.icon size={14} style={{ color: "#71717a" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-wider" style={{ color: "#a1a1aa", fontWeight: 600 }}>{f.label}</p>
                        <p className="text-[13px] mt-0.5 truncate" style={{ color: "#09090b", fontWeight: 500 }}>{f.value}</p>
                      </div>
                    </div>
                  ))}
                  <div className="md:col-span-2 p-4 rounded-xl" style={{ background: "#fafafa" }}>
                    <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "#a1a1aa", fontWeight: 600 }}>Sobre</p>
                    <p className="text-[13px] leading-relaxed" style={{ color: "#3f3f46" }}>{data.bio || "Nenhuma descrição adicionada."}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl p-5 md:p-6 mb-4" style={{ border: "1px solid #f4f4f5" }}>
            <h2 className="text-[15px] mb-4" style={{ color: "#09090b", fontWeight: 700 }}>Notificações</h2>
            <div className="space-y-3">
              {[
                { icon: Mail, label: "Notificações por e-mail", desc: "Receba atualizações importantes no e-mail.", val: emailNotif, set: setEmailNotif },
                { icon: BellIcon, label: "Notificações push", desc: "Alertas em tempo real no navegador.", val: pushNotif, set: setPushNotif },
                { icon: Star, label: "Novidades e promoções", desc: "Ofertas exclusivas e cursos em destaque.", val: marketingNotif, set: setMarketingNotif },
              ].map((it) => (
                <div key={it.label} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#eff6ff" }}>
                    <it.icon size={14} style={{ color: "#006FEE" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px]" style={{ color: "#09090b", fontWeight: 600 }}>{it.label}</p>
                    <p className="text-[11px]" style={{ color: "#a1a1aa" }}>{it.desc}</p>
                  </div>
                  <Switch isSelected={it.val} onValueChange={it.set} />
                </div>
              ))}
            </div>
          </div>

          {/* Security / Danger */}
          <div className="bg-white rounded-2xl p-5 md:p-6" style={{ border: "1px solid #f4f4f5" }}>
            <h2 className="text-[15px] mb-4" style={{ color: "#09090b", fontWeight: 700 }}>Segurança e conta</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors text-left">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                  <Lock size={14} style={{ color: "#3f3f46" }} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px]" style={{ color: "#09090b", fontWeight: 600 }}>Alterar senha</p>
                  <p className="text-[11px]" style={{ color: "#a1a1aa" }}>Atualize suas credenciais de acesso.</p>
                </div>
              </button>
              {/* TODO: Ligar a exclusão de conta na API */}
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-left">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <Trash2 size={14} className="text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-red-500" style={{ fontWeight: 600 }}>Excluir conta</p>
                  <p className="text-[11px]" style={{ color: "#a1a1aa" }}>Esta ação não pode ser desfeita.</p>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
};