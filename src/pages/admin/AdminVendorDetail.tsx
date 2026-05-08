import { Navbar } from "@/components/layout/Navbar";
import { useApp, formatINR, effectivePrice } from "@/store/app";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Package, ShoppingBag, IndianRupee, Star } from "lucide-react";
import { useMemo } from "react";

const AdminVendorDetail = () => {
  const { id } = useParams();
  const { vendors, items, orders } = useApp();
  const vendor = vendors.find((v) => v.id === id);
  const myItems = items.filter((i) => i.vendorId === id);
  const myOrders = orders.filter((o) => o.vendorId === id);

  const itemSales = useMemo(() => {
    const map = new Map<string, { qty: number; revenue: number; count: number }>();
    myOrders.forEach((o) =>
      o.lines.forEach((l) => {
        const cur = map.get(l.itemId) ?? { qty: 0, revenue: 0, count: 0 };
        cur.qty += l.qtyKg;
        cur.revenue += l.price * l.qtyKg;
        cur.count += 1;
        map.set(l.itemId, cur);
      })
    );
    return myItems
      .map((it) => ({ ...it, ...(map.get(it.id) ?? { qty: 0, revenue: 0, count: 0 }) }))
      .sort((a, b) => b.qty - a.qty);
  }, [myItems, myOrders]);

  const revenue = myOrders.reduce((s, o) => s + o.total, 0);

  if (!vendor) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-10">
          <p className="text-muted-foreground">Vendor not found.</p>
          <Link to="/admin" className="text-primary text-sm">← Back to Admin</Link>
        </div>
      </div>
    );
  }

  const top = itemSales.filter((i) => i.qty > 0).slice(0, 3);
  const low = [...itemSales].reverse().slice(0, 3);

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <div className="container py-6">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Admin
        </Link>
        <div className="flex items-center gap-4 mb-6">
          <img src={vendor.cover} alt={vendor.name} className="h-20 w-20 rounded-2xl object-cover shadow-warm" />
          <div>
            <h1 className="font-display text-3xl font-bold">{vendor.name}</h1>
            <p className="text-sm text-muted-foreground">{vendor.tagline}</p>
            <p className="text-xs text-muted-foreground inline-flex items-center gap-2 mt-1">
              <Star className="h-3 w-3 fill-accent text-accent" /> {vendor.rating.toFixed(1)} · {vendor.distanceKm}km · ETA {vendor.etaMin}m
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Stat icon={Package} label="Items" value={myItems.length.toString()} />
          <Stat icon={ShoppingBag} label="Orders" value={myOrders.length.toString()} />
          <Stat icon={IndianRupee} label="Revenue" value={formatINR(revenue)} />
          <Stat icon={Star} label="Rating" value={vendor.rating.toFixed(1)} />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <section className="glass-card rounded-2xl p-5">
            <h2 className="font-display text-lg font-bold inline-flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-success" /> Best sellers
            </h2>
            {top.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sales yet.</p>
            ) : (
              <div className="space-y-2">
                {top.map((it) => (
                  <Row key={it.id} it={it} />
                ))}
              </div>
            )}
          </section>
          <section className="glass-card rounded-2xl p-5">
            <h2 className="font-display text-lg font-bold inline-flex items-center gap-2 mb-3">
              <TrendingDown className="h-4 w-4 text-destructive" /> Slow movers
            </h2>
            {low.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items.</p>
            ) : (
              <div className="space-y-2">
                {low.map((it) => (
                  <Row key={it.id} it={it} />
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-xl font-bold mb-4">All menu items · sales</h2>
          <div className="space-y-2">
            {itemSales.map((it) => (
              <Row key={it.id} it={it} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const Row = ({ it }: { it: any }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60">
    <img src={it.image} alt={it.name} className="h-12 w-12 rounded-lg object-cover" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold truncate">{it.name}</p>
      <p className="text-xs text-muted-foreground">{formatINR(effectivePrice(it))}/kg · {it.count} orders</p>
    </div>
    <div className="text-right shrink-0">
      <p className="font-semibold text-sm">{it.qty.toFixed(1)} kg</p>
      <p className="text-xs text-muted-foreground">{formatINR(it.revenue)}</p>
    </div>
  </div>
);

const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="glass-card rounded-2xl p-5">
    <div className="h-10 w-10 rounded-xl bg-gradient-warm flex items-center justify-center text-primary-foreground shadow-warm mb-3">
      <Icon className="h-5 w-5" />
    </div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-display text-2xl font-bold mt-0.5">{value}</p>
  </div>
);

export default AdminVendorDetail;
