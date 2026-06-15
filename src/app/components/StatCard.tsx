import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "motion/react";

export interface StatCardProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  hint?: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  color?: string;
  spark?: number[];
  variant?: "light" | "dark";
  className?: string;
  index?: number;
}

const hexToRgba = (hex: string, alpha: number) => {
  const m = hex.replace("#", "");
  const r = parseInt(m.substring(0, 2), 16);
  const g = parseInt(m.substring(2, 4), 16);
  const b = parseInt(m.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const Sparkline: React.FC<{ data: number[]; color: string; dark?: boolean }> = ({ data, color, dark }) => {
  if (!data || data.length < 2) return null;
  const w = 64;
  const h = 22;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = w / (data.length - 1);
  const points = data.map((v, i) => `${i * stepX},${h - ((v - min) / range) * h}`).join(" ");
  const last = data[data.length - 1];
  const lastX = (data.length - 1) * stepX;
  const lastY = h - ((last - min) / range) * h;
  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}-${dark ? "d" : "l"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={dark ? 0.5 : 0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline
        fill={`url(#grad-${color.replace("#", "")}-${dark ? "d" : "l"})`}
        stroke="none"
        points={`0,${h} ${points} ${w},${h}`}
      />
      <polyline fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" points={points} />
      <circle cx={lastX} cy={lastY} r={2.2} fill={color} />
      <circle cx={lastX} cy={lastY} r={4} fill={color} fillOpacity={0.2} />
    </svg>
  );
};

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon, value, label, hint, delta, trend = "up", color = "#006FEE", spark, variant = "light", className = "", index = 0,
}) => {
  const dark = variant === "dark";
  const trendColor = trend === "up" ? "#16a34a" : trend === "down" ? "#dc2626" : (dark ? "rgba(255,255,255,0.4)" : "#71717a");
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.4 }}
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden rounded-2xl p-4 md:p-5 group ${className}`}
      style={{
        background: dark
          ? "rgba(255,255,255,0.04)"
          : `linear-gradient(135deg, #ffffff 0%, ${hexToRgba(color, 0.04)} 100%)`,
        border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #f4f4f5",
        boxShadow: dark ? "none" : "0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      {/* Decorative gradient orb */}
      <div
        className="absolute pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60"
        style={{
          top: -40, right: -40, width: 140, height: 140, borderRadius: "50%",
          background: `radial-gradient(circle, ${hexToRgba(color, dark ? 0.18 : 0.1)} 0%, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
        style={{ background: `linear-gradient(180deg, ${color}, ${hexToRgba(color, 0.2)})` }}
      />

      <div className="relative flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: dark ? hexToRgba(color, 0.16) : hexToRgba(color, 0.1),
              border: dark ? `1px solid ${hexToRgba(color, 0.2)}` : "none",
            }}
          >
            <Icon size={15} style={{ color }} />
          </div>
          <p
            className="text-[10px] uppercase tracking-[0.12em] truncate"
            style={{ color: dark ? "rgba(255,255,255,0.4)" : "#a1a1aa", fontWeight: 700 }}
          >
            {label}
          </p>
        </div>
        {delta && (
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md shrink-0"
            style={{ background: hexToRgba(trendColor, dark ? 0.18 : 0.1), color: trendColor }}
          >
            <TrendIcon size={10} strokeWidth={2.5} />
            <span className="text-[10px]" style={{ fontWeight: 700 }}>{delta}</span>
          </div>
        )}
      </div>

      <div className="relative flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p
            className="leading-none tracking-tight"
            style={{
              color: dark ? "white" : "#09090b",
              fontWeight: 800,
              fontSize: "clamp(22px, 3vw, 30px)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}
          </p>
          {hint && (
            <p
              className="text-[10.5px] mt-1.5 truncate"
              style={{ color: dark ? "rgba(255,255,255,0.45)" : "#71717a", fontWeight: 500 }}
            >
              {hint}
            </p>
          )}
        </div>
        {spark && spark.length > 1 && (
          <div className="shrink-0 opacity-90">
            <Sparkline data={spark} color={color} dark={dark} />
          </div>
        )}
      </div>
    </motion.div>
  );
};
