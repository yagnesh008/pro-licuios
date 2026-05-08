import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import logo from "@/assets/logo.png";
import { toast } from "sonner";

const Register = () => {
  const register = useApp((s) => s.register);
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", contact: "", password: "", address: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, contact, password, address } = form;
    if (!name.trim() || name.length > 80) return toast.error("Enter a valid name");
    if (!contact.trim() || contact.length > 80) return toast.error("Enter a valid contact");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (!address.trim()) return toast.error("Address is required");
    register({ name, contact, password, address });
    toast.success("Welcome to Pro Licious!");
    nav("/marketplace");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-cream">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-6">
          <img src={logo} alt="Pro Licious" className="h-14 w-14 mx-auto mb-3" />
          <h1 className="font-display text-3xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Customer signup only. Vendor & admin accounts are provisioned by the platform.</p>
        </div>
        <div className="glass-card rounded-3xl p-7 shadow-elevated">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 rounded-xl" maxLength={80} />
            </div>
            <div className="space-y-1.5">
              <Label>Contact (email or phone)</Label>
              <Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="h-11 rounded-xl" maxLength={80} />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label>Delivery address</Label>
              <Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-xl min-h-20" maxLength={200} />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">Create account</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-5">
            Already a member?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
