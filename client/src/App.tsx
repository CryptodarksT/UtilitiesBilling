import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import PaymentHistory from "@/pages/payment-history";
import PaymentSuccess from "@/pages/payment-success";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin-login";
import Support from "@/pages/support";
import ApiStatus from "@/pages/api-status";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/history" component={PaymentHistory} />
          <Route path="/payment-success" component={PaymentSuccess} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/support" component={Support} />
          <Route path="/api-status" component={ApiStatus} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="payoo-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
