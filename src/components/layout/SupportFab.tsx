import { Headset } from "lucide-react";
import { useState } from "react";

export const SupportFab = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-warm text-primary-foreground shadow-warm hover:shadow-glow animate-glow-pulse flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        aria-label="Support"
      >
        <Headset className="h-6 w-6" />
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-72 glass-card rounded-2xl p-5 animate-scale-in shadow-elevated">
          <h4 className="font-display text-lg font-semibold mb-1">Need a hand?</h4>
          <p className="text-sm text-muted-foreground mb-3">Chat with our concierge — orders, vendors, anything.</p>
          <button className="w-full h-10 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition">
            Start chat
          </button>
          <button className="w-full mt-2 h-10 rounded-full border border-border text-sm hover:bg-accent/20 transition">
            Call vendor
          </button>
        </div>
      )}
    </>
  );
};
