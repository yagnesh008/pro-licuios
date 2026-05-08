import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { useApp, OrderStatus, formatINR } from "@/store/app";
import { Check, Package, Bike, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const steps: { key: OrderStatus; label: string; icon: any; desc: string }[] = [
  { key: "processing", label: "Processing", icon: Sparkles, desc: "Vendor is preparing your fresh cut" },
  { key: "packed", label: "Packed", icon: Package, desc: "Sealed & ice-packed for freshness" },
  { key: "out_for_delivery", label: "Out for delivery", icon: Bike, desc: "Rider en route to your door" },
  { key: "delivered", label: "Delivered", icon: Home, desc: "Enjoy your meal!" },
];

const Track = () => {
  const { id } = useParams();
  const { orders, vendors, advanceOrder } = useApp();
  const order = orders.find((o) => o.id === id);
  const vendor = vendors.find((v) => v.id === order?.vendorId);

  // Auto-advance for demo (simulates real-time updates)
  useEffect(() => {
    if (!order || order.status === "delivered") return;
    const t = setTimeout(() => advanceOrder(order.id), 6000);
    return () => clearTimeout(t);
  }, [order, advanceOrder]);

  if (!order) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <p>Order not found.</p>
          <Link to="/orders" className="text-primary underline mt-2 inline-block">View my orders</Link>
        </div>
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <div className="container py-6 max-w-3xl">
        <div className="glass-card rounded-3xl p-7 shadow-elevated">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Order {order.id}</p>
              <h1 className="font-display text-2xl md:text-3xl font-bold mt-0.5">{vendor?.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">ETA ~{order.etaMin} min · {order.paymentMethod}</p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide">
              {order.status.replace("_", " ")}
            </span>
          </div>

          {/* Stepper */}
          <div className="mt-8 relative">
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border" />
            <div className="absolute left-5 top-5 w-0.5 bg-gradient-warm transition-all duration-700" style={{ height: `${(currentIdx / (steps.length - 1)) * 100}%` }} />
            <div className="space-y-6">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const done = i <= currentIdx;
                const active = i === currentIdx;
                return (
                  <div key={s.key} className="flex gap-4 items-start">
                    <div className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      done ? "bg-gradient-warm text-primary-foreground shadow-warm" : "bg-muted text-muted-foreground"
                    } ${active ? "animate-glow-pulse" : ""}`}>
                      {done && i < currentIdx ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-7 border-t border-border pt-5">
            <h3 className="font-semibold mb-2">Items</h3>
            <div className="space-y-1.5 text-sm">
              {order.lines.map((l) => (
                <div key={l.itemId} className="flex justify-between">
                  <span>{l.name} × {l.qtyKg} kg</span>
                  <span className="font-medium">{formatINR(l.price * l.qtyKg)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t border-border">
              <span className="font-display font-bold">Total paid</span>
              <span className="font-display text-xl font-bold text-primary">{formatINR(order.total)}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link to="/orders" className="flex-1"><Button variant="outline" className="w-full">My Orders</Button></Link>
            <Link to="/marketplace" className="flex-1"><Button variant="hero" className="w-full">Order again</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;
