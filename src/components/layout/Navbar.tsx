import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, LogOut, Menu, MapPin, Store, ShieldCheck, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/store/app";
import logo from "@/assets/logo.png";
import { useState } from "react";

export const Navbar = () => {
  const { user, logout, cart } = useApp();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
    }`;

  const role = user?.role ?? "user";

  // Customer nav vs. staff nav (no marketplace/cart for staff; "Orders" instead of "My Orders")
  const navLinks =
    role === "user"
      ? [
          { to: "/marketplace", label: "Marketplace" },
          { to: "/cart", label: "Cart", badge: cart.length || undefined },
          { to: "/orders", label: "My Orders" },
          { to: "/profile", label: "Profile" },
        ]
      : role === "vendor"
      ? [
          { to: "/vendor", label: "Dashboard" },
          { to: "/vendor/orders", label: "Orders" },
          { to: "/profile", label: "Profile" },
        ]
      : role === "admin"
      ? [
          { to: "/admin", label: "Dashboard" },
          { to: "/admin/orders", label: "Orders" },
          { to: "/profile", label: "Profile" },
        ]
      : [
          { to: "/delivery", label: "Dashboard" },
          { to: "/profile", label: "Profile" },
        ];

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass border-b border-border/60">
        <div className="container flex h-16 items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img src={logo} alt="Pro Licious" className="h-9 w-9 transition-transform group-hover:scale-110" />
            <span className="font-display text-xl font-bold tracking-tight hidden sm:block">
              Pro <span className="text-gradient">Licious</span>
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search fish, chicken, mutton, vendors…"
                className="pl-11 h-11 rounded-full bg-background/70 border-border/60 focus-visible:ring-primary/40"
              />
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 ml-auto">
            {role === "vendor" && (
              <NavLink
                to="/vendor"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-warm text-primary-foreground shadow-warm"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`
                }
                title="My Shop"
              >
                <Store className="h-4 w-4" /> Vendor
              </NavLink>
            )}
            {role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-warm text-primary-foreground shadow-warm"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`
                }
                title="Admin"
              >
                <ShieldCheck className="h-4 w-4" /> Admin
              </NavLink>
            )}
            {role === "delivery" && (
              <NavLink
                to="/delivery"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-warm text-primary-foreground shadow-warm"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`
                }
                title="Delivery"
              >
                <Bike className="h-4 w-4" /> Delivery
              </NavLink>
            )}
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkCls}>
                <span className="inline-flex items-center gap-1.5">
                  {l.label}
                  {l.badge !== undefined && (
                    <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                      {l.badge}
                    </span>
                  )}
                </span>
              </NavLink>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-muted-foreground hover:text-destructive"
              onClick={() => {
                logout();
                nav("/login");
              }}
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </nav>

          {/* Role pill — mobile/tablet only (desktop shows it inside nav above) */}
          <div className="lg:hidden ml-auto flex items-center gap-2">
            {role === "vendor" && (
              <NavLink
                to="/vendor"
                className={({ isActive }) =>
                  `flex items-center justify-center h-10 w-10 rounded-full transition-all ${
                    isActive ? "bg-gradient-warm text-primary-foreground shadow-warm" : "bg-primary/10 text-primary"
                  }`
                }
                title="My Shop"
                aria-label="Vendor"
              >
                <Store className="h-4 w-4" />
              </NavLink>
            )}
            {role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center justify-center h-10 w-10 rounded-full transition-all ${
                    isActive ? "bg-gradient-warm text-primary-foreground shadow-warm" : "bg-primary/10 text-primary"
                  }`
                }
                title="Admin"
                aria-label="Admin"
              >
                <ShieldCheck className="h-4 w-4" />
              </NavLink>
            )}
            {role === "delivery" && (
              <NavLink
                to="/delivery"
                className={({ isActive }) =>
                  `flex items-center justify-center h-10 w-10 rounded-full transition-all ${
                    isActive ? "bg-gradient-warm text-primary-foreground shadow-warm" : "bg-primary/10 text-primary"
                  }`
                }
                title="Delivery"
                aria-label="Delivery"
              >
                <Bike className="h-4 w-4" />
              </NavLink>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              <Menu />
            </Button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border/60 px-4 py-3 space-y-1 animate-fade-in bg-background/95">
            {role === "vendor" && (
              <Link to="/vendor" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-primary hover:bg-accent/20">
                <Store className="h-4 w-4" /> My Shop
              </Link>
            )}
            {role === "admin" && (
              <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-primary hover:bg-accent/20">
                <ShieldCheck className="h-4 w-4" /> Admin
              </Link>
            )}
            {role === "delivery" && (
              <Link to="/delivery" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-primary hover:bg-accent/20">
                <Bike className="h-4 w-4" /> Delivery
              </Link>
            )}
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/20"
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => {
                logout();
                nav("/login");
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export const LocationStrip = ({ address }: { address?: string }) => (
  <div className="container py-3 flex items-center justify-between text-xs text-muted-foreground">
    <div className="flex items-center gap-2">
      <MapPin className="h-3.5 w-3.5 text-primary" />
      <span>Delivering to</span>
      <span className="font-semibold text-foreground">{address || "Set your address"}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="live-dot" />
      <span className="font-semibold text-foreground">Market open</span>
      <span>· 06:00 – 22:00</span>
    </div>
  </div>
);
