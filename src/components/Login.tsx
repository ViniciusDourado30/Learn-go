import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, GraduationCap, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { Button, Input, Checkbox, Divider } from "../components/ui/nextui-shim";
import { useLoginMutation } from "../hooks/useAuth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  // Hook do TanStack Query
  const { mutate: login, isPending, error } = useLoginMutation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  // Extrai mensagem de erro da API, se houver
  const errorMessage = error ? (error as any).response?.data?.message || "Erro ao fazer login. Verifique suas credenciais." : "";

  return (
    <div className="min-h-screen w-full flex">
      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 40%, #0a1628 100%)" }}>
        
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,111,238,0.15) 0%, transparent 70%)", filter: "blur(40px)" }}
          />
          <motion.div
            animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", filter: "blur(50px)" }}
          />
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[50%] left-[40%] w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", filter: "blur(60px)" }}
          />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-lg px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-16"
          >
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #006FEE, #338ef7)", boxShadow: "0 8px 32px rgba(0,111,238,0.4)" }}>
              <GraduationCap size={22} className="text-white" strokeWidth={2} />
            </div>
            <span className="text-[22px] text-white" style={{ fontWeight: 700, letterSpacing: "-0.03em" }}>
              Learn<span style={{ color: "#60a5fa" }}>&</span>Go
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={14} style={{ color: "#60a5fa" }} />
              <span className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(96,165,250,0.7)", fontWeight: 600 }}>
                Plataforma de Educação
              </span>
            </div>
            <h1 className="text-[44px] leading-[1.1] mb-6" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Aprenda sem
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #a78bfa, #60a5fa)" }}>
                limites.
              </span>
            </h1>
            <p className="text-[16px] leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.4)" }}>
              Conecte-se com os melhores professores, explore cursos de alta qualidade e transforme sua jornada de aprendizado.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-10 mt-16"
          >
            {[
              { value: "15k+", label: "Alunos" },
              { value: "300+", label: "Cursos" },
              { value: "4.9", label: "Avaliação" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[28px]" style={{ color: "white", fontWeight: 800, letterSpacing: "-0.02em" }}>{s.value}</p>
                <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-[400px]"
        >
          <div className="flex lg:hidden items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#006FEE" }}>
              <GraduationCap size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[18px]" style={{ color: "#09090b", fontWeight: 700, letterSpacing: "-0.02em" }}>
              Learn<span style={{ color: "#006FEE" }}>&</span>Go
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-[28px] mb-2" style={{ color: "#09090b", fontWeight: 700, letterSpacing: "-0.02em" }}>
              Bem-vindo de volta
            </h2>
            <p className="text-[14px]" style={{ color: "#71717a" }}>
              Entre com suas credenciais para continuar.
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-6"
                style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
              >
                <AlertCircle size={14} style={{ color: "#ef4444" }} />
                <p className="text-[13px]" style={{ color: "#dc2626", fontWeight: 500 }}>{errorMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onValueChange={setEmail}
              placeholder="seu@email.com"
              variant="bordered"
              size="lg"
              autoComplete="email"
              classNames={{
                label: "text-zinc-500",
                input: "text-zinc-800",
                inputWrapper: "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 data-[focused=true]:border-primary shadow-none h-12",
              }}
            />

            <Input
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={password}
              onValueChange={setPassword}
              placeholder="••••••••"
              variant="bordered"
              size="lg"
              autoComplete="current-password"
              endContent={
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              classNames={{
                label: "text-zinc-500",
                input: "text-zinc-800",
                inputWrapper: "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 data-[focused=true]:border-primary shadow-none h-12",
              }}
            />

            <div className="flex items-center justify-between">
              <Checkbox
                size="sm"
                isSelected={remember}
                onValueChange={setRemember}
                classNames={{ label: "text-zinc-500 text-[13px]" }}
              >
                Lembrar-me
              </Checkbox>
              <a href="#" className="text-[13px] transition-colors hover:text-primary/80"
                style={{ color: "#006FEE", fontWeight: 500 }}>
                Esqueceu a senha?
              </a>
            </div>

            <Button
              type="submit"
              color="primary"
              isLoading={isPending}
              className="w-full h-12 text-[14px]"
              style={{ fontWeight: 600, borderRadius: "12px" }}
              endContent={!isPending && <ArrowRight size={16} />}
            >
              {isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <Divider className="flex-1" />
            <span className="text-[11px] uppercase tracking-widest" style={{ color: "#a1a1aa", fontWeight: 600 }}>ou</span>
            <Divider className="flex-1" />
          </div>

          <p className="text-center text-[13px] mt-8" style={{ color: "#71717a" }}>
            Novo na Learn&Go?{" "}
            <Link to="/register" className="hover:opacity-80 transition-opacity"
              style={{ color: "#006FEE", fontWeight: 600 }}>
              Criar conta
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};