import { Navbar } from "@/components/layout/Navbar";
import { useApp, formatINR } from "@/store/app";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, Clock3 } from "lucide-react";

interface Props {
  scope: "admin" | "vendor" | "delivery";
}

const StaffOrders = ({ scope }: Props) => {
  const { user, orders, vendors, advanceOrder } = useApp();

  const list = useMemo(() => {
    if (scope === "vendor") {
      const vid = user?.vendorId ?? "v1";
      return orders.filter((o) => o.vendorId === vid);
    }
    if (scope === "delivery") {
      return orders.filter((o) => o.status === "packed" || o.status === "out_for_delivery" || o.status === "delivered");
    }
    return orders;
  }, [orders, user, scope]);

  const title =
    scope === "admin" ? "All customer orders" : scope === "vendor" ? "Orders for my shop" : "Delivery orders";
  const canAdvance = scope !== "admin";

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <div className="container py-6">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">Orders</h1>
            <p className="text-sm text-muted-foreground mt-1">{title} placed by users</p>
          </div>
          <span className="inline-flex items-center gap-2 text-xs glass px-3 py-1.5 rounded-full">
            <span className="live-dot" /> {list.length} total
          </span>
        </div>

        <section className="glass-card rounded-2xl p-5">
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10 text-center">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {list.map((o) => {
                const v = vendors.find((x) => x.id === o.vendorId);
                return (
                  <div key={o.id} className="p-4 rounded-xl bg-background/60 flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <p className="font-semibold">{o.id} · {v?.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {o.lines.map((l) => `${l.name} (${l.qtyKg}kg)`).join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">📍 {o.address}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold">{formatINR(o.total)}</p>

                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide
                        ${
                          o.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {o.status === "delivered" ? (
                          <CheckCircle className="h-3.5 w-3.5" />
                        ) : (
                          <Clock3 className="h-3.5 w-3.5" />
                        )}

                        {o.status.replace("_", " ")}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide
                        ${
                          o.status === "delivered"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {o.status === "delivered" ? (
                          <CheckCircle className="h-3.5 w-3.5" />
                        ) : (
                          <Clock3 className="h-3.5 w-3.5" />
                        )}

                        {o.status === "delivered"
                          ? "Payment Received"
                          : "Payment Pending"}
                      </span>
                      {canAdvance && o.status !== "delivered" && (
                        <div className="mt-2">
                          <Button
                            size="sm"
                            variant="hero"
                            onClick={() => {
                              advanceOrder(o.id);
                              toast.success("Order advanced");
                            }}
                          >
                            Advance →
                          </Button>
                        </div>
                      )}
                    </div>
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

export default StaffOrders;
