import { Navbar } from "@/components/layout/Navbar";

import { useApp, formatINR } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Store, Package, ShoppingBag, TrendingUp, Star, IndianRupee, Plus, Percent, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const Admin = () => {
  const { vendors, items, orders, removeVendor, addVendor, platformDiscount, setPlatformDiscount } = useApp();
  const [newVendor, setNewVendor] = useState({ name: "", tagline: "", category: "fish" as "fish" | "chicken" | "mutton" });
  const [discountInput, setDiscountInput] = useState(String(platformDiscount));

  const handleAddVendor = () => {
    if (!newVendor.name.trim()) return toast.error("Vendor name required");
    addVendor({
      name: newVendor.name.trim(),
      tagline: newVendor.tagline.trim() || "Fresh & live daily",
      cover: vendors[0]?.cover ?? "",
      categories: [newVendor.category],
    });
    setNewVendor({ name: "", tagline: "", category: "fish" });
    toast.success("Vendor added");
  };

  const applyDiscount = () => {
    const pct = parseInt(discountInput);
    if (isNaN(pct) || pct < 0) return toast.error("Invalid percent");
    setPlatformDiscount(pct);
    toast.success(`Platform discount set to ${Math.min(pct, 90)}%`);
  };


  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    return {
      vendors: vendors.length,
      items: items.length,
      orders: orders.length,
      revenue,
    };
  }, [vendors, items, orders]);

  const vendorPerf = useMemo(() => {
    return vendors.map((v) => {
      const vOrders = orders.filter((o) => o.vendorId === v.id);
      const rev = vOrders.reduce((s, o) => s + o.total, 0);
      const ratings = vOrders.filter((o) => o.rating).map((o) => o.rating!);
      const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : v.rating;
      return { ...v, orderCount: vOrders.length, rev, avg };
    }).sort((a, b) => b.rev - a.rev);
  }, [vendors, orders]);

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <div className="container py-6">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Marketplace overview & controls</p>
          </div>
          <span className="inline-flex items-center gap-2 text-xs glass px-3 py-1.5 rounded-full"><span className="live-dot" /> Live data</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Stat icon={Store} label="Vendors" value={stats.vendors.toString()} />
          <Stat icon={Package} label="Items" value={stats.items.toString()} />
          <Stat icon={ShoppingBag} label="Orders" value={stats.orders.toString()} />
          <Stat icon={IndianRupee} label="Revenue" value={formatINR(stats.revenue)} />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <section className="glass-card rounded-2xl p-5">
            <h2 className="font-display text-lg font-bold inline-flex items-center gap-2 mb-3"><Plus className="h-4 w-4 text-primary" /> Add new vendor</h2>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Vendor name" className="col-span-2 h-9" value={newVendor.name} onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })} />
              <Input placeholder="Tagline" className="h-9" value={newVendor.tagline} onChange={(e) => setNewVendor({ ...newVendor, tagline: e.target.value })} />
              <select value={newVendor.category} onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value as any })} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                <option value="fish">Fish</option>
                <option value="chicken">Chicken</option>
                <option value="mutton">Mutton</option>
              </select>
            </div>
            <Button size="sm" variant="hero" className="mt-3" onClick={handleAddVendor}><Plus className="h-4 w-4 mr-1" /> Add vendor</Button>
          </section>
          <section className="glass-card rounded-2xl p-5">
            <h2 className="font-display text-lg font-bold inline-flex items-center gap-2 mb-3"><Percent className="h-4 w-4 text-primary" /> Platform discount</h2>
            <p className="text-xs text-muted-foreground mb-3">Apply a sitewide % discount on all orders. Currently: <span className="font-bold text-foreground">{platformDiscount}%</span></p>
            <div className="flex gap-2">
              <Input type="number" placeholder="0-90" className="h-9" value={discountInput} onChange={(e) => setDiscountInput(e.target.value)} />
              <Button size="sm" variant="hero" onClick={applyDiscount}>Apply</Button>
            </div>
          </section>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold inline-flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Vendor Performance</h2>
              <span className="text-xs text-muted-foreground">Tap to view menu insights</span>
            </div>
            <div className="space-y-3">
              {vendorPerf.map((v) => (
                <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-background/60 hover:bg-background transition">
                  <Link to={`/admin/vendors/${v.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <img src={v.cover} alt={v.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{v.name}</p>
                      <p className="text-xs text-muted-foreground inline-flex items-center gap-2">
                        <span className="inline-flex items-center gap-0.5"><Star className="h-3 w-3 fill-accent text-accent" /> {v.avg.toFixed(1)}</span>
                        · {v.orderCount} orders · {formatINR(v.rev)}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => { removeVendor(v.id); toast.success("Vendor removed"); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-2xl p-5">
            <h2 className="font-display text-xl font-bold mb-4">Recent Orders</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No orders yet.</p>
              ) : orders.map((o) => {
                const v = vendors.find((x) => x.id === o.vendorId);
                return (
                  <div key={o.id} className="p-3 rounded-xl bg-background/60 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{o.id} · {v?.name}</p>
                      <p className="text-xs text-muted-foreground">{o.lines.length} items · {new Date(o.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-sm">{formatINR(o.total)}</p>
                      <span className="text-[10px] uppercase font-bold tracking-wide text-primary">{o.status.replace("_", " ")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
      
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="glass-card rounded-2xl p-5 hover:shadow-warm transition">
    <div className="h-10 w-10 rounded-xl bg-gradient-warm flex items-center justify-center text-primary-foreground shadow-warm mb-3">
      <Icon className="h-5 w-5" />
    </div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-display text-2xl font-bold mt-0.5">{value}</p>
  </div>
);

export default Admin;
