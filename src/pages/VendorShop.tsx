import { Link, useParams, useNavigate } from "react-router-dom";
import { Navbar, LocationStrip } from "@/components/layout/Navbar";
import { SupportFab } from "@/components/layout/SupportFab";
import { useApp, formatINR, effectivePrice } from "@/store/app";
import { ArrowLeft, Star, Clock, MapPin, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const VendorShop = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { vendors, items, cart, addToCart, updateQty, user } = useApp();
  const vendor = vendors.find((v) => v.id === id);
  const shopItems = items.filter((i) => i.vendorId === id);

  if (!vendor) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <p>Vendor not found.</p>
          <Link to="/marketplace" className="text-primary underline mt-2 inline-block">Back to marketplace</Link>
        </div>
      </div>
    );
  }

  const qtyOf = (itemId: string) => cart.find((c) => c.itemId === itemId)?.qtyKg ?? 0;

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <LocationStrip address={user?.address} />

      <div className="container">
        <button onClick={() => nav(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Shop header */}
        <div className="relative rounded-3xl overflow-hidden shadow-elevated">
          <img src={vendor.cover} alt={vendor.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/70 to-secondary/30" />
          <div className="relative p-8 md:p-12">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass text-xs font-semibold border border-white/20 text-secondary-foreground mb-4">
              <span className="live-dot" /> Open · accepting orders
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-secondary-foreground">{vendor.name}</h1>
            <p className="text-secondary-foreground/80 mt-2">{vendor.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-secondary-foreground/90">
              <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-accent text-accent" /> {vendor.rating} rating</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {vendor.etaMin} min ETA</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {vendor.distanceKm} km away</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <h2 className="font-display text-2xl font-bold mt-10 mb-5">Today's Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shopItems.map((it) => {
            const price = effectivePrice(it);
            const qty = qtyOf(it.id);
            return (
              <div key={it.id} className="glass-card rounded-2xl p-4 flex gap-4 hover:shadow-warm transition-all">
                <img src={it.image} alt={it.name} loading="lazy" className="h-24 w-24 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{it.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">{it.category} · per {it.unit}</p>
                    </div>
                    {it.discount && (
                      <span className="px-2 py-0.5 rounded-full bg-success/15 text-success text-[10px] font-bold">
                        {it.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-display text-lg font-bold text-primary">{formatINR(price)}</span>
                    {it.discount && <span className="text-xs text-muted-foreground line-through">{formatINR(it.pricePerKg)}</span>}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {qty > 0 ? (
                      <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full p-1">
                        <button onClick={() => updateQty(it.id, +(qty - 0.5).toFixed(1))} className="h-7 w-7 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                        <span className="text-sm font-bold w-12 text-center">{qty} kg</span>
                        <button onClick={() => updateQty(it.id, +(qty + 0.5).toFixed(1))} className="h-7 w-7 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                      </div>
                    ) : (
                      <Button size="sm" variant="default" onClick={() => { addToCart(it.id, vendor.id); toast.success(`${it.name} added`); }}>
                        <Plus className="h-3 w-3" /> Add 0.5 kg
                      </Button>
                    )}
                    <span className="text-xs text-muted-foreground">{qty > 0 && formatINR(price * qty)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {cart.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in-up">
            <Link to="/cart" className="inline-flex items-center gap-3 px-6 h-14 rounded-full bg-gradient-warm text-primary-foreground shadow-warm hover:shadow-glow transition-all hover:-translate-y-0.5 font-semibold">
              <ShoppingCart className="h-5 w-5" />
              {cart.reduce((s, c) => s + c.qtyKg, 0)} kg in cart · View cart
            </Link>
          </div>
        )}
      </div>

      <SupportFab />
    </div>
  );
};

export default VendorShop;
