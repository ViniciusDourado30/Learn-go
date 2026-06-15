import React, { useEffect, useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import {
  HelpCircle, ChevronDown, Mail, Send, Search, Book, MessageCircle,
  Sparkles, Check, Video, CreditCard, User, Calendar, Settings,
} from "lucide-react";
import { Input, Textarea, Button, Skeleton, Chip } from "../components/ui/nextui-shim";
import { motion, AnimatePresence } from "motion/react";

const FAQ_CATEGORIES = [
  { id: "all", label: "Tudo", icon: Sparkles },
  { id: "account", label: "Conta", icon: User },
  { id: "courses", label: "Cursos", icon: Book },
  { id: "classes", label: "Aulas", icon: Video },
  { id: "payment", label: "Pagamento", icon: CreditCard },
  { id: "schedule", label: "Agenda", icon: Calendar },
];

const FAQS = [
  { cat: "account", q: "Como altero meus dados pessoais?", a: "Acesse o menu de perfil clicando no seu avatar no canto superior direito e selecione 'Editar perfil'. Você pode alterar nome, e-mail, telefone, foto e demais informações." },
  { cat: "account", q: "Como troco entre o perfil de Aluno e Professor?", a: "Clique no seu avatar no topo da página, e selecione 'Modo: Aluno → Professor' (ou vice-versa). Sua interface será atualizada com os recursos do perfil escolhido." },
  { cat: "account", q: "Esqueci minha senha. O que fazer?", a: "Na tela de login, clique em 'Esqueci minha senha'. Você receberá um e-mail com um link para criar uma nova senha." },
  { cat: "courses", q: "Como me inscrevo em um curso?", a: "Vá em 'Explorar', escolha o curso desejado e clique em 'Comprar agora'. Após o checkout, ele aparecerá em 'Meus Cursos'." },
  { cat: "courses", q: "Posso baixar materiais dos cursos?", a: "Sim, dentro de cada aula há a aba 'Materiais' onde você encontra PDFs, apostilas e recursos extras para download." },
  { cat: "courses", q: "Como faço perguntas durante o curso?", a: "Em qualquer aula, acesse a aba 'Dúvidas'. Lá você pode escrever uma pergunta, anexar imagens ou arquivos, e o professor responderá assim que possível." },
  { cat: "classes", q: "Como agendo uma aula com um professor?", a: "Vá no perfil do professor e clique em 'Agendar Aula'. Escolha data, horário disponível e confirme. Você receberá uma notificação quando confirmada." },
  { cat: "classes", q: "Como cancelo uma aula agendada?", a: "Acesse 'Agenda' no menu, selecione a aula e clique em 'Cancelar'. Cancelamentos com mais de 24h de antecedência são reembolsáveis." },
  { cat: "schedule", q: "Como configuro minha disponibilidade (Professores)?", a: "Como Professor, acesse 'Disponibilidade'. Ative os dias da semana, defina blocos de horário e salve. Os alunos só podem agendar nesses períodos." },
  { cat: "payment", q: "Quais formas de pagamento são aceitas?", a: "Aceitamos cartão de crédito, débito, PIX e boleto. Para Professores, os pagamentos são feitos em até 7 dias úteis após a aula." },
  { cat: "payment", q: "Como solicito reembolso?", a: "Entre em contato pelo formulário abaixo informando o ID da compra. Cursos têm garantia de 7 dias; aulas podem ser reembolsadas até 24h antes." },
];

export const DashboardHelp = () => {
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("alex@learngo.com");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = FAQS.filter((f) => {
    const catOk = activeCat === "all" || f.cat === activeCat;
    const q = search.trim().toLowerCase();
    const searchOk = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
    return catOk && searchOk;
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setSubject("");
      setMessage("");
      setTimeout(() => setSent(false), 3500);
    }, 900);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-8 pb-16">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-6 p-6 md:p-10"
          style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 60%, #0a1628 100%)" }}>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,111,238,0.18) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,111,238,0.2)" }}>
                <HelpCircle size={18} style={{ color: "#60a5fa" }} />
              </div>
              <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(96,165,250,0.7)", fontWeight: 600 }}>
                Central de Ajuda
              </p>
            </div>
            <h1 className="text-[28px] md:text-[36px] mb-3 max-w-2xl" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Como podemos ajudar você?
            </h1>
            <p className="text-[14px] mb-6 max-w-xl" style={{ color: "rgba(255,255,255,0.5)" }}>
              Tire suas dúvidas com a base de conhecimento ou envie uma mensagem direto para nossa equipe.
            </p>
            <div className="relative max-w-xl">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 z-10" style={{ color: "#a1a1aa" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar ajuda... (ex: como agendo uma aula?)"
                className="w-full h-12 pl-11 pr-4 rounded-2xl text-[13px] outline-none"
                style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-3">
              <Skeleton className="h-12 rounded-2xl" />
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
            </div>
            <Skeleton className="h-[420px] rounded-2xl" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-5">
            {/* FAQ */}
            <div className="lg:col-span-2">
              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-4" style={{ scrollbarWidth: "none" }}>
                {FAQ_CATEGORIES.map((c) => {
                  const active = activeCat === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveCat(c.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] shrink-0 transition-all"
                      style={{
                        background: active ? "#006FEE" : "white",
                        color: active ? "white" : "#71717a",
                        border: active ? "1px solid #006FEE" : "1px solid #f4f4f5",
                        fontWeight: active ? 600 : 500,
                      }}
                    >
                      <c.icon size={13} />
                      {c.label}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                {filtered.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center" style={{ border: "1px solid #f4f4f5" }}>
                    <Search size={28} className="text-zinc-200 mx-auto mb-3" />
                    <p className="text-[13px]" style={{ color: "#71717a", fontWeight: 600 }}>Nenhum resultado encontrado</p>
                    <p className="text-[11px] mt-1" style={{ color: "#a1a1aa" }}>Tente outra busca ou envie sua dúvida diretamente.</p>
                  </div>
                ) : (
                  filtered.map((f, i) => {
                    const open = openFaq === i;
                    return (
                      <motion.div
                        key={i}
                        layout
                        className="bg-white rounded-2xl overflow-hidden"
                        style={{ border: "1px solid #f4f4f5" }}
                      >
                        <button
                          onClick={() => setOpenFaq(open ? null : i)}
                          className="w-full flex items-center gap-3 p-4 text-left hover:bg-zinc-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#eff6ff" }}>
                            <HelpCircle size={14} style={{ color: "#006FEE" }} />
                          </div>
                          <p className="flex-1 text-[13px]" style={{ color: "#09090b", fontWeight: 600 }}>{f.q}</p>
                          <ChevronDown size={16} className="shrink-0 transition-transform" style={{ color: "#a1a1aa", transform: open ? "rotate(180deg)" : undefined }} />
                        </button>
                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              style={{ overflow: "hidden" }}
                            >
                              <p className="px-4 pb-4 pl-[60px] text-[12px] leading-relaxed" style={{ color: "#52525b" }}>
                                {f.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Contact form */}
            <div>
              <div className="bg-white rounded-2xl p-5 sticky top-4" style={{ border: "1px solid #f4f4f5" }}>
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle size={15} style={{ color: "#006FEE" }} />
                  <h3 className="text-[14px]" style={{ color: "#09090b", fontWeight: 700 }}>Envie sua dúvida</h3>
                </div>
                <p className="text-[11px] mb-4" style={{ color: "#a1a1aa" }}>
                  Não achou o que procurava? Nossa equipe responde em até 24h.
                </p>

                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-8 px-4 rounded-xl"
                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                  >
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-3">
                      <Check size={20} className="text-white" strokeWidth={3} />
                    </div>
                    <p className="text-[13px]" style={{ color: "#15803d", fontWeight: 700 }}>Mensagem enviada!</p>
                    <p className="text-[11px] mt-1" style={{ color: "#16a34a" }}>Nossa equipe entrará em contato no e-mail informado.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={submit} className="space-y-3">
                    <Input label="Seu e-mail" type="email" value={email} onValueChange={setEmail} placeholder="você@exemplo.com" />
                    <Input label="Assunto" value={subject} onValueChange={setSubject} placeholder="Como podemos ajudar?" />
                    <Textarea label="Mensagem" value={message} onValueChange={setMessage} placeholder="Descreva sua dúvida ou feedback..." minRows={5} />

                    <Button
                      type="submit"
                      color="primary"
                      className="w-full text-[12px]"
                      style={{ fontWeight: 600 }}
                      isDisabled={!subject.trim() || !message.trim() || sending}
                      startContent={sending ? null : <Send size={13} />}
                    >
                      {sending ? "Enviando..." : "Enviar mensagem"}
                    </Button>

                    <div className="pt-2 mt-2 flex items-center gap-2" style={{ borderTop: "1px solid #f4f4f5" }}>
                      <Mail size={12} style={{ color: "#a1a1aa" }} />
                      <p className="text-[11px]" style={{ color: "#71717a" }}>
                        Ou envie para <span style={{ color: "#006FEE", fontWeight: 600 }}>suporte@learngo.com</span>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
