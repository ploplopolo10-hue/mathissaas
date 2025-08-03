import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Menu, X, User, LogOut, Settings, CreditCard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Entraînement", href: "/training" },
    { name: "Nutrition", href: "/nutrition" },
    { name: "Mental", href: "/mental" },
    { name: "Productivité", href: "/productivity" },
  ];

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard">
            <div className="text-2xl font-bold gradient-text cursor-pointer">
              NOVAIA
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <button className="text-gray-300 hover:text-primary transition-colors duration-300 px-3 py-2 text-sm font-medium">
                    {item.name}
                  </button>
                </Link>
              ))}
            </div>
          </div>
          
          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/pricing">
              <Button variant="outline" size="sm" className="glass-button">
                <CreditCard className="h-4 w-4 mr-2" />
                Tarifs
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || 'User'} />
                    <AvatarFallback className="bg-primary text-white">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-card border border-white/20" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-white">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user?.email
                      }
                    </p>
                    {user?.email && (
                      <p className="w-[200px] truncate text-sm text-gray-400">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <Link href="/dashboard">
                  <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/pricing">
                  <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Abonnement</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-white hover:bg-white/10 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-primary block px-3 py-2 text-base font-medium w-full text-left"
                >
                  {item.name}
                </button>
              </Link>
            ))}
            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="flex items-center px-3 py-2">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || 'User'} />
                  <AvatarFallback className="bg-primary text-white">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-white font-medium">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email
                    }
                  </div>
                  <div className="text-gray-400 text-sm">{user?.email}</div>
                </div>
              </div>
              <Link href="/pricing">
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-primary block px-3 py-2 text-base font-medium w-full text-left"
                >
                  Tarifs
                </button>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-300 hover:text-primary block px-3 py-2 text-base font-medium w-full text-left"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
