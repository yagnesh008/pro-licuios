import { Navbar } from "@/components/layout/Navbar";
import { useApp } from "@/store/app";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, MapPin, Phone, User as UserIcon, Shield } from "lucide-react";

const Profile = () => {
  const { user, logout } = useApp();
  const nav = useNavigate();
  if (!user) return null;
  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <div className="container py-6 max-w-2xl">
        <h1 className="font-display text-3xl font-bold mb-6">Profile</h1>
        <div className="glass-card rounded-3xl p-7 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-warm text-primary-foreground flex items-center justify-center font-display text-2xl font-bold shadow-warm">
              {user.name[0]}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground capitalize inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> {user.role} account</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <Row icon={Phone} label="Contact" value={user.contact} />
            <Row icon={MapPin} label="Address" value={user.address || "Not set"} />
            <Row icon={UserIcon} label="Member ID" value={user.id} />
          </div>
          <Button variant="outline" className="mt-6 w-full" onClick={() => { logout(); nav("/login"); }}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};

const Row = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
    <Icon className="h-4 w-4 text-primary shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium truncate">{value}</p>
    </div>
  </div>
);

export default Profile;
