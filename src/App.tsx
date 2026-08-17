import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DemoPage from "./pages/Demo";
import AppShell from "./components/AppShell";

// App pages (inside sidebar shell)
import DashboardPage from "./pages/app/DashboardPage";
import MeetingsPage from "./pages/app/MeetingsPage";
import MeetingDetailPage from "./pages/app/MeetingDetailPage";
import ConversationsPage from "./pages/app/ConversationsPage";
import TasksPage from "./pages/app/TasksPage";
import AgentsPage from "./pages/app/AgentsPage";
import ModelsPage from "./pages/app/ModelsPage";
import RoutingPage from "./pages/app/RoutingPage";
import IntegrationsPage from "./pages/app/IntegrationsPage";
import TemplatesPage from "./pages/app/TemplatesPage";
import AutomationPage from "./pages/app/AutomationPage";
import AnalyticsPage from "./pages/app/AnalyticsPage";
import NotificationsPage from "./pages/app/NotificationsPage";
import AdminPage from "./pages/app/AdminPage";
import HelpPage from "./pages/app/HelpPage";
import ProfilePage from "./pages/app/ProfilePage";

const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing / marketing pages */}
          <Route path="/" element={<Index />} />
          <Route path="/demo" element={<DemoPage />} />

          {/* App pages with sidebar shell */}
          <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/meetings" element={<AppLayout><MeetingsPage /></AppLayout>} />
          <Route path="/meetings/:id" element={<AppLayout><MeetingDetailPage /></AppLayout>} />
          <Route path="/conversations" element={<AppLayout><ConversationsPage /></AppLayout>} />
          <Route path="/tasks" element={<AppLayout><TasksPage /></AppLayout>} />
          <Route path="/agents" element={<AppLayout><AgentsPage /></AppLayout>} />
          <Route path="/models" element={<AppLayout><ModelsPage /></AppLayout>} />
          <Route path="/routing" element={<AppLayout><RoutingPage /></AppLayout>} />
          <Route path="/integrations" element={<AppLayout><IntegrationsPage /></AppLayout>} />
          <Route path="/templates" element={<AppLayout><TemplatesPage /></AppLayout>} />
          <Route path="/automation" element={<AppLayout><AutomationPage /></AppLayout>} />
          <Route path="/analytics" element={<AppLayout><AnalyticsPage /></AppLayout>} />
          <Route path="/notifications" element={<AppLayout><NotificationsPage /></AppLayout>} />
          <Route path="/admin" element={<AppLayout><AdminPage /></AppLayout>} />
          <Route path="/help" element={<AppLayout><HelpPage /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><ProfilePage /></AppLayout>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
