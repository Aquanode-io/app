"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar({
  onMobileMenuToggle,
}: {
  onMobileMenuToggle?: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, displayName, signOut, isLoading, accessToken } =
    useAuthSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Check if we're in the app section to display the menu toggle
  const isAppSection = pathname?.startsWith("/app") ?? false;

  if (!mounted || isLoading) {
    return null;
  }

  return (
    <nav className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
      <div className="flex justify-between h-16 items-center px-6 max-w-[129rem] mx-auto">
        <div className="flex items-center gap-3">
          {isAppSection && onMobileMenuToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300"
              onClick={onMobileMenuToggle}
            >
              <Menu size={20} />
            </Button>
          )}
          {/* Logo removed - now in sidebar */}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center space-x-4"></div>
          {isAuthenticated ? (
            <>
              <Link href="/app/services">
                <Button
                    variant="secondary"
                    className="flex items-center gap-2 bg-card/80 hover:bg-accent/10 text-accent hover:border-accent/40 shadow-sm transition-all duration-300 border-accent/40"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Services</span>
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2 bg-card/80 hover:bg-accent/10 hover:text-accent hover:border-accent/40 shadow-sm transition-all duration-300"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-card/90 backdrop-blur-md border-border/60 shadow-xl shadow-black/30"
                >
                  <DropdownMenuLabel className="text-foreground/90">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/40" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors duration-300"
                  >
                    <LogOut className="w-4 h-4 mr-2 opacity-70" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="secondary"
                  className="bg-card/80 hover:bg-accent/10 hover:text-accent hover:border-accent/40 shadow-sm transition-all duration-300"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <User className="w-4 h-4 sm:hidden" />
                </Button>
              </Link>
              <Link href="/app/services">
                <Button className="btn-primary btn-md hidden sm:flex">
                  Launch App
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
