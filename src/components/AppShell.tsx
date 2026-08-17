import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Mic,
  MessageSquare,
  CheckSquare,
  Bot,
  Brain,
  GitBranch,
  Plug,
  FileText,
  Zap,
  BarChart3,
  Bell,
  Shield,
  HelpCircle,
  User,
  Search,
  Sparkles,
  Menu,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const NAV_GROUPS = [
  {
    label: "Core",
    items: [
      { id: "dashboard", title: "Dashboard", route: "/dashboard", icon: LayoutDashboard },
      { id: "meetings", title: "Meetings", route: "/meetings", icon: Mic },
      { id: "conversations", title: "Conversations", route: "/conversations", icon: MessageSquare },
      { id: "tasks", title: "Tasks", route: "/tasks", icon: CheckSquare },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { id: "agents", title: "Agents", route: "/agents", icon: Bot },
      { id: "models", title: "Models", route: "/models", icon: Brain },
      { id: "routing", title: "Routing", route: "/routing", icon: GitBranch },
    ],
  },
  {
    label: "Platform",
    items: [
      { id: "integrations", title: "Integrations", route: "/integrations", icon: Plug },
      { id: "templates", title: "Templates", route: "/templates", icon: FileText },
      { id: "automation", title: "Automation", route: "/automation", icon: Zap },
      { id: "analytics", title: "Analytics", route: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { id: "notifications", title: "Notifications", route: "/notifications", icon: Bell },
      { id: "admin", title: "Admin", route: "/admin", icon: Shield },
      { id: "help", title: "Help", route: "/help", icon: HelpCircle },
      { id: "profile", title: "Profile", route: "/profile", icon: User },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 px-4 pb-8 pt-4 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card/40 backdrop-blur">
      <SidebarHeader className="h-16 border-b border-border px-3 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary/90 via-primary to-glow-secondary shadow-sm">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">MeetingMind AI</span>
              <span className="text-[11px] text-muted-foreground">Ops Console</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.route || location.pathname.startsWith(item.route + "/");
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`group h-9 rounded-lg text-sm font-medium transition-all duration-150 ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        }`}
                      >
                        <Link to={item.route}>
                          <span className="relative flex h-4 w-4 items-center justify-center">
                            {isActive && (
                              <span className="absolute -left-2.5 h-5 w-[3px] rounded-full bg-primary" />
                            )}
                            <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                          </span>
                          {!collapsed && <span className="truncate">{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border px-3 py-3">
        {!collapsed && (
          <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-2">
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-semibold text-primary">
              U
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">User</p>
              <p className="truncate text-[11px] text-muted-foreground">Calm, productive workspace</p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

function TopBar() {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
        <SidebarTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent/10 transition" />

        <div className="flex flex-1 items-center justify-center lg:justify-start">
          <div className="relative w-full max-w-md">
            <input
              className="h-9 w-full rounded-full border border-border bg-secondary/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
              placeholder="Search meetings, actions, agents…"
              type="search"
            />
            <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {!isMobile && (
            <Link
              to="/demo"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Try AI Demo
            </Link>
          )}
          <Link
            to="/notifications"
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-secondary/50 transition"
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default AppShell;
