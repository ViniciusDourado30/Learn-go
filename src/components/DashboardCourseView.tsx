import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { useCurso, getImageUrl, usePerfil, useAdicionarDuvida, useRegistrarProgresso } from "../hooks/useDashboard";
import { useAuthStore } from "../store/authStore";
import {
  ChevronLeft, PlayCircle, CheckCircle, FileText, SkipForward, MoreVertical, Play, Plus,
  MessageSquare, Paperclip, Send, X, ImageIcon, Reply as ReplyIcon, ThumbsUp, Clock,
} from "lucide-react";
import { Button, Progress, Avatar, Chip, Tabs, Tab, Skeleton, Textarea } from "../components/ui/nextui-shim";

interface Attachment {
  name: string; size: string; type: "image" | "file"; url?: string;
}
interface Comment {
  id: string; author: string; avatar: string; isProf?: boolean;
  text: string; time: string; likes: number; liked?: boolean;
  attachments?: Attachment[]; replies: Comment[];
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: "c1", author: "Marcelo",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80",
    text: "Onde posso encontrar mais exemplos sobre esse tema? Tentei aplicar o conceito num projeto e ficou um pouco confuso na parte de implementação.",
    time: "Há 2 dias", likes: 4, replies: [
      {
        id: "c1r1", author: "Professor(a)",
        avatar: "https://images.unsplash.com/photo-1758685848226-eedca8f6bce7?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80",
        isProf: true,
        text: "Olá Marcelo! Dá uma olhada na aba 'Materiais' desta aula — adicionei um PDF extra com exercícios resolvidos. Qualquer dúvida adicional, me chame!",
        time: "Há 1 dia", likes: 8, replies: [
          { id: "c1r1r1", author: "Marcelo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80", text: "Perfeito, professora! Já encontrei. Muito obrigado!", time: "Há 22 horas", likes: 2, replies: [] }
        ],
      },
    ],
  },
  {
    id: "c2", author: "Ana Costa",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=80&q=80",
    text: "Conteúdo excelente! Consegui aplicar imediatamente no meu trabalho.",
    time: "Há 5 dias", likes: 12, replies: [],
  },
];

const SkeletonCourseView = () => (
  <DashboardLayout>
    <div className="flex flex-col h-[calc(100vh-60px)] w-full bg-white">
      <div className="h-14 px-6 flex items-center gap-3" style={{ borderBottom: "1px solid #f4f4f5" }}>
        <Skeleton className="w-7 h-7 rounded-lg" /><Skeleton className="h-4 w-48 rounded" />
      </div>
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 overflow-hidden"><Skeleton className="w-full aspect-video rounded-none" /><div className="p-5 space-y-3"><Skeleton className="h-5 w-2/3 rounded" /><Skeleton className="h-3 w-1/3 rounded" /></div></div>
        <div className="w-full lg:w-[340px] p-3 space-y-2" style={{ borderLeft: "1px solid #f4f4f5" }}>{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      </div>
    </div>
  </DashboardLayout>
);

const AttachmentChip = ({ a, onRemove }: { a: Attachment; onRemove?: () => void }) => (
  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white max-w-[220px]" style={{ border: "1px solid #e4e4e7" }}>
    {a.type === "image" ? (
      <div className="w-7 h-7 rounded-md overflow-hidden bg-zinc-100 shrink-0">{a.url && <img src={a.url} alt="" className="w-full h-full object-cover" />}</div>
    ) : (
      <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: "#eff6ff" }}><FileText size={12} style={{ color: "#006FEE" }} /></div>
    )}
    <div className="flex-1 min-w-0"><p className="text-[11px] truncate" style={{ color: "#09090b", fontWeight: 600 }}>{a.name}</p><p className="text-[9px]" style={{ color: "#a1a1aa" }}>{a.size}</p></div>
    {onRemove && <button onClick={onRemove} className="p-0.5 rounded hover:bg-zinc-100 shrink-0" aria-label="Remover anexo"><X size={11} className="text-zinc-400" /></button>}
  </div>
);

