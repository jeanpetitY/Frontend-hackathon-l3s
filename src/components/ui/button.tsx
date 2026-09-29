import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

const variants = {
  primary: "bg-[#e9545a] text-white shadow-[0_8px_20px_rgba(218,63,71,0.18)] hover:-translate-y-px hover:bg-[#d9484e] hover:shadow-[0_12px_26px_rgba(218,63,71,0.27)] active:translate-y-0 active:bg-[#c94046] dark:hover:bg-[#f06469]",
  secondary: "border border-slate-300 bg-white text-slate-700 shadow-sm hover:-translate-y-px hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 hover:shadow-md active:translate-y-0 dark:border-slate-600 dark:bg-[#202630] dark:text-slate-100 dark:hover:border-rose-800 dark:hover:bg-rose-950/25 dark:hover:text-rose-200",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
};

export function Button({ children, className = "", variant = "primary", fullWidth, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:shadow-none ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
