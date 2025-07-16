import { Link, useLocation } from "wouter";
import { Wallet, Menu, Bell, UserCircle2, Shield, Activity, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Header() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Trang chủ", active: location === "/" },
    { href: "/history", label: "Lịch sử", active: location === "/history" },
    { href: "/support", label: "Hỗ trợ", active: location === "/support", icon: <HelpCircle className="h-4 w-4" /> },
    { href: "/api-status", label: "API Status", active: location === "/api-status", icon: <Activity className="h-4 w-4" /> },
    { href: "/admin-login", label: "Quản trị", active: location === "/admin-login", icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b border-border theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Wallet className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <span className="text-xl font-semibold text-foreground theme-transition">Payoo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium theme-transition-fast ${
                  item.active
                    ? "text-primary border-b-2 border-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-accent"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 theme-transition">
              System OK
            </Badge>
            <Button variant="ghost" size="sm" className="button-transition">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="button-transition">
              <UserCircle2 className="h-4 w-4" />
            </Button>
            <ThemeToggle />

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden button-transition">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] theme-transition">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-2 mb-6">
                    <div className="flex items-center space-x-2">
                      <Wallet className="h-6 w-6 text-primary" />
                      <span className="text-lg font-semibold">Payoo</span>
                    </div>
                    <ThemeToggle />
                  </div>
                  <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium theme-transition-fast ${
                          item.active
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-primary hover:bg-accent"
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
