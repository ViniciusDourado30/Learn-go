import React, { useState, useCallback, createContext, useContext } from "react";

// ── NextUIProvider ──
export const NextUIProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// ── Button ──
type ButtonColor = "primary" | "default" | "success" | "warning" | "danger" | "secondary";
type ButtonVariant = "solid" | "bordered" | "flat" | "light" | "ghost" | "faded";
type ButtonSize = "sm" | "md" | "lg";

const BTN_COLOR: Record<string, string> = {
  "primary-solid": "bg-[#006FEE] text-white hover:bg-[#005bc4]",
  "default-solid": "bg-zinc-100 text-zinc-800 hover:bg-zinc-200",
  "success-solid": "bg-emerald-500 text-white hover:bg-emerald-600",
  "warning-solid": "bg-amber-500 text-white hover:bg-amber-600",
  "danger-solid": "bg-red-500 text-white hover:bg-red-600",
  "secondary-solid": "bg-violet-500 text-white hover:bg-violet-600",
  "primary-bordered": "border border-[#006FEE] text-[#006FEE] hover:bg-[#006FEE]/5",
  "default-bordered": "border border-zinc-200 text-zinc-600 hover:bg-zinc-50",
  "primary-flat": "bg-[#006FEE]/10 text-[#006FEE] hover:bg-[#006FEE]/15",
  "default-flat": "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
  "success-flat": "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
  "warning-flat": "bg-amber-50 text-amber-600 hover:bg-amber-100",
  "danger-flat": "bg-red-50 text-red-600 hover:bg-red-100",
  "primary-light": "text-[#006FEE] hover:bg-[#006FEE]/10",
  "default-light": "text-zinc-500 hover:bg-zinc-100",
  "primary-ghost": "border border-[#006FEE] text-[#006FEE] hover:bg-[#006FEE] hover:text-white",
  "default-ghost": "border border-zinc-200 text-zinc-600 hover:bg-zinc-800 hover:text-white",
};

const BTN_SIZE: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[12px] gap-1.5",
  md: "h-10 px-4 text-[14px] gap-2",
  lg: "h-12 px-6 text-[15px] gap-2",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isIconOnly?: boolean;
  isDisabled?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  onPress?: () => void;
  fullWidth?: boolean;
  radius?: string;
  as?: any;
  to?: string;
  [key: string]: any;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  color = "default", variant = "solid", size = "md",
  isLoading, isIconOnly, isDisabled, startContent, endContent,
  onPress, children, className = "", fullWidth, style, onClick, as: Component, to, radius, ...rest
}, ref) => {
  const key = `${color}-${variant}`;
  const colorCls = BTN_COLOR[key] || BTN_COLOR["default-solid"];
  const sizeCls = isIconOnly ? `${size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10"} p-0 flex items-center justify-center` : BTN_SIZE[size];
  const cls = `inline-flex items-center justify-center rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed ${colorCls} ${sizeCls} ${fullWidth ? "w-full" : ""} ${className}`;

  if (Component) {
    return (
      <Component ref={ref} to={to} className={cls} style={style} onClick={(e: any) => { onClick?.(e); onPress?.(e); }} {...rest}>
        {isLoading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />}
        {!isLoading && startContent}
        {children}
        {!isLoading && endContent}
      </Component>
    );
  }

  return (
    <button
      ref={ref}
      disabled={isDisabled || isLoading}
      onClick={(e) => { onClick?.(e); onPress?.(e); }}
      className={cls}
      style={style}
      {...rest}
    >
      {isLoading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />}
      {!isLoading && startContent}
      {children}
      {!isLoading && endContent}
    </button>
  );
});

// ── Input ──
interface InputProps {
  label?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  variant?: "bordered" | "flat" | "underlined" | "faded";
  size?: "sm" | "md" | "lg";
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  classNames?: Record<string, string>;
  className?: string;
  autoComplete?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  description?: string;
  errorMessage?: string;
  "aria-label"?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label, type = "text", value, defaultValue, onValueChange, onChange,
  placeholder, variant = "bordered", size = "md",
  startContent, endContent, classNames = {}, className = "",
  autoComplete, isRequired, isDisabled, description, errorMessage, ...rest
}, ref) => {
  const sizeH = size === "sm" ? "h-9" : size === "lg" ? "h-12" : "h-10";
  const wrapperBase = variant === "flat"
    ? "bg-zinc-100/60 hover:bg-zinc-100 border-transparent"
    : "border border-zinc-200 hover:border-zinc-300 bg-white focus-within:border-[#006FEE]";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className={`text-[13px] font-medium text-zinc-500 ${classNames.label || ""}`}>{label}{isRequired && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <div className={`flex items-center gap-2 rounded-xl px-3 transition-colors ${sizeH} ${wrapperBase} ${classNames.inputWrapper || ""}`}>
        {startContent}
        <input
          ref={ref}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => { onChange?.(e); onValueChange?.(e.target.value); }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={isDisabled}
          required={isRequired}
          aria-label={rest["aria-label"] || label || placeholder}
          className={`flex-1 bg-transparent outline-none text-zinc-800 placeholder:text-zinc-400 text-[13px] w-full disabled:opacity-50 ${classNames.input || ""}`}
        />
        {endContent}
      </div>
      {description && <p className="text-[11px] text-zinc-400">{description}</p>}
      {errorMessage && <p className="text-[11px] text-red-500">{errorMessage}</p>}
    </div>
  );
});

