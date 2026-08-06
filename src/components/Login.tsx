import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, GraduationCap, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { Button, Input, Checkbox, Divider } from "../components/ui/nextui-shim";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800));
    if (email === "professor@gmail.com" && password === "123") {
      localStorage.setItem("userRole", "professor");
      window.dispatchEvent(new Event("roleChange"));
      navigate("/dashboard");
    } else if (email === "aluno@gmail.com" && password === "123") {
      localStorage.setItem("userRole", "aluno");
      window.dispatchEvent(new Event("roleChange"));
      navigate("/dashboard");
    } else {
      setError("Credenciais inválidas. Verifique os dados de acesso.");
    }
    setIsLoading(false);
  };

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
          {/* Logo */}
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
          {/* Mobile logo */}
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
                <p className="text-[13px]" style={{ color: "#dc2626", fontWeight: 500 }}>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onValueChange={(v) => { setEmail(v); setError(""); }}
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
              onValueChange={(v) => { setPassword(v); setError(""); }}
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
              isLoading={isLoading}
              className="w-full h-12 text-[14px]"
              style={{ fontWeight: 600, borderRadius: "12px" }}
              endContent={!isLoading && <ArrowRight size={16} />}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <Divider className="flex-1" />
            <span className="text-[11px] uppercase tracking-widest" style={{ color: "#a1a1aa", fontWeight: 600 }}>ou</span>
            <Divider className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Google",
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                ),
              },
              {
                label: "Apple",
                icon: (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.09 2.31-.86 3.65-.74 1.74.15 3.09.84 3.95 2.12-3.32 1.95-2.77 6.42.45 7.78-.7 1.67-1.63 3.4-3.13 4.88zm-2.18-14.28c.45-1.62-.26-3.14-1.5-4.14-1.09-1-2.5-1.29-3.41-.05-.98 1.34-.69 2.94-.03 4.09 1.1 1.18 2.5 1.45 3.65.25.68-.66 1.11-1.39 1.29-2.15z" />
                  </svg>
                ),
              },
            ].map((btn) => (
              <Button
                key={btn.label}
                variant="bordered"
                className="h-11 border-zinc-200 text-zinc-600"
                style={{ borderRadius: "12px" }}
                startContent={btn.icon}
              >
                {btn.label}
              </Button>
            ))}
          </div>

          <p className="text-center text-[13px] mt-8" style={{ color: "#71717a" }}>
            Novo na Learn&Go?{" "}
            <Link to="/register" className="hover:opacity-80 transition-opacity"
              style={{ color: "#006FEE", fontWeight: 600 }}>
              Criar conta
            </Link>
          </p>

          {/* Demo hint */}
          <div className="mt-6 px-4 py-3 rounded-xl text-center"
            style={{ background: "#fafafa", border: "1px solid #f0f0f0" }}>
            <p className="text-[11px]" style={{ color: "#a1a1aa" }}>
              <span style={{ fontWeight: 600, color: "#71717a" }}>Demo</span>{" · "}
              aluno@gmail.com ou professor@gmail.com · senha <span style={{ fontWeight: 700, color: "#71717a" }}>123</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};