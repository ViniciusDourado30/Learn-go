import React, { useEffect, useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useAuthStore } from "../store/authStore";
import { usePerfil, useUpdatePerfil, useUpload } from "../hooks/useDashboard";
import { Mail, Phone, MapPin, Briefcase, Edit3, Camera, Check, X, Globe, Lock, Bell as BellIcon, Trash2, Star, Award, BookOpen, Save } from "lucide-react";
import { Avatar, Button, Input, Textarea, Switch, Skeleton, Chip } from "../components/ui/nextui-shim";
import { motion } from "framer-motion";
import { StatCard } from "./StatCard";
import { Country, State, City } from "country-state-city";

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
  const { data: apiData, isLoading } = usePerfil();
  const { mutate: salvarPerfil } = useUpdatePerfil();
  const { mutateAsync: uploadFile } = useUpload();

  const [editing, setEditing] = useState(false);
  const [data, setData] = useState<any>({});
  const [draft, setDraft] = useState<any>({});
  const [saved, setSaved] = useState(false);
  
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [marketingNotif, setMarketingNotif] = useState(false);

  // Lists for dropdowns
  const countries = Country.getAllCountries();
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    if (apiData) {
      const p = { ...apiData.user, ...apiData.profile };
      p.name = `${p.nome} ${p.sobrenome}`;
      
      // Converte o nome do banco para ISO code para o Edit mode funcionar
      const c = countries.find(x => x.name === p.pais);
      if (c) { p.paisCode = c.isoCode; }
      
      setData(p); setDraft(p);
    }
  }, [apiData]);

  useEffect(() => {
    if (draft.paisCode) setStates(State.getStatesOfCountry(draft.paisCode));
    else setStates([]);
  }, [draft.paisCode]);
  
  useEffect(() => {
    if (draft.paisCode && draft.estadoCode) setCities(City.getCitiesOfState(draft.paisCode, draft.estadoCode));
    else setCities([]);
  }, [draft.paisCode, draft.estadoCode]);

  const startEdit = () => { setDraft(data); setEditing(true); };
  const cancelEdit = () => { setEditing(false); setDraft(data); };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await uploadFile(e.target.files[0]);
      salvarPerfil({ foto_url: url }, { onSuccess: () => setSaved(true) });
    }
  };

  const saveEdit = () => {
    const [nome, ...sobrenomeParts] = draft.name.split(" ");
    const cName = Country.getCountryByCode(draft.paisCode)?.name || "";
    const sName = State.getStateByCodeAndCountry(draft.estadoCode, draft.paisCode)?.name || "";
    
    const dto = {
      nome: nome, sobrenome: sobrenomeParts.join(" "), telefone: draft.telefone, 
      ocupacao: draft.ocupacao, idioma: draft.idioma, sobre: draft.sobre,
      pais: cName, estado: sName, cidade: draft.cidade,
    };
    salvarPerfil(dto, {
      onSuccess: () => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2200); }
    });
  };

  const stats = role === "PROFESSOR" ? [
    { icon: BookOpen, label: "Cursos publicados", value: "0", color: "#006FEE", hint: "Na plataforma", delta: "0", trend: "flat" as const, spark: [0,0] },
    { icon: Star, label: "Avaliação média", value: "0.0", color: "#d97706", hint: "Reviews de alunos", delta: "0", trend: "flat" as const, spark: [0,0] },
    { icon: Award, label: "Alunos ativos", value: "0", color: "#7c3aed", hint: "Total de matrículas", delta: "0%", trend: "flat" as const, spark: [0,0] },
  ] : [
    { icon: BookOpen, label: "Cursos ativos", value: "0", color: "#006FEE", hint: "Em andamento", delta: "0", trend: "flat" as const, spark: [0,0] },
    { icon: Award, label: "Sequência atual", value: "0 dias", color: "#16a34a", hint: "recorde: 0 dias", delta: "novo", trend: "flat" as const, spark: [0,0] },
    { icon: Star, label: "XP acumulado", value: "0", color: "#d97706", hint: "Nível 1", delta: "0", trend: "flat" as const, spark: [0,0] },
  ];

  if (isLoading) return <DashboardLayout><SkeletonProfile /></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="max-w-[1000px] mx-auto px-5 md:px-8 py-8 pb-16">
        <div className="relative rounded-3xl overflow-hidden mb-6" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 60%, #0a1628 100%)" }}>
          <div className="absolute top-0 right-0 w-[360px] h-[360px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,111,238,0.18) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="relative p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
            <div className="relative shrink-0 overflow-hidden rounded-full w-24 h-24 md:w-28 md:h-28 border-4 group" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <img src={data.foto_url || `https://ui-avatars.com/api/?name=${data.nome}&background=006FEE&color=fff`} alt={data.name} className="w-full h-full object-cover" />
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <input type="file" className="hidden" onChange={handleFileChange} />
                <Camera size={24} className="text-white" />
              </label>
            </div>
            <div className="flex-1 min-w-0">
              <Chip size="sm" color={role === "PROFESSOR" ? "warning" : "primary"} variant="flat" className="text-[10px] mb-2">{role === "PROFESSOR" ? "Professor" : "Aluno"}</Chip>
              <h1 className="text-[24px] md:text-[28px] mb-1 text-white font-bold">{data.name}</h1>
              <p className="text-[13px] text-white/50">{data.ocupacao || "Adicione sua ocupação"} · {data.pais || "Adicione país"}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              {!editing ? <Button color="primary" size="sm" startContent={<Edit3 size={13} />} onPress={startEdit} className="text-[12px] font-bold">Editar perfil</Button> : (
                <>
                  <Button variant="flat" size="sm" startContent={<X size={13}/>} onPress={cancelEdit} className="text-[12px] bg-white/10 text-white font-bold">Cancelar</Button>
                  <Button color="primary" size="sm" startContent={<Save size={13}/>} onPress={saveEdit} className="text-[12px] font-bold">Salvar</Button>
                </>
              )}
            </div>
          </div>
        </div>

        {saved && <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-100 text-green-700"><Check size={15} /> <span className="text-[12px] font-bold">Perfil atualizado com sucesso!</span></div>}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
          {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6 mb-4 border border-zinc-100">
          <h2 className="text-[15px] mb-4 font-bold">Informações pessoais</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {editing ? (
              <>
                <Input label="Nome completo" value={draft.name || ""} onValueChange={(v) => setDraft((d:any) => ({...d, name: v}))} />
                <Input label="E-mail (Apenas leitura)" type="email" value={draft.email || ""} isDisabled />
                <Input label="Telefone" value={draft.telefone || ""} onValueChange={(v) => setDraft((d:any) => ({...d, telefone: v}))} />
                <Input label="Ocupação" value={draft.ocupacao || ""} onValueChange={(v) => setDraft((d:any) => ({...d, ocupacao: v}))} />
                <Input label="Idioma" value={draft.idioma || ""} onValueChange={(v) => setDraft((d:any) => ({...d, idioma: v}))} />
                
                <div>
                  <label className="block text-[12px] mb-1.5 font-medium text-zinc-700">País</label>
                  <select value={draft.paisCode || ""} onChange={e => setDraft((d:any) => ({...d, paisCode: e.target.value, estadoCode: "", cidade: ""}))} className="w-full h-10 px-3 rounded-xl text-[13px] border border-zinc-200">
                    <option value="" disabled>Selecione</option>
                    {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.flag} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] mb-1.5 font-medium text-zinc-700">Estado</label>
                  <select value={draft.estadoCode || ""} disabled={!draft.paisCode} onChange={e => setDraft((d:any) => ({...d, estadoCode: e.target.value, cidade: ""}))} className="w-full h-10 px-3 rounded-xl text-[13px] border border-zinc-200 disabled:opacity-50">
                    <option value="" disabled>Selecione</option>
                    {states.map(s => <option key={s.isoCode} value={s.isoCode}>📍 {s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] mb-1.5 font-medium text-zinc-700">Cidade</label>
                  <select value={draft.cidade || ""} disabled={!draft.estadoCode} onChange={e => setDraft((d:any) => ({...d, cidade: e.target.value}))} className="w-full h-10 px-3 rounded-xl text-[13px] border border-zinc-200 disabled:opacity-50">
                    <option value="" disabled>Selecione</option>
                    {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <Textarea label="Sobre você" value={draft.sobre || ""} onValueChange={(v) => setDraft((d:any) => ({...d, sobre: v}))} minRows={3} />
                </div>
              </>
            ) : (
              <>
                {[
                  { icon: Mail, label: "E-mail", value: data.email },
                  { icon: Phone, label: "Telefone", value: data.telefone || "Não informado" },
                  { icon: MapPin, label: "Localização", value: data.cidade && data.estado ? `${data.cidade}, ${data.estado}` : "Não informado" },
                  { icon: Briefcase, label: "Ocupação", value: data.ocupacao || "Não informado" },
                  { icon: Globe, label: "Idioma", value: data.idioma || "Não informado" },
                ].map((f) => (
                  <div key={f.label} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                    <div className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shrink-0"><f.icon size={14} className="text-zinc-500" /></div>
                    <div className="flex-1 min-w-0"><p className="text-[10px] font-bold uppercase text-zinc-400">{f.label}</p><p className="text-[13px] font-medium">{f.value}</p></div>
                  </div>
                ))}
                <div className="md:col-span-2 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                  <p className="text-[10px] font-bold uppercase text-zinc-400 mb-2">Sobre</p>
                  <p className="text-[13px] text-zinc-700">{data.sobre || "Nenhuma descrição adicionada."}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6 mb-4 border border-zinc-100">
          <h2 className="text-[15px] mb-4 font-bold">Notificações</h2>
          <div className="space-y-3">
            {[
              { icon: Mail, label: "Notificações por e-mail", desc: "Receba atualizações importantes no e-mail.", val: emailNotif, set: setEmailNotif },
              { icon: BellIcon, label: "Notificações push", desc: "Alertas em tempo real no navegador.", val: pushNotif, set: setPushNotif },
              { icon: Star, label: "Novidades e promoções", desc: "Ofertas exclusivas e cursos em destaque.", val: marketingNotif, set: setMarketingNotif },
            ].map((it) => (
              <div key={it.label} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-blue-50"><it.icon size={14} className="text-blue-500" /></div>
                <div className="flex-1 min-w-0"><p className="text-[13px] font-bold">{it.label}</p><p className="text-[11px] text-zinc-400">{it.desc}</p></div>
                <Switch isSelected={it.val} onValueChange={it.set} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6 border border-zinc-100">
          <h2 className="text-[15px] mb-4 font-bold">Segurança e conta</h2>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors text-left">
              <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0"><Lock size={14} className="text-zinc-600" /></div>
              <div className="flex-1"><p className="text-[13px] font-bold">Alterar senha</p><p className="text-[11px] text-zinc-400">Atualize suas credenciais de acesso.</p></div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-left">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0"><Trash2 size={14} className="text-red-500" /></div>
              <div className="flex-1"><p className="text-[13px] font-bold text-red-500">Excluir conta</p><p className="text-[11px] text-zinc-400">Esta ação não pode ser desfeita.</p></div>
            </button>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};