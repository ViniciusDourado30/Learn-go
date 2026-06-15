import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { motion } from "motion/react";

function getFacePoint(cx: number, cy: number, fw: number, fh: number) {
  const r = Math.random();
  // Alta densidade nos olhos
  if (r < 0.12) {
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * fw * 0.08;
      return { x: cx - fw * 0.2 + Math.cos(a) * d, y: cy - fh * 0.1 + Math.sin(a) * d * 0.6, s: 1.5 };
  } else if (r < 0.24) {
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * fw * 0.08;
      return { x: cx + fw * 0.2 + Math.cos(a) * d, y: cy - fh * 0.1 + Math.sin(a) * d * 0.6, s: 1.5 };
  } 
  // Nariz
  else if (r < 0.4) {
      const dy = Math.random() * fh * 0.3;
      const dx = (Math.random() - 0.5) * dy * 0.4;
      return { x: cx + dx, y: cy - fh * 0.05 + dy, s: 1.2 };
  } 
  // Boca
  else if (r < 0.55) {
      const a = Math.random() * Math.PI;
      const w = fw * 0.18;
      const h = fh * 0.06;
      return { x: cx + Math.cos(a) * w, y: cy + fh * 0.28 + Math.sin(a) * h, s: 1.2 };
  } 
  // Contorno / Mandíbula
  else if (r < 0.8) {
      const a = Math.random() * Math.PI * 2;
      const w = fw * 0.45;
      const h = fh * 0.55;
      const y = Math.sin(a) * h;
      const taper = y > 0 ? 0.75 + 0.25 * (1 - y/h) : 1;
      return { x: cx + Math.cos(a) * w * taper, y: cy + y, s: 1.0 };
  } 
  // Pele / Superfície
  else {
      let x, y, d;
      do {
          x = (Math.random() - 0.5) * fw * 0.9;
          y = (Math.random() - 0.5) * fh * 1.0;
          const taper = y > 0 ? 0.75 + 0.25 * (1 - y/(fh*0.5)) : 1;
          d = (x*x) / ((fw * 0.45 * taper) ** 2) + (y*y) / ((fh * 0.55) ** 2);
      } while (d > 1);
      return { x: cx + x, y: cy + y, s: 0.8 };
  }
}

class Particle {
  startX: number;
  startY: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  baseSize: number;
  locked: boolean;
  animProgress: number;
  speed: number;
  alpha: number;
  hueOffset: number;

  constructor(w: number, h: number) {
      this.startX = Math.random() * w;
      this.startY = Math.random() * h;
      this.x = this.startX;
      this.y = this.startY;

      const cx = w / 2;
      const cy = h / 2 - 20;
      const fw = Math.min(w * 0.6, 400);
      const fh = Math.min(h * 0.6, 500);

      const target = getFacePoint(cx, cy, fw, fh);
      this.targetX = target.x;
      this.targetY = target.y;
      this.baseSize = target.s * (Math.random() * 1.5 + 0.5);

      this.locked = false;
      this.animProgress = 0;
      this.speed = 0.015 + Math.random() * 0.03;
      this.alpha = 0.1 + Math.random() * 0.2;
      this.hueOffset = Math.random() * 20 - 10; // Slight color variation
  }

  update(scanY: number) {
      // Trava na posição quando a linha de escaneamento passa
      if (!this.locked && scanY > this.targetY) {
          this.locked = true;
          this.alpha = 0.5 + Math.random() * 0.5; // Fica mais brilhante
      }

      if (this.locked && this.animProgress < 1) {
          // Animação da posição original aleatória para o ponto do rosto
          this.animProgress += this.speed;
          if (this.animProgress > 1) this.animProgress = 1;

          // Easing easeOutCubic
          const ease = 1 - Math.pow(1 - this.animProgress, 3);
          this.x = this.startX + (this.targetX - this.startX) * ease;
          this.y = this.startY + (this.targetY - this.startY) * ease;
      } else if (this.locked && this.animProgress === 1) {
          // Flutuação leve e contínua após travar
          const t = Date.now() * 0.001;
          this.x = this.targetX + Math.sin(t + this.targetY * 0.01) * 1.5;
          this.y = this.targetY + Math.cos(t + this.targetX * 0.01) * 1.5;
      } else {
          // Movimento aleatório antes de ser mapeado
          this.x += Math.sin(Date.now() * 0.001 + this.startX) * 0.5;
          this.y += Math.cos(Date.now() * 0.001 + this.startY) * 0.5;
      }
  }