interface ComposerProps { placeholder: string; onSubmit: (text: string, attachments: Attachment[]) => void; onCancel?: () => void; compact?: boolean; avatar: string; }
const Composer: React.FC<ComposerProps> = ({ placeholder, onSubmit, onCancel, compact, avatar }) => {
  const [text, setText] = useState(""); const [attachments, setAttachments] = useState<Attachment[]>([]); const fileInput = useRef<HTMLInputElement>(null);
  const handleFiles = (files: FileList | null) => { if (!files) return; const list: Attachment[] = Array.from(files).map(f => ({ name: f.name, size: `${(f.size / 1024).toFixed(0)} KB`, type: f.type.startsWith("image/") ? "image" : "file", url: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined })); setAttachments(p => [...p, ...list]); };
  const submit = () => { if (!text.trim() && attachments.length === 0) return; onSubmit(text.trim(), attachments); setText(""); setAttachments([]); };
  return (
    <div className="flex gap-2.5">
      <Avatar src={avatar} className={compact ? "w-7 h-7" : "w-9 h-9"} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="rounded-xl bg-white" style={{ border: "1px solid #e4e4e7" }}>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder={placeholder} rows={compact ? 2 : 3} className="w-full px-3 py-2.5 text-[12px] outline-none resize-none rounded-xl" style={{ color: "#09090b" }} />
          {attachments.length > 0 && <div className="flex flex-wrap gap-1.5 px-3 pb-2 pt-1 border-t border-zinc-100">{attachments.map((a, i) => <AttachmentChip key={i} a={a} onRemove={() => setAttachments(p => p.filter((_, j) => j !== i))} />)}</div>}
          <div className="flex items-center justify-between px-2 py-1.5 border-t border-zinc-100">
            <div className="flex items-center gap-1">
              <input ref={fileInput} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" className="hidden" onChange={e => { handleFiles(e.target.files); e.target.value = ""; }} />
              <button onClick={() => fileInput.current?.click()} className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-zinc-100 transition-colors"><Paperclip size={13} className="text-zinc-500" /><span className="text-[11px] text-zinc-500" style={{ fontWeight: 500 }}>Anexar</span></button>
              <button onClick={() => fileInput.current?.click()} className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-zinc-100 transition-colors"><ImageIcon size={13} className="text-zinc-500" /><span className="text-[11px] text-zinc-500 hidden sm:inline" style={{ fontWeight: 500 }}>Imagem</span></button>
            </div>
            <div className="flex items-center gap-1.5">
              {onCancel && <button onClick={onCancel} className="px-3 py-1 rounded-lg text-[11px] hover:bg-zinc-100 transition-colors" style={{ color: "#71717a", fontWeight: 600 }}>Cancelar</button>}
              <button onClick={submit} disabled={!text.trim() && attachments.length === 0} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors" style={{ background: text.trim() || attachments.length > 0 ? "#006FEE" : "#e4e4e7", color: text.trim() || attachments.length > 0 ? "white" : "#a1a1aa", fontWeight: 600 }}><Send size={11} /> Publicar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CommentNodeProps { c: Comment; depth: number; replyingTo: string | null; onReplyToggle: (id: string) => void; onSubmitReply: (parentId: string, text: string, attachments: Attachment[]) => void; onLike: (id: string) => void; userAvatar: string; }
const CommentNode: React.FC<CommentNodeProps> = ({ c, depth, replyingTo, onReplyToggle, onSubmitReply, onLike, userAvatar }) => {
  const isRoot = depth === 0; const avatarSize = isRoot ? "w-9 h-9" : "w-7 h-7";
  return (
    <div className="flex gap-2.5">
      <Avatar src={c.avatar} className={avatarSize} size="sm" />
      <div className="flex-1 min-w-0">
        <div className={isRoot ? "" : "rounded-xl px-3 py-2.5"} style={isRoot ? undefined : { background: c.isProf ? "#eff6ff" : "#fafafa" }}>
          <div className="flex items-center gap-2 mb-1">
            <span className={isRoot ? "text-[12px]" : "text-[11px]"} style={{ color: "#09090b", fontWeight: 700 }}>{c.author}</span>
            {c.isProf && <Chip size="sm" color="primary" variant="flat" className="text-[8px] h-4">Prof</Chip>}
            <span className="text-[10px] text-zinc-400">· {c.time}</span>
          </div>
          <p className={`${isRoot ? "text-[13px]" : "text-[12px]"} leading-relaxed`} style={{ color: "#3f3f46" }}>{c.text}</p>
          {c.attachments && c.attachments.length > 0 && <div className="flex flex-wrap gap-1.5 mt-2">{c.attachments.map((a, i) => <AttachmentChip key={i} a={a} />)}</div>}
        </div>
        <div className="flex items-center gap-4 mt-1.5 px-1">
          <button onClick={() => onLike(c.id)} className="flex items-center gap-1 hover:opacity-70 transition-opacity">
            <ThumbsUp size={isRoot ? 12 : 11} style={{ color: c.liked ? "#006FEE" : "#a1a1aa", fill: c.liked ? "#006FEE" : "none" }} />
            <span className={isRoot ? "text-[11px]" : "text-[10px]"} style={{ color: c.liked ? "#006FEE" : "#71717a", fontWeight: 600 }}>{c.likes > 0 ? c.likes : ""} {isRoot ? (c.likes === 1 ? "Curtida" : c.likes > 1 ? "Curtidas" : "Curtir") : "Curtir"}</span>
          </button>
          <button onClick={() => onReplyToggle(c.id)} className="flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: "#71717a" }}>
            <ReplyIcon size={isRoot ? 12 : 11} /><span className={isRoot ? "text-[11px]" : "text-[10px]"} style={{ fontWeight: 600 }}>Responder</span>
          </button>
          {c.replies.length > 0 && isRoot && <span className="text-[10px] text-zinc-400">· {c.replies.length} {c.replies.length === 1 ? "resposta" : "respostas"}</span>}
        </div>
        {(c.replies.length > 0 || replyingTo === c.id) && (
          <div className={`mt-3 space-y-3 ${isRoot ? "pt-3" : "pt-2"} relative`} style={isRoot ? { borderTop: "1px solid #f4f4f5" } : undefined}>
            {!isRoot && <div className="absolute left-[-22px] top-0 bottom-2 w-px" style={{ background: "#e4e4e7" }} />}
            {c.replies.map(r => <CommentNode key={r.id} c={r} depth={depth + 1} replyingTo={replyingTo} onReplyToggle={onReplyToggle} onSubmitReply={onSubmitReply} onLike={onLike} userAvatar={userAvatar} />)}
            {replyingTo === c.id && <Composer avatar={userAvatar} placeholder={`Responder a ${c.author}...`} compact onSubmit={(t, a) => onSubmitReply(c.id, t, a)} onCancel={() => onReplyToggle(c.id)} />}
          </div>
        )}
      </div>
    </div>
  );
};

const addReplyToTree = (nodes: Comment[], parentId: string, reply: Comment): Comment[] =>
  nodes.map(n => n.id === parentId ? { ...n, replies: [...n.replies, reply] } : { ...n, replies: addReplyToTree(n.replies, parentId, reply) });
const toggleLikeInTree = (nodes: Comment[], id: string): Comment[] =>
  nodes.map(n => n.id === id ? { ...n, liked: !n.liked, likes: n.likes + (n.liked ? -1 : 1) } : { ...n, replies: toggleLikeInTree(n.replies, id) });

export const DashboardCourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useAuthStore(state => state.role);
  const { data: course, isLoading } = useCurso(id!);

  const [activeTab, setActiveTab] = useState("overview");
  const [activeModule, setActiveModule] = useState<number>(0);
  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeAulaTitle, setActiveAulaTitle] = useState("");
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const { data: perfil } = usePerfil();
  const { mutate: adicionarDuvida } = useAdicionarDuvida();
  const { mutate: registrarProgresso } = useRegistrarProgresso();

  const userAvatar = perfil?.foto_url ? getImageUrl(perfil.foto_url) : "https://ui-avatars.com/api/?name=Eu&background=006FEE&color=fff";

  const currentModulo = course?.modulos?.[activeModule];
  const currentAula = currentModulo?.aulas?.[activeLesson];

  // Set first lesson as active when course loads
  useEffect(() => {
    if (course?.modulos?.[0]?.aulas?.[0] && !activeVideoUrl) {
      setActiveVideoUrl(course.modulos[0].aulas[0].video_url);
      setActiveAulaTitle(course.modulos[0].aulas[0].titulo);
    }
  }, [course]);

  // Simular assistir aula por 5s para marcar 60%
  useEffect(() => {
    if (!currentAula) return;
    const timer = setTimeout(() => {
      registrarProgresso(currentAula.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentAula]);

  const getEmbedUrl = (url: string, aulaId?: string) => {
    if (!url) return "";
    let finalUrl = url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) finalUrl = `https://www.youtube.com/embed/${match[2]}`;
    // Adiciona o aulaId para forçar reload no Iframe se for a mesma url base
    return aulaId ? `${finalUrl}?aulaId=${aulaId}` : finalUrl;
  };

  const addComment = (text: string) => {
    if (currentAula) adicionarDuvida({ aulaId: currentAula.id, texto: text });
    setComposing(false);
  };
  const addReply = (parentId: string, text: string, attachments: Attachment[]) => {
    // mock local temporário para respostas
    const r: Comment = { id: `r${Date.now()}`, author: perfil?.nome || "Você", avatar: userAvatar, isProf: role === "PROFESSOR", text, time: "Agora", likes: 0, attachments, replies: [] };
    setComments(p => addReplyToTree(p, parentId, r)); setReplyingTo(null);
  };
  const toggleLike = (id: string) => setComments(p => toggleLikeInTree(p, id));
  const toggleReplyTo = (id: string) => setReplyingTo(cur => cur === id ? null : id);

  // Mapear duvidas do banco de dados
  useEffect(() => {
    if (currentAula?.duvidas) {
      const dbComments: Comment[] = currentAula.duvidas.map((d: any) => ({
        id: d.id,
        author: d.aluno?.nome ? `${d.aluno.nome} ${d.aluno.sobrenome}` : "Aluno Anônimo",
        avatar: "https://ui-avatars.com/api/?name=A&background=f4f4f5&color=000",
        isProf: false,
        text: d.texto,
        time: new Date(d.criado_em).toLocaleDateString('pt-BR'),
        likes: d.curtidas || 0,
        replies: (d.respostas || []).map((r: any) => ({
          id: r.id,
          author: r.autor?.nome ? `${r.autor.nome} ${r.autor.sobrenome}` : "Usuário",
          avatar: "https://ui-avatars.com/api/?name=U&background=f4f4f5&color=000",
          isProf: r.is_teacher,
          text: r.texto,
          time: new Date(r.criado_em).toLocaleDateString('pt-BR'),
          likes: r.curtidas || 0,
          replies: []
        }))
      }));
      setComments(dbComments.reverse()); // Recentes primeiro
    } else {
      setComments([]);
    }
  }, [currentAula?.duvidas]);

  if (isLoading) return <SkeletonCourseView />;
  if (!course) return <DashboardLayout><div className="p-8 text-center">Curso não encontrado.</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-60px)] w-full overflow-hidden bg-white">
        <header className="h-14 flex items-center justify-between px-4 lg:px-6 shrink-0 z-10" style={{ borderBottom: "1px solid #f4f4f5" }}>
          <div className="flex items-center gap-3">
            <Button isIconOnly variant="light" size="sm" onPress={() => navigate("/dashboard/my-courses")} className="text-zinc-400" aria-label="Voltar"><ChevronLeft size={18} /></Button>
            <div className="hidden sm:block w-px h-5 bg-zinc-200" />
            <div className="flex items-center gap-2">
              <h1 className="text-[13px] text-zinc-800 line-clamp-1" style={{ fontWeight: 600 }}>{course.titulo}</h1>
              <Chip size="sm" variant="flat" color="primary" className="hidden md:flex text-[9px]">Módulo {activeModule + 1}</Chip>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2.5">
              <span className="text-[11px] text-zinc-400" style={{ fontWeight: 500 }}>Progresso</span>
              <Progress value={course.progress || 10} color="primary" size="sm" className="w-20" />
              <span className="text-[11px]" style={{ color: "#09090b", fontWeight: 700 }}>{course.progress || 10}%</span>
            </div>
            <Button isIconOnly variant="light" size="sm" className="text-zinc-400"><MoreVertical size={16} /></Button>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <div className="bg-black w-full aspect-video lg:aspect-[21/9] relative flex justify-center">
              {activeVideoUrl ? (
                <iframe key={currentAula?.id || activeVideoUrl} className="w-full h-full" src={getEmbedUrl(activeVideoUrl, currentAula?.id)} title="Video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              ) : (
                <div className="flex items-center justify-center h-full text-white/50">Nenhum vídeo selecionado</div>
              )}
            </div>

            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderBottom: "1px solid #f4f4f5" }}>
              <div>
                <h2 className="text-[16px] mb-0.5" style={{ color: "#09090b", fontWeight: 700 }}>{activeAulaTitle || "Selecione uma aula"}</h2>
                <p className="text-[12px] text-zinc-400">Módulo {activeModule + 1} · {currentModulo?.titulo}</p>
              </div>
              <Button color="primary" size="sm" endContent={<SkipForward size={14} />} className="text-[12px]" style={{ fontWeight: 600 }}
                onPress={() => {
                  if (currentModulo?.aulas && activeLesson < currentModulo.aulas.length - 1) {
                    const next = currentModulo.aulas[activeLesson + 1];
                    setActiveLesson(activeLesson + 1); setActiveVideoUrl(next.video_url); setActiveAulaTitle(next.titulo);
                  } else if (course.modulos && activeModule < course.modulos.length - 1) {
                    const nextMod = course.modulos[activeModule + 1];
                    setActiveModule(activeModule + 1); setActiveLesson(0);
                    if (nextMod.aulas?.[0]) { setActiveVideoUrl(nextMod.aulas[0].video_url); setActiveAulaTitle(nextMod.aulas[0].titulo); }
                  }
                }}>Próxima</Button>
            </div>

            <div className="px-5 pt-5 pb-10">
              <div className="flex items-center gap-6 border-b border-zinc-100 mb-5">
                {[{ id: "overview", label: "Visão Geral" }, { id: "resources", label: `Materiais (${currentAula?.materiais?.length || 0})` }, { id: "qa", label: `Dúvidas (${comments.length})` }].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="pb-3 text-[13px] relative transition-colors" style={{ color: activeTab === tab.id ? "#006FEE" : "#71717a", fontWeight: activeTab === tab.id ? 700 : 500 }}>
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: "#006FEE" }} />}
                  </button>
                ))}
              </div>

              {activeTab === "overview" && (
                <div className="space-y-5 max-w-3xl">
                  <div><h3 className="text-[14px] mb-2" style={{ color: "#09090b", fontWeight: 700 }}>Sobre esta aula</h3><p className="text-[13px] text-zinc-600 leading-relaxed">{course.descricao}</p></div>
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-zinc-100">
                    <Avatar src={getImageUrl(course.professor?.foto_url)} className="w-10 h-10" />
                    <div><p className="text-[11px] text-zinc-400">Professor(a)</p><p className="text-[13px]" style={{ color: "#09090b", fontWeight: 600 }}>{course.professor?.nome} {course.professor?.sobrenome}</p></div>
                  </div>
                </div>
              )}
              {activeTab === "resources" && (
                <div className="space-y-3 max-w-3xl">
                  {role === "PROFESSOR" && course?.professor?.userId === perfil?.user?.id && (
                    <div className="flex justify-end">
                      <Button
                        color="primary" size="sm"
                        startContent={<Plus size={14} />}
                        className="text-[12px]"
                        style={{ fontWeight: 600 }}
                        onPress={() => document.getElementById("file-upload-input")?.click()}
                      >
                        Adicionar Arquivo
                      </Button>
                      <input id="file-upload-input" type="file" className="hidden" />
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {currentAula?.materiais?.map((m: any, i: number) => (
                      <a key={m.id || i} href={m.url} download target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3.5 rounded-xl border border-zinc-100 hover:border-zinc-200 cursor-pointer transition-all">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#eff6ff" }}><FileText size={16} style={{ color: "#006FEE" }} /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] line-clamp-1" style={{ color: "#09090b", fontWeight: 600 }}>{m.nome}</p>
                          <p className="text-[10px] text-zinc-400">PDF Document</p>
                        </div>
                      </a>
                    ))}
                    {!currentAula?.materiais?.length && <p className="text-[12px] text-zinc-400 p-4">Nenhum material disponível.</p>}
                  </div>
                </div>
              )}
              {activeTab === "qa" && (
                <div className="max-w-3xl space-y-5">
                  {!composing ? (
                    <button onClick={() => setComposing(true)} className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left hover:bg-zinc-50 transition-colors" style={{ border: "1px solid #e4e4e7" }}>
                      <Avatar src={userAvatar} className="w-8 h-8" size="sm" />
                      <div className="flex-1 flex items-center gap-2"><MessageSquare size={14} className="text-zinc-400" /><span className="text-[12px] text-zinc-400">Faça uma pergunta ou comente sobre esta aula...</span></div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: "#006FEE", color: "white" }}><MessageSquare size={11} /><span className="text-[11px]" style={{ fontWeight: 600 }}>Comentar</span></div>
                    </button>
                  ) : (
                    <Composer avatar={userAvatar} placeholder="Faça uma pergunta ou compartilhe sua dúvida..." onSubmit={addComment} onCancel={() => setComposing(false)} />
                  )}
                  {comments.length === 0 ? (
                    <div className="text-center py-10 rounded-xl" style={{ background: "#fafafa" }}>
                      <MessageSquare size={28} className="text-zinc-300 mx-auto mb-2" />
                      <p className="text-[12px]" style={{ color: "#71717a", fontWeight: 600 }}>Nenhum comentário ainda</p>
                      <p className="text-[11px] mt-1" style={{ color: "#a1a1aa" }}>Seja o primeiro a comentar nesta aula.</p>
                    </div>
                  ) : (
                    comments.map(c => (
                      <div key={c.id} className="rounded-xl p-4" style={{ border: "1px solid #f4f4f5" }}>
                        <CommentNode c={c} depth={0} replyingTo={replyingTo} onReplyToggle={toggleReplyTo} onSubmitReply={addReply} onLike={toggleLike} userAvatar={userAvatar} />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-[320px] xl:w-[360px] flex flex-col shrink-0" style={{ borderLeft: "1px solid #f4f4f5" }}>
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f4f4f5" }}>
              <h3 className="text-[13px]" style={{ color: "#09090b", fontWeight: 700 }}>Conteúdo</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {course.modulos?.map((mod: any, modIdx: number) => {
                const isModActive = activeModule === modIdx;
                return (
                  <div key={mod.id} className="rounded-xl border border-zinc-100 overflow-hidden">
                    <button onClick={() => setActiveModule(isModActive ? -1 : modIdx)} className={`w-full flex items-center justify-between p-3.5 text-left transition-colors ${isModActive ? "bg-zinc-50" : "hover:bg-zinc-50"}`}>
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="text-[9px] uppercase tracking-wider text-zinc-400 mb-0.5" style={{ fontWeight: 700 }}>Módulo {modIdx + 1}</p>
                        <h4 className={`text-[12px] line-clamp-1 ${isModActive ? "text-primary" : "text-zinc-800"}`} style={{ fontWeight: 600 }}>{mod.titulo}</h4>
                      </div>
                      <span className="text-[10px] text-zinc-400 shrink-0">{mod.aulas?.length || 0} aulas</span>
                    </button>
                    {isModActive && (
                      <div className="pb-1">
                        {mod.aulas?.map((aula: any, lessIdx: number) => {
                          const isCurrent = activeLesson === lessIdx && activeModule === modIdx;
                          const isCompleted = aula.progressos?.some((p: any) => p.concluida && p.alunoId === perfil?.user?.id);
                          return (
                            <button key={aula.id} onClick={() => { setActiveModule(modIdx); setActiveLesson(lessIdx); setActiveVideoUrl(aula.video_url); setActiveAulaTitle(aula.titulo); }}
                              className={`w-full flex items-start gap-2.5 py-2 px-3.5 text-left hover:bg-zinc-50 transition-colors ${isCurrent ? "bg-primary/5" : ""}`}>
                              <div className="shrink-0 mt-0.5">
                                {isCompleted ? <CheckCircle size={14} className="text-green-500" /> : isCurrent ? <div className="w-3.5 h-3.5 rounded-full border-[3px] border-primary" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-300" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[12px] line-clamp-1 ${isCurrent ? "text-primary font-semibold" : "text-zinc-600"}`}>{lessIdx + 1}. {aula.titulo}</p>
                                <div className="flex items-center gap-1.5 mt-0.5"><PlayCircle size={9} className="text-zinc-400" /><span className="text-[9px] text-zinc-400">{aula.duracao_minutos || 12}:00</span></div>
                              </div>
                            </button>
                          );
                        })}
                        {!mod.aulas?.length && <p className="text-[11px] text-zinc-400 p-3 text-center">Nenhuma aula neste módulo</p>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};