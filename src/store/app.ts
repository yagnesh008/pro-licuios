// Lightweight global app store for demo/auth/cart/orders. No backend required for v1.
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "user" | "vendor" | "admin" | "delivery";

export interface User {
  id: string;
  name: string;
  contact: string;
  address?: string;
  role: Role;
  vendorId?: string;
}

export type Category = "fish" | "chicken" | "mutton";

export interface Item {
  id: string;
  vendorId: string;
  name: string;
  category: Category;
  pricePerKg: number;
  discount?: number; // percent
  unit: string;
  image: string;
}

export interface Vendor {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  distanceKm: number;
  etaMin: number;
  online: boolean;
  cover: string;
  categories: Category[];
}

export interface CartLine {
  itemId: string;
  qtyKg: number;
}

export type OrderStatus = "processing" | "packed" | "out_for_delivery" | "delivered";

export interface Order {
  id: string;
  userId: string;
  vendorId: string;
  lines: { itemId: string; name: string; qtyKg: number; price: number }[];
  subtotal: number;
  discount: number;
  cgst: number;
  sgst: number;
  delivery: number;
  total: number;
  paymentMethod: string;
  address: string;
  etaMin: number;
  status: OrderStatus;
  createdAt: number;
  rating?: number;
}

interface AppState {
  user: User | null;
  cart: CartLine[];
  cartVendorId: string | null;
  orders: Order[];
  vendors: Vendor[];
  items: Item[];
  login: (u: User) => void;
  logout: () => void;
  register: (u: Omit<User, "id" | "role"> & { password: string }) => void;
  addToCart: (itemId: string, vendorId: string, qtyKg?: number) => void;
  updateQty: (itemId: string, qtyKg: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  placeOrder: (o: Omit<Order, "id" | "createdAt" | "status" | "userId">) => Order;
  advanceOrder: (orderId: string) => void;
  rateOrder: (orderId: string, rating: number) => void;
  removeVendor: (vendorId: string) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, patch: Partial<Item>) => void;
  addItem: (item: Omit<Item, "id">) => void;
  addVendor: (vendor: Omit<Vendor, "id" | "rating" | "distanceKm" | "etaMin" | "online">) => void;
  platformDiscount: number; // percent applied to item totals
  setPlatformDiscount: (pct: number) => void;
}

import fishImg from "@/assets/cat-fish.jpg";
import chickenImg from "@/assets/cat-chicken.jpg";
import muttonImg from "@/assets/cat-mutton.jpg";

const seedVendors: Vendor[] = [
  { id: "v1", name: "Coastal Catch Co.", tagline: "Same-day harbor fish", rating: 4.8, distanceKm: 1.2, etaMin: 25, online: true, cover: fishImg, categories: ["fish"] },
  { id: "v2", name: "Golden Coop Farms", tagline: "Free-range chicken, daily fresh", rating: 4.9, distanceKm: 0.8, etaMin: 20, online: true, cover: chickenImg, categories: ["chicken"] },
  { id: "v3", name: "Highland Mutton House", tagline: "Pasture-raised, hand-cut", rating: 4.7, distanceKm: 2.4, etaMin: 35, online: true, cover: muttonImg, categories: ["mutton"] },
  { id: "v4", name: "Harbor & Hearth", tagline: "Fish & seafood specialists", rating: 4.6, distanceKm: 1.9, etaMin: 30, online: true, cover: fishImg, categories: ["fish"] },
  { id: "v5", name: "The Butcher's Block", tagline: "Premium cuts, butcher's choice", rating: 4.8, distanceKm: 3.1, etaMin: 40, online: false, cover: muttonImg, categories: ["chicken", "mutton"] },
  { id: "v6", name: "Marina Fresh", tagline: "Wild-caught seafood & prawns", rating: 4.5, distanceKm: 2.7, etaMin: 32, online: true, cover: fishImg, categories: ["fish"] },
  { id: "v7", name: "Prawn Paradise", tagline: "Tiger prawns & shrimp daily", rating: 4.9, distanceKm: 1.5, etaMin: 28, online: true, cover: fishImg, categories: ["fish"] },
];

