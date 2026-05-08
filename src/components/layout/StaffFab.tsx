import { Link, useLocation } from "react-router-dom";
import { KeyRound, Store, ShieldCheck, Bike, X } from "lucide-react";
import { useApp } from "@/store/app";
import { useState } from "react";

export const StaffFab = () => {
  const user = useApp((s) => s.user);
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Hide while inside any staff portal / login
  if (
    pathname.startsWith("/staff") ||
    pathname.startsWith("/vendor") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/delivery")
  ) return null;
  if (user && user.role !== "user") return null;

  const items = [
    { to: "/vendor-login", Icon: Store, label: "Vendor login", sub: "Manage your shop" },
    { to: "/admin-login", Icon: ShieldCheck, label: "Admin login", sub: "Platform controls" },
    { to: "/delivery-login", Icon: Bike, label: "Delivery login", sub: "Pick up & deliver" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="absolute bottom-16 right-0 w-64 glass-card rounded-2xl p-3 shadow-elevated animate-scale-in">
          <p className="px-2 pt-1 pb-2 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            Staff portal
          </p>
          {items.map(({ to, Icon, label, sub }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-accent/30 transition"
            >
              <span className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-[11px] text-muted-foreground">{sub}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Staff login"
        className="h-14 w-14 rounded-full bg-gradient-warm text-primary-foreground shadow-warm hover:shadow-glow flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      >
        {open ? <X className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
      </button>
    </div>
  );
};