// ── Checkbox ──
interface CheckboxProps {
  size?: "sm" | "md" | "lg";
  isSelected?: boolean;
  onValueChange?: (v: boolean) => void;
  classNames?: Record<string, string>;
  children?: React.ReactNode;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ isSelected, onValueChange, children, classNames = {}, className = "" }) => (
  <label className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}`}>
    <input
      type="checkbox"
      checked={isSelected}
      onChange={(e) => onValueChange?.(e.target.checked)}
      className="w-4 h-4 rounded border-zinc-300 text-[#006FEE] focus:ring-[#006FEE] accent-[#006FEE]"
      aria-label={typeof children === "string" ? children : "checkbox"}
    />
    {children && <span className={`text-[13px] ${classNames.label || ""}`}>{children}</span>}
  </label>
);

// ── Divider ──
export const Divider: React.FC<{ className?: string; orientation?: string }> = ({ className = "" }) => (
  <div className={`h-px bg-zinc-200 ${className}`} />
);

// ── Progress ──
interface ProgressProps {
  value?: number;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
  showValueLabel?: boolean;
  "aria-label"?: string;
}

const PROGRESS_COLORS: Record<string, string> = {
  primary: "bg-[#006FEE]",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  default: "bg-zinc-400",
};

export const Progress: React.FC<ProgressProps> = ({ value = 0, color = "primary", size = "sm", className = "", label, showValueLabel, ...rest }) => {
  const h = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";
  return (
    <div className={className} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={rest["aria-label"] || label || "Progress"}>
      {(label || showValueLabel) && (
        <div className="flex justify-between mb-1 text-[11px] text-zinc-500">
          {label && <span>{label}</span>}
          {showValueLabel && <span>{value}%</span>}
        </div>
      )}
      <div className={`w-full ${h} bg-zinc-100 rounded-full overflow-hidden`}>
        <div className={`${h} rounded-full transition-all duration-500 ${PROGRESS_COLORS[color] || PROGRESS_COLORS.primary}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
};

// ── Avatar ──
interface AvatarProps {
  src?: string;
  name?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  isBordered?: boolean;
  color?: string;
  alt?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, className = "", isBordered, color, alt }) => {
  const borderCls = isBordered ? (color === "primary" ? "ring-2 ring-[#006FEE] ring-offset-1" : "ring-2 ring-zinc-200 ring-offset-1") : "";
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "";
  return (
    <div className={`rounded-full overflow-hidden shrink-0 bg-zinc-200 flex items-center justify-center ${borderCls} ${className}`}>
      {src ? (
        <img src={src} alt={alt || name || "avatar"} className="w-full h-full object-cover" />
      ) : (
        <span className="text-zinc-500 text-[11px] font-semibold">{initials}</span>
      )}
    </div>
  );
};

// ── Badge ──
interface BadgeProps {
  content?: React.ReactNode;
  color?: string;
  size?: "sm" | "md";
  shape?: string;
  children?: React.ReactNode;
  className?: string;
}

const BADGE_COLORS: Record<string, string> = {
  primary: "bg-[#006FEE] text-white",
  danger: "bg-red-500 text-white",
  success: "bg-emerald-500 text-white",
  warning: "bg-amber-500 text-white",
  default: "bg-zinc-500 text-white",
};