  draw(ctx: CanvasRenderingContext2D, isDark: boolean) {
      const alphaVal = this.locked && this.animProgress < 1 ? this.alpha * 1.5 : this.alpha; // Brilho extra durante animação
      
      // Cores baseadas no tema: azuis mais claros para escuro, mais escuros para claro
      ctx.fillStyle = isDark
          ? `hsla(${215 + this.hueOffset}, 89%, 70%, ${alphaVal})` 
          : `hsla(${221 + this.hueOffset}, 83%, 53%, ${alphaVal})`;
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.baseSize, 0, Math.PI * 2);
      ctx.fill();
  }
}

export const FaceMatrix = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  const [uiProgress, setUiProgress] = useState(0);
  const progressRef = useRef(0);

  // Simulação de progresso fluida
  useEffect(() => {
      const interval = setInterval(() => {
          let next = progressRef.current + (Math.random() * 3 + 0.5);
          if (next >= 100) {
              next = 100;
              clearInterval(interval);
          }
          progressRef.current = next;
          setUiProgress(Math.floor(next));
      }, 100);
      return () => clearInterval(interval);
  }, []);

  // Lógica do Canvas
  useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let animationFrame: number;
      const particles: Particle[] = [];
      const particleCount = 1500;

      const resize = () => {
          canvas.width = canvas.parentElement?.clientWidth || window.innerWidth / 2;
          canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      };
      resize();
      window.addEventListener("resize", resize);

      for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle(canvas.width, canvas.height));
      }

      const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // O laser de scan acompanha o progresso de 0 a 100%
          const scanY = (progressRef.current / 100) * canvas.height;

          // Desenhar linha de scan
          if (progressRef.current < 100) {
              const isDark = theme === "dark" || !theme;
              
              const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY);
              grad.addColorStop(0, "rgba(59, 130, 246, 0)"); // blue-500 trasparent
              grad.addColorStop(1, isDark ? "rgba(96, 165, 250, 0.4)" : "rgba(37, 99, 235, 0.4)");
              
              ctx.fillStyle = grad;
              ctx.fillRect(0, scanY - 30, canvas.width, 30);
              
              ctx.fillStyle = isDark ? "rgba(147, 197, 253, 0.8)" : "rgba(37, 99, 235, 0.8)";
              ctx.fillRect(0, scanY, canvas.width, 2);
          }

          for (let i = 0; i < particles.length; i++) {
              particles[i].update(scanY);
              particles[i].draw(ctx, theme === "dark" || !theme);
          }

          animationFrame = requestAnimationFrame(animate);
      };

      animate();

      return () => {
          window.removeEventListener("resize", resize);
          cancelAnimationFrame(animationFrame);
      };
  }, [theme]);

  return (
    <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden flex flex-col items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(2, 6, 23, 0.9) 100%)' }} />

        {/* UI Overlay */}
        <div className="absolute top-12 w-full z-10 px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl max-w-sm mx-auto shadow-2xl shadow-blue-900/20"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <h2 className="text-sm font-semibold text-white uppercase tracking-widest">Matriz Biométrica</h2>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">Processando Embeddings</h3>
                <p className="text-slate-400 text-xs mb-6">Mapeando geometria facial e gerando vetores criptografados...</p>
                
                <div className="flex justify-between text-blue-400 text-sm font-mono mb-2">
                    <span>{uiProgress < 100 ? 'Analisando feições...' : 'Modelo gerado com sucesso'}</span>
                    <span>{uiProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${uiProgress}%` }}
                        transition={{ ease: "linear", duration: 0.2 }}
                    />
                </div>
            </motion.div>
        </div>
    </div>
  );
};