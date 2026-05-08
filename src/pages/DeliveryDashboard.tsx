import { Navbar } from "@/components/layout/Navbar";
import { useApp, formatINR } from "@/store/app";
import { Bike, MapPin, Package, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMemo } from "react";

const DeliveryDashboard = () => {
  const { orders, vendors, advanceOrder } = useApp();

  const active = useMemo(
    () => orders.filter((o) => o.status === "packed" || o.status === "out_for_delivery"),
    [orders]
  );
  const delivered = useMemo(() => orders.filter((o) => o.status === "delivered"), [orders]);

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <div className="container py-6">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold inline-flex items-center gap-2">
              <Bike className="h-7 w-7 text-primary" /> Delivery
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Pick up packed orders & deliver to customers</p>
          </div>
          <span className="inline-flex items-center gap-2 text-xs glass px-3 py-1.5 rounded-full">
            <span className="live-dot" /> {active.length} active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
          <div className="glass-card rounded-2xl p-5">
            <Package className="h-5 w-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="font-display text-2xl font-bold">{active.length}</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <CheckCircle2 className="h-5 w-5 text-success mb-2" />
            <p className="text-xs text-muted-foreground">Delivered today</p>
            <p className="font-display text-2xl font-bold">{delivered.length}</p>
          </div>
        </div>

        <section className="glass-card rounded-2xl p-5 mb-6">
          <h2 className="font-display text-xl font-bold mb-4">Active deliveries</h2>
          {active.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No active deliveries.</p>
          ) : (
            <div className="space-y-3">
              {active.map((o) => {
                const v = vendors.find((x) => x.id === o.vendorId);
                return (
                  <div key={o.id} className="p-4 rounded-xl bg-background/60 flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <p className="font-semibold">{o.id} · {v?.name}</p>
                      <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {o.address}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {o.lines.map((l) => `${l.name} (${l.qtyKg}kg)`).join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatINR(o.total)}</p>
                      <span className="text-[10px] uppercase font-bold tracking-wide text-primary">
                        {o.status.replace("_", " ")}
                      </span>
                      <div className="mt-2">
                        <Button
                          size="sm"
                          variant="hero"
                          onClick={() => {
                            advanceOrder(o.id);
                            toast.success(o.status === "packed" ? "Picked up" : "Marked delivered");
                          }}
                        >
                          {o.status === "packed" ? "Pick up" : "Mark delivered"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="glass-card rounded-2xl p-5">
          <h2 className="font-display text-xl font-bold mb-4">Recently delivered</h2>
          {delivered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No deliveries yet.</p>
          ) : (
            <div className="space-y-2">
              {delivered.slice(0, 10).map((o) => {
                const v = vendors.find((x) => x.id === o.vendorId);
                return (
                  <div key={o.id} className="p-3 rounded-xl bg-background/60 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{o.id} · {v?.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-success">Delivered</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
