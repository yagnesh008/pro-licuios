import { Link } from "react-router-dom";
import { useApp, Category } from "@/store/app";
import { Navbar, LocationStrip } from "@/components/layout/Navbar";
import { SupportFab } from "@/components/layout/SupportFab";
import { Star, Clock, MapPin, Fish, Drumstick, Beef, Shell } from "lucide-react";
import { useMemo, useState } from "react";
import heroImg from "@/assets/hero-meats.jpg";

type CatKey = Category | "prawns";

const catMeta: Record<CatKey, { label: string; icon: any; tint: string }> = {
  fish: { label: "Fish", icon: Fish, tint: "from-sky-500/20 to-primary/10" },
  prawns: { label: "Prawns & Shrimp", icon: Shell, tint: "from-pink-400/20 to-primary/10" },
  chicken: { label: "Chicken", icon: Drumstick, tint: "from-amber-400/20 to-primary/10" },
  mutton: { label: "Mutton", icon: Beef, tint: "from-primary/30 to-secondary/20" },
};

const Marketplace = () => {
  const { user, vendors, items } = useApp();
  const [filter, setFilter] = useState<CatKey | "all">("all");

  const isPrawnVendor = (v: typeof vendors[number]) =>
    items.some((it) => it.vendorId === v.id && /prawn|shrimp/i.test(it.name));

  const counts = useMemo(() => {
    const c: Record<CatKey, number> = { fish: 0, prawns: 0, chicken: 0, mutton: 0 };
    vendors.forEach((v) => {
      if (!v.online) return;
      v.categories.forEach((cat) => (c[cat] += 1));
      if (isPrawnVendor(v)) c.prawns += 1;
    });
    return c;
  }, [vendors, items]);

  const filtered =
    filter === "all"
      ? vendors
      : filter === "prawns"
      ? vendors.filter(isPrawnVendor)
      : vendors.filter((v) => v.categories.includes(filter));

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <LocationStrip address={user?.address} />

      {/* Hero */}
      <section className="container">
        <div className="relative overflow-hidden rounded-3xl shadow-elevated">
          <img src={heroImg} alt="Fresh meats" width={1600} height={900} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/70 to-transparent" />
          <div className="relative px-8 md:px-14 py-14 md:py-20 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-secondary-foreground/90 text-xs font-medium mb-5 border border-white/10">
              <span className="live-dot" /> Live market · 12 vendors online now
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-secondary-foreground leading-tight">
              Fresh & Live <span className="text-gradient">Near You</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-secondary-foreground/80 max-w-lg">
              Farm-fresh, slaughtered to order • Delivered in minutes
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#vendors" className="px-6 h-12 inline-flex items-center rounded-full bg-gradient-warm text-primary-foreground font-semibold shadow-warm hover:shadow-glow transition-all hover:-translate-y-0.5">
                Shop nearby vendors
              </a>
              <a href="#categories" className="px-6 h-12 inline-flex items-center rounded-full glass text-secondary-foreground hover:bg-white/10 transition border border-white/15">
                Browse categories
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="container mt-12">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Live Categories</h2>
            <p className="text-sm text-muted-foreground mt-1">Tap a category to filter live vendors</p>
          </div>
          <button onClick={() => setFilter("all")} className="text-sm font-medium text-primary hover:underline">
            View all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {(Object.keys(catMeta) as CatKey[]).map((cat, i) => {
            const Icon = catMeta[cat].icon;
            const active = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(active ? "all" : cat)}
                style={{ animationDelay: `${i * 80}ms` }}
                className={`group relative overflow-hidden text-left rounded-3xl p-6 glass-card hover:shadow-elevated transition-all hover:-translate-y-1 animate-fade-in-up ${
                  active ? "ring-2 ring-primary shadow-warm" : ""
                }`}
              >
                <div className={`absolute -right-10 -top-10 w-44 h-44 rounded-full bg-gradient-to-br ${catMeta[cat].tint} blur-2xl group-hover:scale-110 transition-transform`} />
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-warm flex items-center justify-center text-primary-foreground shadow-warm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold">{catMeta[cat].label}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="live-dot" />
                    <span><span className="font-semibold text-foreground">{counts[cat]}</span> vendors live</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Vendors */}
      <section id="vendors" className="container mt-12">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Vendors near you</h2>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} available · sorted by distance</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v, i) => {
            const itemCount = items.filter((it) => it.vendorId === v.id).length;
            return (
              <Link
                key={v.id}
                to={`/shop/${v.id}`}
                style={{ animationDelay: `${i * 60}ms` }}
                className="group block rounded-3xl overflow-hidden glass-card hover:shadow-elevated transition-all hover:-translate-y-1.5 animate-fade-in-up"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={v.cover} alt={v.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass text-xs font-semibold border border-white/20">
                    {v.online ? <><span className="live-dot" /> Live</> : <><span className="h-2 w-2 rounded-full bg-muted-foreground/50" /> Closed</>}
                  </div>
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/90 text-xs font-bold">
                    <Star className="h-3 w-3 fill-accent text-accent" /> {v.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">{v.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{v.tagline}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {v.distanceKm} km</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {v.etaMin} min</span>
                    <span className="ml-auto font-semibold text-foreground">{itemCount} items</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <SupportFab />
    </div>
  );
};

export default Marketplace;
