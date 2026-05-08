import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";
import { toast } from "sonner";

const Login = () => {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const login = useApp((s) => s.login);
  const nav = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact || !password) {
      toast.error("Enter your contact and password");
      return;
    }
    login({
      id: `demo_user`,
      name: "Aarav Mehta",
      contact,
      role: "user",
      address: "12 Marine Drive, Mumbai",
    });
    toast.success("Welcome back, Aarav");
    nav("/marketplace");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-cream">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <img src={logo} alt="Pro Licious" className="h-14 w-14 mx-auto mb-3 animate-float" />
          <h1 className="font-display text-3xl font-bold">
            Pro <span className="text-gradient">Licious</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Farm-fresh, slaughtered to order.</p>
        </div>

        <div className="glass-card rounded-3xl p-7 shadow-elevated">
          <h2 className="font-display text-xl font-semibold text-center mb-1">Welcome back</h2>
          <p className="text-xs text-center text-muted-foreground mb-5">
            Sign in to order fresh, delivered fast
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact">Email or phone</Label>
              <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="you@example.com" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-11 rounded-xl" />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            New here?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
