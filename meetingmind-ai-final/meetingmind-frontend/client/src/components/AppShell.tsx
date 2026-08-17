import { useAuth } from "@/_core/hooks/useAuth";
import { menuConfig } from "@/lib/menu";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/useMobile";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  LayoutGrid,
  LogOut,
  Menu,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react";
import { CSSProperties, useMemo } from "react";
import { useLocation } from "wouter";

type AppShellProps = {
  children: React.ReactNode;
};

const SIDEBAR_WIDTH_PX = 280;

export function AppShell({ children }: AppShellProps) {
  const { user, logout } = useAuth();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${SIDEBAR_WIDTH_PX}px`,
        } as CSSProperties
      }
    >
      <div className="flex min-h-screen bg-background text-foreground">
        <LeftRail />
        <SidebarInset>
          <TopBar userName={user?.name ?? ""} onLogout={logout} />
          <main className="px-6 pb-8 pt-4 lg:px-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function LeftRail() {
  const [location, setLocation] = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const activeId = useMemo(
    () => menuConfig.menu.find(item => item.route === location)?.id,
    [location]
  );

  const iconFor = (id: string) => {
    switch (id) {
      case "dashboard":
        return LayoutGrid;
      case "meetings":
        return Workflow;
      case "conversations":
        return Sparkles;
      case "tasks":
        return Workflow;
      case "agents":
        return Sparkles;
      case "routing":
        return Workflow;
      case "models":
        return Sparkles;
      case "integrations":
        return Workflow;
      case "analytics":
        return Sparkles;
      case "admin":
        return Shield;
      case "help":
        return CircleHelp;
      default:
        return LayoutGrid;
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-card/40 backdrop-blur">
      <SidebarHeader className="h-16 border-b px-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary/90 via-primary to-primary/70 shadow-sm">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              MeetingMind AI
            </span>
            <span className="text-[11px] text-muted-foreground">
              Ops Console
            </span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarMenu className="space-y-1">
          {menuConfig.menu.map(item => {
            const Icon = iconFor(item.id);
            const isActive = item.id === activeId;
            const button = (
              <SidebarMenuButton
                key={item.id}
                isActive={isActive}
                onClick={() => setLocation(item.route)}
                className={cn(
                  "group h-9 rounded-lg text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={item.title}
              >
                <span className="relative flex h-4 w-4 items-center justify-center">
                  {isActive && (
                    <span className="absolute -left-2 h-6 w-[3px] rounded-full bg-primary" />
                  )}
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isActive && "text-primary group-hover:text-primary"
                    )}
                  />
                </span>
                <span className="truncate">{item.title}</span>
              </SidebarMenuButton>
            );

            return (
              <SidebarMenuItem key={item.id}>
                {isCollapsed ? (
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                ) : (
                  button
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t px-3 py-2">
        <CurrentUserCompact />
      </SidebarFooter>
    </Sidebar>
  );
}

type TopBarProps = {
  userName: string;
  onLogout: () => void;
};

function TopBar({ userName, onLogout }: TopBarProps) {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <div className="flex items-center gap-2 lg:hidden">
          <SidebarTrigger
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-card hover:bg-accent"
            aria-label="Toggle navigation"
          >
            <Menu className="h-4 w-4" />
          </SidebarTrigger>
        </div>

        <div className="flex flex-1 items-center justify-center lg:justify-start">
          <div className="relative w-full max-w-xl">
            <Input
              className="h-9 rounded-full border-muted-foreground/20 pl-9 text-sm shadow-sm"
              placeholder="Search meetings, actions, agents..."
              type="search"
              aria-label="Search across MeetingMind"
            />
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
              <LayoutGrid className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {!isMobile && (
            <Button
              size="sm"
              variant="outline"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full border-dashed"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs">New meeting import</span>
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="hidden h-9 w-9 rounded-full md:inline-flex"
            aria-label="Help and docs"
          >
            <CircleHelp className="h-4 w-4" />
          </Button>
          <UserMenu userName={userName} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}

type UserMenuProps = {
  userName: string;
  onLogout: () => void;
};

function UserMenu({ userName, onLogout }: UserMenuProps) {
  const initials =
    userName
      ?.split(" ")
      .map(part => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <button
      type="button"
      onClick={onLogout}
      className="inline-flex items-center gap-2 rounded-full border bg-card px-1.5 py-0.5 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Open user menu"
    >
      <Avatar className="h-7 w-7 border border-background">
        <AvatarImage alt={userName} />
        <AvatarFallback className="text-[11px] font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="max-w-[80px] truncate text-xs font-medium">
        {userName || "You"}
      </span>
      <ChevronDown className="mr-0.5 h-3 w-3 text-muted-foreground" />
      <LogOut className="ml-0.5 hidden h-3 w-3 text-muted-foreground sm:block" />
    </button>
  );
}

function CurrentUserCompact() {
  const { user } = useAuth();
  const initials =
    user?.name
      ?.split(" ")
      .map(part => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-2 py-1.5">
      <Avatar className="h-7 w-7 border border-background">
        <AvatarFallback className="text-[11px] font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium leading-tight">
          {user?.name || "Signed in"}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">
          Calm, productive workspace
        </p>
      </div>
    </div>
  );
}

