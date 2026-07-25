import { createFileRoute, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/topbar";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUserStr = localStorage.getItem("userData");
    const role = localStorage.getItem("userRole");

    // Route Protection: Unauthenticated users redirected to Login
    if (!savedUserStr || !role) {
      navigate({ to: "/login" as any });
      return;
    }

    const path = location.pathname;

    // Faculty dashboard protection
    if (path.includes("/dashboard") && role !== "professor" && role !== "faculty") {
      navigate({ to: "/student-dashboard" as any });
    }

    // Student dashboard protection
    if (path.includes("/student-dashboard") && role !== "student") {
      navigate({ to: "/dashboard" as any });
    }
  }, [location.pathname, navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
