import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import { toast } from "sonner";

const VENDOR_EMAIL = (import.meta.env.VITE_VENDOR_EMAIL ?? "vendor@prolicious.in").toLowerCase();
const VENDOR_PASSWORD = import.meta.env.VITE_VENDOR_PASSWORD ?? "123456";

const VendorLogin = () => {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const login = useApp((s) => s.login);
  const nav = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contact.trim().toLowerCase() !== VENDOR_EMAIL || password !== VENDOR_PASSWORD) {
      toast.error("Invalid vendor credentials");
      return;
    }
    login({
      id: "staff_vendor",
      name: "Coastal Catch Co.",
      contact,
      role: "vendor",
      vendorId: "v1",
      address: "12 Marine Drive, Mumbai",
    });
    toast.success("Welcome, vendor");
    nav("/vendor");
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
            <Store className="h-6 w-6 text-primary" /> Vendor login
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your shop & orders</p>
        </div>
        <div className="glass-card rounded-3xl p-7 shadow-elevated">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact">Vendor email</Label>
              <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="vendor@prolicious.in" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-11 rounded-xl" />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">Sign in as Vendor</Button>
          </form>
          <p className="text-[11px] text-center text-muted-foreground mt-5">Vendor accounts are pre-configured by the platform.</p>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;
