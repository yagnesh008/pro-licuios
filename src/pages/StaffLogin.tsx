import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp, Role } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Store, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import { toast } from "sonner";

// Pre-configured staff credentials. In production, move these to backend / env.
// Using Vite env vars with safe fallbacks for demo.
const STAFF: Record<string, { password: string; role: Role; name: string; vendorId?: string }> = {
  [import.meta.env.VITE_ADMIN_EMAIL ?? "admin@prolicious.in"]: {
    password: import.meta.env.VITE_ADMIN_PASSWORD ?? "123456",
    role: "admin",
    name: "Admin",
  },
  [import.meta.env.VITE_VENDOR_EMAIL ?? "vendor@prolicious.in"]: {
    password: import.meta.env.VITE_VENDOR_PASSWORD ?? "123456",
    role: "vendor",
    name: "Coastal Catch Co.",
    vendorId: "v1",
  },
};

const StaffLogin = () => {
  const [params] = useSearchParams();
  const initialRole = params.get("role") === "admin" ? "admin" : "vendor";
  const [mode, setMode] = useState<"vendor" | "admin">(initialRole);
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const login = useApp((s) => s.login);
  const nav = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = STAFF[contact.trim().toLowerCase()];
    if (!entry || entry.password !== password || entry.role !== mode) {
      toast.error("Invalid staff credentials");
      return;
    }
    login({
      id: `staff_${entry.role}`,
      name: entry.name,
      contact,
      role: entry.role,
      vendorId: entry.vendorId,
      address: "12 Marine Drive, Mumbai",
    });
    toast.success(`Welcome, ${entry.name}`);
    nav(entry.role === "admin" ? "/admin" : "/vendor");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-cream">
      <div className="w-full max-w-md animate-fade-in-up">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to customer login
        </Link>

        <div className="text-center mb-6">
          <img src={logo} alt="Pro Licious" className="h-14 w-14 mx-auto mb-3" />
          <h1 className="font-display text-2xl font-bold">Staff access</h1>
          <p className="text-sm text-muted-foreground mt-1">Vendor & admin portal — restricted</p>
        </div>

        <div className="glass-card rounded-3xl p-7 shadow-elevated">
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-muted rounded-2xl mb-6">
            {([
              { v: "vendor", label: "Vendor", Icon: Store },
              { v: "admin", label: "Admin", Icon: ShieldCheck },
            ] as const).map(({ v, label, Icon }) => {
              const active = mode === v;
              return (
                <button
                  key={v}
                  onClick={() => setMode(v)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active ? "bg-background text-primary shadow-soft" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact">Staff email</Label>
              <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="staff@prolicious.in" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-11 rounded-xl" />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">
              Sign in as {mode === "admin" ? "Admin" : "Vendor"}
            </Button>
          </form>

          <p className="text-[11px] text-center text-muted-foreground mt-5 leading-relaxed">
            Staff accounts are pre-configured by the platform.
            <br />Contact ops@prolicious.in for access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