export const Badge: React.FC<BadgeProps> = ({ content, color = "primary", children, className = "" }) => (
  <div className={`relative inline-flex ${className}`}>
    {children}
    {content !== undefined && content !== null && (
      <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1 ${BADGE_COLORS[color] || BADGE_COLORS.primary}`}>
        {content}
      </span>
    )}
  </div>
);

// ── Tooltip ──
interface TooltipProps {
  content?: React.ReactNode;
  placement?: string;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className = "" }) => {
  const [show, setShow] = useState(false);
  return (
    <div className={`relative inline-flex ${className}`} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && content && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-zinc-800 text-white text-[11px] rounded-lg whitespace-nowrap z-50 pointer-events-none">
          {content}
        </div>
      )}
    </div>
  );
};

// ── Chip ──
interface ChipProps {
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "flat" | "bordered" | "dot" | "faded" | "light";
  color?: "primary" | "default" | "success" | "warning" | "danger" | "secondary";
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  startContent?: React.ReactNode;
  onClose?: () => void;
}

const CHIP_SOLID: Record<string, string> = {
  primary: "bg-[#006FEE] text-white",
  default: "bg-zinc-100 text-zinc-600",
  success: "bg-emerald-500 text-white",
  warning: "bg-amber-500 text-white",
  danger: "bg-red-500 text-white",
  secondary: "bg-violet-500 text-white",
};

const CHIP_FLAT: Record<string, string> = {
  primary: "bg-[#006FEE]/10 text-[#006FEE]",
  default: "bg-zinc-100 text-zinc-600",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
  secondary: "bg-violet-50 text-violet-600",
};

const CHIP_BORDERED: Record<string, string> = {
  primary: "border border-[#006FEE] text-[#006FEE]",
  default: "border border-zinc-200 text-zinc-500",
  success: "border border-emerald-300 text-emerald-600",
  warning: "border border-amber-300 text-amber-600",
  danger: "border border-red-300 text-red-600",
  secondary: "border border-violet-300 text-violet-600",
};

export const Chip: React.FC<ChipProps> = ({ size = "sm", variant = "flat", color = "default", children, className = "", onClick, startContent, onClose }) => {
  const sizeCls = size === "sm" ? "text-[11px] px-2 py-0.5 h-6" : size === "lg" ? "text-[14px] px-4 py-1.5" : "text-[12px] px-3 py-1";
  const colorMap = variant === "solid" ? CHIP_SOLID : variant === "bordered" ? CHIP_BORDERED : CHIP_FLAT;
  const colorCls = colorMap[color] || colorMap.default;
  return (
    <span onClick={onClick} className={`inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap ${sizeCls} ${colorCls} ${onClick ? "cursor-pointer" : ""} ${className}`}>
      {startContent}
      {children}
      {onClose && <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="ml-0.5 opacity-70 hover:opacity-100">&times;</button>}
    </span>
  );
};

// ── Card, CardBody, CardFooter, CardHeader ──
interface CardProps {
  shadow?: "none" | "sm" | "md" | "lg";
  isPressable?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: any;
  to?: string;
  onPress?: () => void;
  [key: string]: any;
}

export const Card: React.FC<CardProps> = ({ shadow = "sm", isPressable, children, className = "", style, as: Component, to, onPress, ...rest }) => {
  const shadowCls = shadow === "none" ? "" : shadow === "lg" ? "shadow-lg" : shadow === "md" ? "shadow-md" : "shadow-sm";
  const cls = `bg-white rounded-2xl overflow-hidden ${shadowCls} ${isPressable ? "cursor-pointer hover:shadow-md transition-shadow" : ""} ${className}`;

  if (Component) {
    return <Component to={to} className={cls} style={style} onClick={onPress} {...rest}>{children}</Component>;
  }

  return (
    <div className={cls} style={style} onClick={onPress} {...rest}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`px-4 pb-4 ${className}`}>{children}</div>
);

export const CardHeader: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`px-4 pt-4 ${className}`}>{children}</div>
);

// ── Tabs & Tab ──
interface TabsProps {
  selectedKey?: string;
  onSelectionChange?: (key: any) => void;
  variant?: string;
  size?: string;
  color?: string;
  children: React.ReactNode;
  className?: string;
  classNames?: Record<string, string>;
  "aria-label"?: string;
}

interface TabProps {
  key?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
}

const TabsContext = createContext<{ selected: string; onSelect: (k: string) => void }>({ selected: "", onSelect: () => {} });

export const Tabs: React.FC<TabsProps> = ({ selectedKey = "", onSelectionChange, children, className = "", classNames = {}, ...rest }) => {
  const tabs = React.Children.toArray(children) as React.ReactElement<TabProps>[];
  const activeKey = selectedKey || (tabs[0]?.key as string) || "";

  return (
    <div className={className} role="tablist" aria-label={rest["aria-label"] || "Tabs"}>
      <div className={`flex gap-1 p-1 bg-zinc-100 rounded-xl ${classNames.tabList || ""}`}>
        {tabs.map((tab) => {
          const k = tab.key as string;
          const active = k === activeKey;
          return (
            <button
              key={k}
              role="tab"
              aria-selected={active}
              onClick={() => onSelectionChange?.(k)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${active ? "bg-white text-zinc-800 shadow-sm" : "text-zinc-500 hover:text-zinc-700"} ${classNames.tab || ""}`}
            >
              {tab.props.title || k}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const Tab: React.FC<TabProps> = ({ children }) => <>{children}</>;

// ── Modal ──
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  scrollBehavior?: "inside" | "outside";
  backdrop?: "blur" | "opaque" | "transparent";
  children: React.ReactNode;
  classNames?: Record<string, string>;
}

const MODAL_SIZES: Record<string, string> = {
  sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl",
  "2xl": "max-w-2xl", "3xl": "max-w-3xl", "4xl": "max-w-4xl", "5xl": "max-w-5xl", full: "max-w-full mx-4",
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, size = "md", backdrop = "opaque", children, classNames = {} }) => {
  if (!isOpen) return null;
  const backdropCls = backdrop === "blur" ? "backdrop-blur-sm bg-black/40" : backdrop === "transparent" ? "" : "bg-black/50";
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${backdropCls}`} onClick={onClose} role="dialog" aria-modal="true">
      <div className={`bg-white rounded-2xl w-full ${MODAL_SIZES[size]} max-h-[90vh] flex flex-col shadow-xl overflow-hidden`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export const ModalContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`flex flex-col max-h-[90vh] ${className}`}>{children}</div>
);

export const ModalHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`px-6 py-4 shrink-0 ${className}`}>{children}</div>
);

export const ModalBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`flex-1 overflow-y-auto px-6 py-2 ${className}`}>{children}</div>
);

export const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`px-6 py-4 shrink-0 ${className}`}>{children}</div>
);

// ── useDisclosure ──
export const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    onOpen: useCallback(() => setIsOpen(true), []),
    onClose: useCallback(() => setIsOpen(false), []),
    onOpenChange: setIsOpen,
  };
};

// ── Switch ──
interface SwitchProps {
  isSelected?: boolean;
  onValueChange?: (v: boolean) => void;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  className?: string;
  classNames?: Record<string, string>;
}

export const Switch: React.FC<SwitchProps> = ({ isSelected, onValueChange, size = "md", children, className = "", classNames = {} }) => {
  const w = size === "sm" ? "w-8 h-4" : size === "lg" ? "w-14 h-7" : "w-11 h-6";
  const dot = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-6 h-6" : "w-5 h-5";
  const translate = size === "sm" ? "translate-x-4" : size === "lg" ? "translate-x-7" : "translate-x-5";

  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
      <button
        role="switch"
        type="button"
        aria-checked={isSelected}
        aria-label={typeof children === "string" ? children : "toggle"}
        onClick={() => onValueChange?.(!isSelected)}
        className={`relative inline-flex ${w} items-center rounded-full transition-colors ${isSelected ? "bg-[#006FEE]" : "bg-zinc-200"}`}
      >
        <span className={`${dot} bg-white rounded-full shadow transition-transform ${isSelected ? translate : "translate-x-0.5"}`} />
      </button>
      {children && <span className={`text-[13px] ${classNames.label || ""}`}>{children}</span>}
    </label>
  );
};

// ── Slider ──
interface SliderProps {
  label?: string;
  value?: number | number[];
  defaultValue?: number | number[];
  onChange?: (v: number | number[]) => void;
  onValueChange?: (v: number | number[]) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
  showSteps?: boolean;
  "aria-label"?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label, value, defaultValue = 0, onChange, onValueChange,
  minValue = 0, maxValue = 100, step = 1, className = "", ...rest
}) => {
  const val = typeof value === "number" ? value : Array.isArray(value) ? value[0] : (typeof defaultValue === "number" ? defaultValue : 0);
  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between mb-1.5 text-[13px]">
          <span className="text-zinc-500 font-medium">{label}</span>
          <span className="text-zinc-800 font-semibold">{val}</span>
        </div>
      )}
      <input
        type="range"
        min={minValue}
        max={maxValue}
        step={step}
        value={val}
        aria-label={rest["aria-label"] || label || "slider"}
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange?.(n);
          onValueChange?.(n);
        }}
        className="w-full accent-[#006FEE] h-2 rounded-full"
      />
    </div>
  );
};

// ── Textarea (in case needed) ──
interface TextareaProps {
  label?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  variant?: string;
  className?: string;
  classNames?: Record<string, string>;
  minRows?: number;
  "aria-label"?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, value, onValueChange, placeholder, className = "", classNames = {}, minRows = 3, ...rest }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className={`text-[13px] font-medium text-zinc-500 ${classNames.label || ""}`}>{label}</label>}
    <textarea
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      placeholder={placeholder}
      rows={minRows}
      aria-label={rest["aria-label"] || label || placeholder}
      className={`w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-[13px] text-zinc-800 placeholder:text-zinc-400 outline-none focus:border-[#006FEE] transition-colors bg-white ${classNames.input || ""}`}
    />
  </div>
);

// ── Skeleton ──
interface SkeletonProps {
  className?: string;
  isLoaded?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", isLoaded, children, style }) => {
  if (isLoaded && children !== undefined) return <>{children}</>;
  return (
    <div
      className={`animate-pulse rounded-md ${className}`}
      style={{ background: "#f4f4f5", ...style }}
    />
  );
};