const seedItems: Item[] = [
  { id: "i1", vendorId: "v1", name: "Sea Bass (whole)", category: "fish", pricePerKg: 680, unit: "kg", image: fishImg },
  { id: "i2", vendorId: "v1", name: "Pomfret Silver", category: "fish", pricePerKg: 920, discount: 10, unit: "kg", image: fishImg },
  { id: "i3", vendorId: "v1", name: "King Prawns", category: "fish", pricePerKg: 1200, unit: "kg", image: fishImg },
  { id: "i4", vendorId: "v2", name: "Chicken Breast", category: "chicken", pricePerKg: 320, unit: "kg", image: chickenImg },
  { id: "i5", vendorId: "v2", name: "Whole Chicken", category: "chicken", pricePerKg: 260, discount: 8, unit: "kg", image: chickenImg },
  { id: "i6", vendorId: "v2", name: "Boneless Thigh", category: "chicken", pricePerKg: 380, unit: "kg", image: chickenImg },
  { id: "i7", vendorId: "v3", name: "Mutton Curry Cut", category: "mutton", pricePerKg: 880, unit: "kg", image: muttonImg },
  { id: "i8", vendorId: "v3", name: "Mutton Chops", category: "mutton", pricePerKg: 1100, discount: 12, unit: "kg", image: muttonImg },
  { id: "i9", vendorId: "v3", name: "Mutton Mince", category: "mutton", pricePerKg: 820, unit: "kg", image: muttonImg },
  { id: "i10", vendorId: "v4", name: "Tiger Prawns", category: "fish", pricePerKg: 980, discount: 5, unit: "kg", image: fishImg },
  { id: "i11", vendorId: "v4", name: "Salmon Fillet", category: "fish", pricePerKg: 1450, unit: "kg", image: fishImg },
  { id: "i12", vendorId: "v6", name: "Mackerel", category: "fish", pricePerKg: 420, unit: "kg", image: fishImg },
  { id: "i13", vendorId: "v6", name: "Jumbo Prawns", category: "fish", pricePerKg: 1350, unit: "kg", image: fishImg },
  { id: "i14", vendorId: "v7", name: "Tiger Prawns (Large)", category: "fish", pricePerKg: 1280, discount: 10, unit: "kg", image: fishImg },
  { id: "i15", vendorId: "v7", name: "White Shrimp", category: "fish", pricePerKg: 760, unit: "kg", image: fishImg },
  { id: "i16", vendorId: "v7", name: "Prawns Curry Cut", category: "fish", pricePerKg: 880, unit: "kg", image: fishImg },
];

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      cart: [],
      cartVendorId: null,
      orders: [],
      vendors: seedVendors,
      items: seedItems,
      platformDiscount: 0,
      setPlatformDiscount: (pct) => set({ platformDiscount: Math.max(0, Math.min(90, pct)) }),
      addItem: (item) => set({ items: [...get().items, { ...item, id: `i_${Date.now()}` }] }),
      addVendor: (v) =>
        set({
          vendors: [
            ...get().vendors,
            { ...v, id: `v_${Date.now()}`, rating: 4.5, distanceKm: 2, etaMin: 30, online: true },
          ],
        }),

      login: (u) => set({ user: u }),
      logout: () => set({ user: null, cart: [], cartVendorId: null }),
      register: ({ name, contact, address }) =>
        set({ user: { id: `u_${Date.now()}`, name, contact, address, role: "user" } }),

      addToCart: (itemId, vendorId, qtyKg = 0.5) => {
        const { cart, cartVendorId } = get();
        if (cartVendorId && cartVendorId !== vendorId) {
          set({ cart: [{ itemId, qtyKg }], cartVendorId: vendorId });
          return;
        }
        const existing = cart.find((c) => c.itemId === itemId);
        if (existing) {
          set({ cart: cart.map((c) => (c.itemId === itemId ? { ...c, qtyKg: c.qtyKg + qtyKg } : c)) });
        } else {
          set({ cart: [...cart, { itemId, qtyKg }], cartVendorId: vendorId });
        }
      },
      updateQty: (itemId, qtyKg) =>
        set({ cart: get().cart.map((c) => (c.itemId === itemId ? { ...c, qtyKg } : c)).filter((c) => c.qtyKg > 0) }),
      removeFromCart: (itemId) => {
        const cart = get().cart.filter((c) => c.itemId !== itemId);
        set({ cart, cartVendorId: cart.length ? get().cartVendorId : null });
      },
      clearCart: () => set({ cart: [], cartVendorId: null }),

      placeOrder: (o) => {
        const user = get().user!;
        const order: Order = {
          ...o,
          id: `ORD${Math.floor(Math.random() * 90000) + 10000}`,
          userId: user.id,
          status: "processing",
          createdAt: Date.now(),
        };
        set({ orders: [order, ...get().orders], cart: [], cartVendorId: null });
        return order;
      },
      advanceOrder: (orderId) => {
        const flow: OrderStatus[] = ["processing", "packed", "out_for_delivery", "delivered"];
        set({
          orders: get().orders.map((o) => {
            if (o.id !== orderId) return o;
            const i = flow.indexOf(o.status);
            return { ...o, status: flow[Math.min(i + 1, flow.length - 1)] };
          }),
        });
      },
      rateOrder: (orderId, rating) =>
        set({ orders: get().orders.map((o) => (o.id === orderId ? { ...o, rating } : o)) }),

      removeVendor: (vendorId) =>
        set({
          vendors: get().vendors.filter((v) => v.id !== vendorId),
          items: get().items.filter((i) => i.vendorId !== vendorId),
        }),
      removeItem: (itemId) => set({ items: get().items.filter((i) => i.id !== itemId) }),
      updateItem: (itemId, patch) =>
        set({ items: get().items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) }),
    }),
    { name: "prolicious-store-v2" }
  )
);

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const effectivePrice = (item: Item) =>
  item.discount ? Math.round(item.pricePerKg * (1 - item.discount / 100)) : item.pricePerKg;
