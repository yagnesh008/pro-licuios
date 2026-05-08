import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import StaffLogin from "./pages/StaffLogin";
import VendorLogin from "./pages/VendorLogin";
import AdminLogin from "./pages/AdminLogin";
import DeliveryLogin from "./pages/DeliveryLogin";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import VendorShop from "./pages/VendorShop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Track from "./pages/Track";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import VendorDashboard from "./pages/VendorDashboard";
import StaffOrders from "./pages/StaffOrders";
import AdminVendorDetail from "./pages/admin/AdminVendorDetail";
import { Protected } from "./components/layout/Protected";
import { StaffFab } from "./components/layout/StaffFab";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/delivery-login" element={<DeliveryLogin />} />
          <Route path="/register" element={<Register />} />

          {/* User routes — customers only */}
          <Route path="/marketplace" element={<Protected roles={["user"]}><Marketplace /></Protected>} />
          <Route path="/shop/:id" element={<Protected roles={["user"]}><VendorShop /></Protected>} />
          <Route path="/cart" element={<Protected roles={["user"]}><Cart /></Protected>} />
          <Route path="/checkout" element={<Protected roles={["user"]}><Checkout /></Protected>} />
          <Route path="/track/:id" element={<Protected roles={["user"]}><Track /></Protected>} />
          <Route path="/orders" element={<Protected roles={["user"]}><MyOrders /></Protected>} />

          {/* Vendor routes */}
          <Route path="/vendor" element={<Protected roles={["vendor"]}><VendorDashboard /></Protected>} />
          <Route path="/vendor/orders" element={<Protected roles={["vendor"]}><StaffOrders scope="vendor" /></Protected>} />

          {/* Admin routes */}
          <Route path="/admin" element={<Protected roles={["admin"]}><Admin /></Protected>} />
          <Route path="/admin/orders" element={<Protected roles={["admin"]}><StaffOrders scope="admin" /></Protected>} />
          <Route path="/admin/vendors/:id" element={<Protected roles={["admin"]}><AdminVendorDetail /></Protected>} />

          {/* Delivery routes */}
          <Route path="/delivery" element={<Protected roles={["delivery"]}><DeliveryDashboard /></Protected>} />
          <Route path="/delivery/orders" element={<Protected roles={["delivery"]}><StaffOrders scope="delivery" /></Protected>} />

          {/* Shared */}
          <Route path="/profile" element={<Protected><Profile /></Protected>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <StaffFab />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
