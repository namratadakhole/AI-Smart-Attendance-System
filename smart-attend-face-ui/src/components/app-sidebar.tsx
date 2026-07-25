import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Camera,
  Brain,
  Video,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  ScanFace,
  GraduationCap,
  BookOpen
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const facultyItems = [
  { title: "Faculty Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Live Attendance", url: "/attendance", icon: Video },
  { title: "Register Student", url: "/register-student", icon: Camera },
  { title: "Students Roster", url: "/students", icon: Users },
  { title: "Train AI Model", url: "/train", icon: Brain },
  { title: "Reports & History", url: "/records", icon: ClipboardList },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

const studentItems = [
  { title: "Student Dashboard", url: "/student-dashboard", icon: GraduationCap },
  { title: "My Attendance", url: "/student-dashboard", icon: ClipboardList },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();

  const [role, setRole] = useState<string>("faculty");

  useEffect(() => {
    const r = localStorage.getItem("userRole") || "faculty";
    setRole(r.toLowerCase());
  }, [pathname]);

  const navItems = role === "student" ? studentItems : facultyItems;

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    localStorage.removeItem("authToken");
    navigate({ to: "/login" as any });
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2.5 px-1 py-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
            <ScanFace className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div
                className="truncate text-sm font-bold text-foreground"
                style={{ fontFamily: "Sora, Inter, sans-serif" }}
              >
                SmartAttend AI
              </div>
              <div className="truncate text-xs text-muted-foreground capitalize">
                {role} Portal
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{role === "student" ? "Student Navigation" : "Faculty Controls"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active =
                  pathname === item.url ||
                  (item.url !== "/dashboard" && pathname.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout" className="text-destructive">
              <div className="flex items-center gap-3 cursor-pointer">
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
