import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import { toast } from "sonner";

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL ?? "admin@prolicious.in").toLowerCase();
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "admin@123";

const AdminLogin = () => {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const login = useApp((s) => s.login);
  const nav = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contact.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      toast.error("Invalid admin credentials");
      return;
    }
    login({
      id: "staff_admin",
      name: "Admin",
      contact,
      role: "admin",
      address: "Pro Licious HQ",
    });
    toast.success("Welcome, admin");
    nav("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-cream">
      <div className="w-full max-w-md animate-fade-in-up">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to customer login
        </Link>
        <div className="text-center mb-6">
          <img src={logo} alt="Pro Licious" className="h-14 w-14 mx-auto mb-3" />
          <h1 className="font-display text-2xl font-bold inline-flex items-center gap-2 justify-center">
            <ShieldCheck className="h-6 w-6 text-primary" /> Admin login
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Platform controls — restricted</p>
        </div>
        <div className="glass-card rounded-3xl p-7 shadow-elevated">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact">Admin email</Label>
              <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="admin@prolicious.in" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-11 rounded-xl" />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">Sign in as Admin</Button>
          </form>
          <p className="text-[11px] text-center text-muted-foreground mt-5">Admin accounts are pre-configured by the platform.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
