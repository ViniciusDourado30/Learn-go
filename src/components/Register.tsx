import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2, Globe2, User, ShieldCheck,
  GraduationCap, Upload, BookOpen, ArrowLeft, ArrowRight, Check, Sparkles, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button, Input, Divider, Progress } from "../components/ui/nextui-shim";
import { useRegisterMutation } from "../hooks/useAuth";

const STEP_META = (profile: "ALUNO" | "PROFESSOR") => [
  { eyebrow: "Passo 1", title: "Vamos começar", subtitle: "Conte-nos sobre você.", icon: <User size={16} /> },
  { eyebrow: "Passo 2", title: "Localização", subtitle: "De onde você é?", icon: <Globe2 size={16} /> },
  { eyebrow: "Passo 3", title: "Credenciais", subtitle: "Proteja sua conta.", icon: <ShieldCheck size={16} /> },
  ...(profile === "PROFESSOR"
    ? [{ eyebrow: "Passo 4", title: "Formação", subtitle: "Valide sua qualificação.", icon: <GraduationCap size={16} /> }]
    : []),
];

export const Register = () => {
  const [profile, setProfile] = useState<"ALUNO" | "PROFESSOR">("ALUNO");
  const [step, setStep] = useState(1);
  
  // Estado unificado do formulário
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    idade: "",
    pais: "Brasil",
    estado: "",
    cidade: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
    formacao: "",
    linkedin: ""
  });

  const steps = STEP_META(profile);
  const totalSteps = steps.length;
  const currentStep = steps[step - 1];

  const { mutate: registerUser, isPending, error } = useRegisterMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  
  const handleComplete = () => {
    // Formata os dados e envia para a mutation
    registerUser({
      ...formData,
      role: profile,
      idade: Number(formData.idade)
    });
  };

  const inputClasses = {
    label: "text-zinc-500",
    input: "text-zinc-800",
    inputWrapper: "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 data-[focused=true]:border-primary shadow-none",
  };

  const errorMessage = error ? (error as any).response?.data?.message || "Erro ao registrar. Verifique os dados." : "";

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {(["ALUNO", "PROFESSOR"] as const).map((type) => (
                <button key={type} type="button" onClick={() => { setProfile(type); setStep(1); }}
                  className="relative flex flex-col items-center gap-2.5 p-5 rounded-2xl transition-all outline-none"
                  style={{ border: profile === type ? "2px solid #006FEE" : "1.5px solid #e4e4e7", background: profile === type ? "#eff6ff" : "white" }}>
                  {type === "ALUNO" ? <BookOpen size={22} style={{ color: profile === type ? "#006FEE" : "#a1a1aa" }} />
                    : <GraduationCap size={22} style={{ color: profile === type ? "#006FEE" : "#a1a1aa" }} />}
                  <span className="text-[12px]" style={{ color: profile === type ? "#006FEE" : "#71717a", fontWeight: 600 }}>
                    {type === "ALUNO" ? "Quero Aprender" : "Quero Ensinar"}
                  </span>
                  {profile === type && (
                    <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Check size={9} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nome" value={formData.nome} onValueChange={(v) => handleInputChange("nome", v)} placeholder="João" variant="bordered" classNames={inputClasses} />
              <Input label="Sobrenome" value={formData.sobrenome} onValueChange={(v) => handleInputChange("sobrenome", v)} placeholder="Silva" variant="bordered" classNames={inputClasses} />
            </div>
            <Input label="Idade" type="number" value={formData.idade} onValueChange={(v) => handleInputChange("idade", v)} placeholder="25" variant="bordered" classNames={inputClasses} />
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
            <div>
              <label className="block text-[12px] mb-1.5" style={{ color: "#3f3f46", fontWeight: 500 }}>País</label>
              <select 
                value={formData.pais}
                onChange={(e) => handleInputChange("pais", e.target.value)}
                className="w-full h-10 px-3 rounded-xl text-[13px] outline-none appearance-none"
                style={{ border: "1px solid #e4e4e7", color: "#09090b", background: "#fafafa" }}>
                {["Brasil", "Portugal", "Estados Unidos", "Espanha", "França"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Estado" value={formData.estado} onValueChange={(v) => handleInputChange("estado", v)} placeholder="São Paulo" variant="bordered" classNames={inputClasses} />
              <Input label="Cidade" value={formData.cidade} onValueChange={(v) => handleInputChange("cidade", v)} placeholder="São Paulo" variant="bordered" classNames={inputClasses} />
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
            <Input label="Email" type="email" value={formData.email} onValueChange={(v) => handleInputChange("email", v)} placeholder="seu@email.com" variant="bordered" classNames={inputClasses} />
            <Input label="Telefone" type="tel" value={formData.telefone} onValueChange={(v) => handleInputChange("telefone", v)} placeholder="+55 11 99999-9999" variant="bordered" classNames={inputClasses} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Senha" type="password" value={formData.password} onValueChange={(v) => handleInputChange("password", v)} placeholder="••••••••" variant="bordered" classNames={inputClasses} />
              <Input label="Confirmar" type="password" value={formData.confirmPassword} onValueChange={(v) => handleInputChange("confirmPassword", v)} placeholder="••••••••" variant="bordered" classNames={inputClasses} />
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div key="s4p" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
            <Input label="Formação" value={formData.formacao} onValueChange={(v) => handleInputChange("formacao", v)} placeholder="Ex: Bacharel em Ciência da Computação" variant="bordered" classNames={inputClasses} />
            <Input label="LinkedIn (opcional)" type="url" value={formData.linkedin} onValueChange={(v) => handleInputChange("linkedin", v)} placeholder="https://linkedin.com/in/..." variant="bordered" classNames={inputClasses} />
            <div className="p-6 rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all">
              <Upload size={20} className="text-zinc-300" />
              <p className="text-[12px] text-center" style={{ color: "#71717a", fontWeight: 500 }}>
                Comprovante de qualificação<br /><span className="text-[11px] text-zinc-400">PDF, JPG ou PNG · máx. 5MB</span>
              </p>
            </div>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left */}
      <div className="hidden lg:flex lg:w-[45%] flex-col relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 40%, #0a1628 100%)" }}>
        <AnimatePresence mode="popLayout">
          <motion.div key={step} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }} className="absolute inset-0"
            style={{
              backgroundImage: `url(${[
                "https://images.unsplash.com/photo-1771408427146-09be9a1d4535?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
                "https://images.unsplash.com/photo-1773702962436-20fb43cf2626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
                "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
                "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
              ][Math.min(step - 1, 3)]})`,
              backgroundSize: "cover", backgroundPosition: "center",
            }}
          />
        </AnimatePresence>

        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,12,20,0.88) 0%, rgba(10,12,20,0.65) 40%, rgba(10,12,20,0.92) 100%)" }} />

        <div className="absolute top-[15%] left-[10%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,111,238,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />

        <div className="relative z-10 flex flex-col h-full p-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#006FEE" }}>
              <GraduationCap size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[16px] text-white" style={{ fontWeight: 700 }}>
              Learn<span style={{ color: "#60a5fa" }}>&</span>Go
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles size={12} style={{ color: "#60a5fa" }} />
                  <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(96,165,250,0.7)", fontWeight: 600 }}>
                    {currentStep.eyebrow} de {totalSteps}
                  </span>
                </div>
                <h2 className="text-[32px] mb-3" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                  {currentStep.title}
                </h2>
                <p className="text-[14px] max-w-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{currentStep.subtitle}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="h-1 rounded-full transition-all duration-300"
                style={{ width: i + 1 === step ? "28px" : "8px",
                  background: i + 1 < step ? "#60a5fa" : i + 1 === step ? "#3b82f6" : "rgba(255,255,255,0.12)" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-10">
        <div className="flex lg:hidden items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#006FEE" }}>
            <GraduationCap size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[17px]" style={{ color: "#09090b", fontWeight: 700 }}>
            Learn<span style={{ color: "#006FEE" }}>&</span>Go
          </span>
        </div>

        <div className="w-full max-w-[400px] mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "#eff6ff", color: "#006FEE" }}>
                {currentStep.icon}
              </div>
              <span className="text-[10px] uppercase tracking-widest" style={{ color: "#a1a1aa", fontWeight: 700 }}>
                {currentStep.eyebrow} de {totalSteps}
              </span>
            </div>
            <h1 className="text-[22px] mb-1" style={{ color: "#09090b", fontWeight: 700, letterSpacing: "-0.02em" }}>
              {step === totalSteps ? "Quase lá!" : "Criar conta"}
            </h1>
            <p className="text-[13px]" style={{ color: "#71717a" }}>
              {step === totalSteps ? "Finalize as informações para registrar." : "Preencha para continuar."}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-4"
                style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
              >
                <AlertCircle size={14} style={{ color: "#ef4444" }} />
                <p className="text-[13px]" style={{ color: "#dc2626", fontWeight: 500 }}>{errorMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <Progress value={(step / totalSteps) * 100} color="primary" size="sm" className="mb-6" />

          <div className="min-h-[260px]">
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          </div>

          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <Button variant="bordered" onPress={prevStep} startContent={<ArrowLeft size={14} />}
                className="border-zinc-200 text-zinc-600 text-[13px]">Voltar</Button>
            )}
            {step < totalSteps ? (
              <Button color="primary" onPress={nextStep} endContent={<ArrowRight size={14} />}
                className="flex-1 h-11 text-[13px]" style={{ fontWeight: 600 }}>Continuar</Button>
            ) : (
              <Button color="success" onPress={handleComplete} isLoading={isPending} endContent={!isPending && <CheckCircle2 size={14} />}
                className="flex-1 h-11 text-[13px] text-white" style={{ fontWeight: 600 }}>
                  {isPending ? "Registrando..." : "Finalizar Registro"}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4 my-6">
            <Divider className="flex-1" />
            <span className="text-[10px] uppercase tracking-widest" style={{ color: "#a1a1aa", fontWeight: 600 }}>ou</span>
            <Divider className="flex-1" />
          </div>

          <p className="text-center text-[13px]" style={{ color: "#71717a" }}>
            Já tem conta?{" "}
            <Link to="/" className="hover:opacity-80 transition-opacity" style={{ color: "#006FEE", fontWeight: 600 }}>Fazer login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};