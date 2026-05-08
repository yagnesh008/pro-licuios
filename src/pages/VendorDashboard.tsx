import { Navbar } from "@/components/layout/Navbar";

import { useApp, formatINR, effectivePrice } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Package, ShoppingBag, TrendingUp, IndianRupee, Tag, Edit3, Check, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState } from "react";

const VendorDashboard = () => {
  const { user, items, orders, removeItem, updateItem, vendors, advanceOrder, addItem } = useApp();
  const vendorId = user?.vendorId ?? "v1";
  const vendor = vendors.find((v) => v.id === vendorId);
  const myItems = items.filter((i) => i.vendorId === vendorId);
  const myOrders = orders.filter((o) => o.vendorId === vendorId);

  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ price: string; discount: string }>({ price: "", discount: "" });
  const [newItem, setNewItem] = useState({ name: "", category: "fish" as "fish" | "chicken" | "mutton", price: "", discount: "" });

  const addNewItem = () => {
    const price = parseInt(newItem.price);
    if (!newItem.name.trim() || isNaN(price) || price < 1) return toast.error("Enter name and valid price");
    const discount = parseInt(newItem.discount);
    addItem({
      vendorId,
      name: newItem.name.trim(),
      category: newItem.category,
      pricePerKg: price,
      discount: isNaN(discount) || discount <= 0 ? undefined : Math.min(discount, 90),
      unit: "kg",
      image: myItems[0]?.image ?? vendor?.cover ?? "",
    });
    setNewItem({ name: "", category: "fish", price: "", discount: "" });
    toast.success("Item added to your menu");
  };

  const stats = useMemo(() => {
    const rev = myOrders.reduce((s, o) => s + o.total, 0);
    return { items: myItems.length, orders: myOrders.length, revenue: rev, rating: vendor?.rating ?? 4.5 };
  }, [myItems, myOrders, vendor]);

  const startEdit = (id: string, price: number, discount?: number) => {
    setEditing(id);
    setDraft({ price: String(price), discount: String(discount ?? 0) });
  };
  const saveEdit = (id: string) => {
    const price = parseInt(draft.price);
    const discount = parseInt(draft.discount);
    if (isNaN(price) || price < 1) return toast.error("Invalid price");
    updateItem(id, { pricePerKg: price, discount: isNaN(discount) || discount <= 0 ? undefined : Math.min(discount, 90) });
    setEditing(null);
    toast.success("Item updated");
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <div className="container py-6">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">My Shop</h1>
            <p className="text-sm text-muted-foreground mt-1">{vendor?.name} · manage your menu & orders</p>
          </div>
          <span className="inline-flex items-center gap-2 text-xs glass px-3 py-1.5 rounded-full"><span className="live-dot" /> Shop is live</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Stat icon={Package} label="Items" value={stats.items.toString()} />
          <Stat icon={ShoppingBag} label="Orders" value={stats.orders.toString()} />
          <Stat icon={IndianRupee} label="Revenue" value={formatINR(stats.revenue)} />
          <Stat icon={TrendingUp} label="Rating" value={stats.rating.toFixed(1)} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold">Menu items</h2>
              <span className="text-xs text-muted-foreground">Edit prices · apply discounts · remove items</span>
            </div>
            <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
              <p className="text-sm font-semibold mb-3 inline-flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> Add new dish</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <Input placeholder="Dish name" className="md:col-span-2 h-9" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                  <option value="fish">Fish</option>
                  <option value="chicken">Chicken</option>
                  <option value="mutton">Mutton</option>
                </select>
                <Input placeholder="₹/kg" className="h-9" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
                <Input placeholder="Disc %" className="h-9" value={newItem.discount} onChange={(e) => setNewItem({ ...newItem, discount: e.target.value })} />
              </div>
              <Button size="sm" variant="hero" className="mt-3" onClick={addNewItem}><Plus className="h-4 w-4 mr-1" /> Add to menu</Button>
            </div>
            <div className="space-y-3">
              {myItems.map((it) => {
                const isEdit = editing === it.id;
                return (
                  <div key={it.id} className="flex items-center gap-3 p-3 rounded-xl bg-background/60">
                    <img src={it.image} alt={it.name} className="h-14 w-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{it.name}</p>
                      {isEdit ? (
                        <div className="flex gap-2 mt-2">
                          <div className="flex-1">
                            <label className="text-[10px] text-muted-foreground">Price /kg</label>
                            <Input value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} className="h-8 text-sm" />
                          </div>
                          <div className="flex-1">
                            <label className="text-[10px] text-muted-foreground">Discount %</label>
                            <Input value={draft.discount} onChange={(e) => setDraft({ ...draft, discount: e.target.value })} className="h-8 text-sm" />
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatINR(effectivePrice(it))}/kg
                          {it.discount && <span className="ml-2 text-success font-semibold inline-flex items-center gap-1"><Tag className="h-3 w-3" /> {it.discount}% off</span>}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {isEdit ? (
                        <>
                          <Button size="icon" variant="ghost" onClick={() => saveEdit(it.id)}><Check className="h-4 w-4 text-success" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
                        </>
                      ) : (
                        <>
                          <Button size="icon" variant="ghost" onClick={() => startEdit(it.id, it.pricePerKg, it.discount)}><Edit3 className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => { removeItem(it.id); toast.success("Removed"); }}><Trash2 className="h-4 w-4" /></Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="glass-card rounded-2xl p-5">
            <h2 className="font-display text-xl font-bold mb-4">Incoming orders</h2>
            <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
              {myOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No orders yet.</p>
              ) : myOrders.map((o) => (
                <div key={o.id} className="p-3 rounded-xl bg-background/60">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{o.id}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wide text-primary px-2 py-0.5 rounded-full bg-primary/10">{o.status.replace("_", " ")}</span>
                  </div>
                  <p className="text-xs mt-2 text-muted-foreground line-clamp-2">{o.lines.map((l) => `${l.name} (${l.qtyKg}kg)`).join(", ")}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-semibold text-sm">{formatINR(o.total)}</span>
                    {o.status !== "delivered" && (
                      <button onClick={() => advanceOrder(o.id)} className="text-xs text-primary font-semibold hover:underline">Advance →</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="glass-card rounded-2xl p-5">
    <div className="h-10 w-10 rounded-xl bg-gradient-warm flex items-center justify-center text-primary-foreground shadow-warm mb-3">
      <Icon className="h-5 w-5" />
    </div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-display text-2xl font-bold mt-0.5">{value}</p>
  </div>
);

export default VendorDashboard;
