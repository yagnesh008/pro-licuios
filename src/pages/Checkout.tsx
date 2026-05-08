import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { useApp, formatINR, effectivePrice } from "@/store/app";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { CreditCard, Wallet, Banknote, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

const methods = [
  { id: "upi", label: "UPI", icon: Wallet, hint: "GPay, PhonePe, Paytm" },
  { id: "card", label: "Card", icon: CreditCard, hint: "Credit / Debit" },
  { id: "cod", label: "Cash on delivery", icon: Banknote, hint: "Pay on arrival" },
];

const Checkout = () => {
  const { cart, items, vendors, cartVendorId, user, placeOrder, platformDiscount } = useApp();
  const nav = useNavigate();
  const [method, setMethod] = useState("upi");
  const vendor = vendors.find((v) => v.id === cartVendorId);

  const breakdown = useMemo(() => {
    const lines = cart.map((c) => {
      const it = items.find((i) => i.id === c.itemId)!;
      return { itemId: it.id, name: it.name, qtyKg: c.qtyKg, price: effectivePrice(it), mrp: it.pricePerKg };
    });
    const subtotal = lines.reduce((s, l) => s + l.mrp * l.qtyKg, 0);
    const itemTotalRaw = lines.reduce((s, l) => s + l.price * l.qtyKg, 0);
    const platformOff = Math.round((itemTotalRaw * platformDiscount) / 100);
    const itemTotal = itemTotalRaw - platformOff;
    const discount = subtotal - itemTotal;
    const cgst = Math.round(itemTotal * 0.025);
    const sgst = Math.round(itemTotal * 0.025);
    const delivery = 40;
    const total = itemTotal + cgst + sgst + delivery;
    return { lines, subtotal, itemTotal, discount, platformOff, cgst, sgst, delivery, total };
  }, [cart, items, platformDiscount]);

  if (!vendor || cart.length === 0) {
    nav("/cart");
    return null;
  }

  const submit = () => {
    const order = placeOrder({
      vendorId: vendor.id,
      lines: breakdown.lines.map((l) => ({ itemId: l.itemId, name: l.name, qtyKg: l.qtyKg, price: l.price })),
      subtotal: breakdown.itemTotal,
      discount: breakdown.discount,
      cgst: breakdown.cgst,
      sgst: breakdown.sgst,
      delivery: breakdown.delivery,
      total: breakdown.total,
      paymentMethod: methods.find((m) => m.id === method)!.label,
      address: user?.address || "",
      etaMin: vendor.etaMin,
    });
    toast.success("Order placed!");
    nav(`/track/${order.id}`);
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <div className="container py-6">
        <h1 className="font-display text-3xl font-bold mb-1">Order Preview</h1>
        <p className="text-sm text-muted-foreground mb-6">Review and confirm your fresh order</p>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><MapPin className="h-5 w-5" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold">Delivery address</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{user?.address}</p>
                </div>
                <button className="text-xs text-primary font-medium hover:underline">Change</button>
              </div>
              <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-success/10 text-success text-sm">
                <Clock className="h-4 w-4" />
                <span><strong>Delivered in ~{vendor.etaMin} min</strong> · slaughtered fresh on confirmation</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold mb-3">Payment method</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {methods.map((m) => {
                  const Icon = m.icon;
                  const active = method === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        active ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <p className="font-semibold mt-2 text-sm">{m.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.hint}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold mb-3">Items from {vendor.name}</h3>
              <div className="divide-y divide-border">
                {breakdown.lines.map((l) => (
                  <div key={l.itemId} className="py-2.5 flex justify-between text-sm">
                    <span>{l.name} <span className="text-muted-foreground">× {l.qtyKg} kg</span></span>
                    <span className="font-semibold">{formatINR(l.price * l.qtyKg)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="glass-card rounded-2xl p-6 h-fit lg:sticky lg:top-24">
            <h3 className="font-display text-lg font-bold">Bill summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Item total" value={formatINR(breakdown.itemTotal + breakdown.platformOff)} />
              {breakdown.platformOff > 0 && <Row label={`Platform discount (${platformDiscount}%)`} value={`− ${formatINR(breakdown.platformOff)}`} accent />}
              {breakdown.discount > 0 && <Row label="Item discounts" value={`− ${formatINR(breakdown.discount - breakdown.platformOff)}`} accent />}
              <Row label="CGST (2.5%)" value={formatINR(breakdown.cgst)} />
              <Row label="SGST (2.5%)" value={formatINR(breakdown.sgst)} />
              <Row label="Delivery fee" value={formatINR(breakdown.delivery)} />
            </div>
            <div className="my-4 border-t border-border" />
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold">To pay</span>
              <span className="font-display text-2xl font-bold text-primary">{formatINR(breakdown.total)}</span>
            </div>
            <Button variant="hero" size="lg" className="w-full mt-5" onClick={submit}>Place order</Button>
          </aside>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className={`font-medium ${accent ? "text-success" : ""}`}>{value}</span>
  </div>
);

export default Checkout;
