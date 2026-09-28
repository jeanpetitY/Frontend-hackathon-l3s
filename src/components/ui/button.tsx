import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

const variants = {
  primary: "bg-[#ef5b60] text-white shadow-[0_10px_22px_rgba(239,91,96,0.2)] hover:-translate-y-0.5 hover:bg-[#df4d52]",
  secondary: "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
};

export function Button({ children, className = "", variant = "primary", fullWidth, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
