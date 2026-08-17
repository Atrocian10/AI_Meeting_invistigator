import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import DataSourcesIndex from "@/pages/DataSourcesIndex";
import AddConnectorWizard from "@/pages/AddConnectorWizard";
import MappingEditor from "@/pages/MappingEditor";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Demo from "./pages/Demo";
import About from "./pages/About";
import Meetings from "./pages/Meetings";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-1">
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/features"} component={Features} />
          <Route path={"/pricing"} component={Pricing} />
          <Route path={"/demo"} component={Demo} />
          <Route path={"/meetings"} component={Meetings} />
          <Route path={"/dashboard"} component={Dashboard} />
          <Route path={"/data-sources"} component={DataSourcesIndex} />
          <Route path={"/data-sources/add"} component={AddConnectorWizard} />
          <Route path={"/data-sources/mapping"} component={MappingEditor} />
          <Route path={"/about"} component={About} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
