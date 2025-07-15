import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Home from "@/pages/home";
import PaymentHistory from "@/pages/payment-history";
import PaymentSuccess from "@/pages/payment-success";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import CardManager from "@/components/cards/card-manager";
import { useState } from "react";

function AuthenticatedRouter() {
  const { user, userData, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <Register onBack={() => setShowRegister(false)} />
    ) : (
      <Login onRegister={() => setShowRegister(true)} />
    );
  }

  if (!userData) {
    return <Register onBack={() => setShowRegister(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/history" component={PaymentHistory} />
          <Route path="/payment-success" component={PaymentSuccess} />
          <Route path="/cards" component={CardManager} />
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
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <AuthenticatedRouter />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
