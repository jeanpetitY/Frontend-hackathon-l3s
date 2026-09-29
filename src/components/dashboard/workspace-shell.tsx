import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/ui/icon";

export type UserRole = "professor" | "student";
export type WorkspaceView = "dashboard" | "builder" | "submission" | "exam" | "report";

type WorkspaceShellProps = {
  children: ReactNode;
  role: UserRole;
  view: WorkspaceView;
  onRoleChange: (role: UserRole) => void;
  onNavigate: (view: WorkspaceView) => void;
};

const professorNav: { id: WorkspaceView; label: string; icon: IconName }[] = [
  { id: "dashboard", label: "Overview", icon: "grid" },
  { id: "builder", label: "Course Studio", icon: "book" },
  { id: "builder", label: "Assessments", icon: "document" },
  { id: "dashboard", label: "Students", icon: "home" },
  { id: "dashboard", label: "Results", icon: "bar-chart" },
];

const studentNav: { id: WorkspaceView; label: string; icon: IconName }[] = [
  { id: "dashboard", label: "My courses", icon: "book" },
  { id: "submission", label: "Assessments", icon: "document" },
  { id: "exam", label: "Oral examinations", icon: "microphone" },
  { id: "report", label: "Feedback", icon: "bar-chart" },
];

export function WorkspaceShell({ children, role, view, onRoleChange, onNavigate }: WorkspaceShellProps) {
  const navigation = role === "professor" ? professorNav : studentNav;

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[#f1f3f7] transition-colors dark:bg-[#16191f]">
      <div className="mx-auto grid w-full max-w-[1440px] gap-0 lg:grid-cols-[238px_1fr]">
        <aside className="hidden min-h-[calc(100vh-68px)] border-r border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-[#1d2128] lg:block">
          <RoleSwitcher onRoleChange={onRoleChange} role={role} />
          <nav aria-label="Workspace" className="mt-7 space-y-1">
            {navigation.map((item, index) => {
              const active = view === "dashboard" ? index === 0 : item.id === view && (role === "student" || index === 1);
              return (
                <button
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${active ? "bg-[#fff0f0] text-[#d94c52] dark:bg-rose-950/25 dark:text-rose-300" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"}`}
                  key={`${item.label}-${index}`}
                  onClick={() => onNavigate(item.id)}
                  type="button"
                >
                  <Icon className="size-[17px]" name={item.icon} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-xl bg-[#5f6678] p-4 text-white dark:bg-[#292e38]">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#ffb7b9]"><Icon className="size-4" name="shield" />Evidence first</div>
            <p className="mt-3 text-xs leading-5 text-white/70">Every score links back to the student work, exam answer and approved rubric.</p>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="border-b border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-[#1d2128] sm:px-8 lg:hidden">
            <RoleSwitcher onRoleChange={onRoleChange} role={role} />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}

function RoleSwitcher({ role, onRoleChange }: { role: UserRole; onRoleChange: (role: UserRole) => void }) {
  return (
    <div>
      <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Preview as</p>
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-[#15181e]">
        {(["professor", "student"] as const).map((item) => (
          <button
            className={`rounded-md px-3 py-2 text-xs font-semibold capitalize transition ${role === item ? "bg-white text-[#3d4351] shadow-sm dark:bg-[#2a2f38] dark:text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}
            key={item}
            onClick={() => onRoleChange(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
