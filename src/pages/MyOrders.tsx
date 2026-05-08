import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { useApp, formatINR } from "@/store/app";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MyOrders = () => {
  const { orders, vendors, user, rateOrder } = useApp();
  const myOrders = orders.filter((o) => o.userId === user?.id);

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <div className="container py-6">
        <h1 className="font-display text-3xl font-bold mb-1">My Orders</h1>
        <p className="text-sm text-muted-foreground mb-6">{myOrders.length} order{myOrders.length === 1 ? "" : "s"}</p>

        {myOrders.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">No orders yet.</p>
            <Link to="/marketplace" className="text-primary font-semibold mt-3 inline-block">Start shopping →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map((o) => {
              const vendor = vendors.find((v) => v.id === o.vendorId);
              return (
                <div key={o.id} className="glass-card rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-xs text-muted-foreground">{o.id} · {new Date(o.createdAt).toLocaleString()}</p>
                      <h3 className="font-display text-lg font-bold mt-0.5">{vendor?.name ?? "Vendor"}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {o.lines.map((l) => `${l.name} (${l.qtyKg}kg)`).join(" · ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl font-bold text-primary">{formatINR(o.total)}</p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase">
                        {o.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                    {o.status === "delivered" ? (
                      <RateRow rating={o.rating} onRate={(n) => { rateOrder(o.id, n); toast.success("Thanks for rating!"); }} />
                    ) : (
                      <Link to={`/track/${o.id}`} className="text-sm text-primary font-semibold hover:underline">Track order →</Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const RateRow = ({ rating, onRate }: { rating?: number; onRate: (n: number) => void }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{rating ? "Your rating:" : "Rate this order:"}</span>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => onRate(n)}>
          <Star className={`h-5 w-5 transition-all ${(hover || rating || 0) >= n ? "fill-accent text-accent scale-110" : "text-muted-foreground"}`} />
        </button>
      ))}
    </div>
  );
};

export default MyOrders;
