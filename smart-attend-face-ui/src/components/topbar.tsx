import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const [now, setNow] = useState<Date | null>(null);
  const [userName, setUserName] = useState("Dr. A. Sharma");
  const [userRole, setUserRole] = useState("professor");
  const [department, setDepartment] = useState("Computer Science & Engineering");

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem("userRole");
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        if (userObj.name) setUserName(userObj.name);
        // Fallback checks for potential full_name keys
        else if (userObj.full_name) setUserName(userObj.full_name);
        
        if (userObj.department) setDepartment(userObj.department);
      }
      if (storedRole) {
        setUserRole(storedRole);
      }
    } catch (e) {
      console.error("Error reading userData from localStorage", e);
    }
  }, []);

  const dateStr =
    now?.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }) ?? "";
  const timeStr =
    now?.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) ?? "";

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-background/85 backdrop-blur-xl border-border/80">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 sm:gap-4 h-full px-3 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <SidebarTrigger />
          <div className="hidden md:flex min-w-0 flex-col leading-tight">
            <span className="text-sm font-semibold truncate text-foreground">
              Welcome, {userRole === "professor" ? "Professor" : "Student"} 👋
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {dateStr} · {timeStr}
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center min-w-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students, records, reports…"
              className="pl-9 h-10 bg-muted/50 border-0"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
          </Button>
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-semibold text-foreground">{userName}</span>
            <span className="text-xs text-muted-foreground truncate max-w-[180px]">{department}</span>
          </div>
          <Avatar className="h-9 w-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=3b82f6`} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
