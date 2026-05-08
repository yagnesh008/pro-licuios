import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { SupportFab } from "@/components/layout/SupportFab";
import { useApp, formatINR, effectivePrice } from "@/store/app";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { cart, items, vendors, cartVendorId, updateQty, removeFromCart, clearCart } = useApp();
  const nav = useNavigate();
  const vendor = vendors.find((v) => v.id === cartVendorId);
  const lines = cart.map((c) => {
    const it = items.find((i) => i.id === c.itemId)!;
    return { ...c, item: it, price: effectivePrice(it) };
  });
  const subtotal = lines.reduce((s, l) => s + l.price * l.qtyKg, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-24 text-center max-w-md mx-auto">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground mt-2">Discover fresh cuts from vendors nearby.</p>
          <Link to="/marketplace"><Button variant="hero" size="lg" className="mt-6">Browse marketplace</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <div className="container py-6">
        <h1 className="font-display text-3xl font-bold mb-1">Your Cart</h1>
        <p className="text-sm text-muted-foreground mb-6">From <span className="font-semibold text-foreground">{vendor?.name}</span> · ETA {vendor?.etaMin} min</p>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {lines.map((l) => (
              <div key={l.itemId} className="glass-card rounded-2xl p-4 flex gap-4 items-center">
                <img src={l.item.image} alt={l.item.name} loading="lazy" className="h-20 w-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{l.item.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{l.item.category} · {formatINR(l.price)}/{l.item.unit}</p>
                  <div className="mt-2 inline-flex items-center gap-2 bg-primary/10 rounded-full p-1">
                    <button onClick={() => updateQty(l.itemId, +(l.qtyKg - 0.5).toFixed(1))} className="h-7 w-7 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                    <span className="text-sm font-bold w-12 text-center">{l.qtyKg} kg</span>
                    <button onClick={() => updateQty(l.itemId, +(l.qtyKg + 0.5).toFixed(1))} className="h-7 w-7 rounded-full bg-primary text-primary-foreground transition flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold">{formatINR(l.price * l.qtyKg)}</p>
                  <button onClick={() => removeFromCart(l.itemId)} className="mt-2 text-xs text-destructive hover:underline inline-flex items-center gap-1">
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive transition">Clear cart</button>
          </div>

          <aside className="glass-card rounded-2xl p-6 h-fit lg:sticky lg:top-24">
            <h3 className="font-display text-lg font-bold">Order summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <Row label={`Subtotal (${cart.length} items)`} value={formatINR(subtotal)} />
              <Row label="Estimated delivery" value="₹40" />
              <Row label="Taxes" value="calculated next" subtle />
            </div>
            <div className="my-4 border-t border-border" />
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold">Total</span>
              <span className="font-display text-2xl font-bold text-primary">{formatINR(subtotal + 40)}</span>
            </div>
            <Button variant="hero" size="lg" className="w-full mt-5" onClick={() => nav("/checkout")}>
              Proceed to checkout
            </Button>
            <p className="text-[11px] text-muted-foreground text-center mt-3">Slaughtered fresh on confirmation</p>
          </aside>
        </div>
      </div>
      <SupportFab />
    </div>
  );
};

const Row = ({ label, value, subtle }: { label: string; value: string; subtle?: boolean }) => (
  <div className={`flex justify-between ${subtle ? "text-muted-foreground" : ""}`}>
    <span>{label}</span><span className="font-medium">{value}</span>
  </div>
);

export default Cart;
