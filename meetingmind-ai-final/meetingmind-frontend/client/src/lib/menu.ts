export type MenuIconId =
  | "grid"
  | "calendar"
  | "message"
  | "check"
  | "robot"
  | "flow"
  | "chip"
  | "puzzle"
  | "chart"
  | "shield"
  | "help";

export type MenuItem = {
  id: string;
  title: string;
  icon: MenuIconId;
  route: string;
};

export type MenuConfig = {
  menu: MenuItem[];
};

// Global navigation configuration used by the dashboard AppShell.
// This mirrors the spec-provided JSON so it can be consumed in code.
export const menuConfig: MenuConfig = {
  menu: [
    // Mirrors the spec JSON from the Data Sources prompt pack.
    { id: "dashboard", title: "Dashboard", icon: "grid", route: "/" },
    { id: "meetings", title: "Meetings", icon: "calendar", route: "/meetings" },
    { id: "agents", title: "Agents", icon: "robot", route: "/agents" },
    { id: "models", title: "Models", icon: "chip", route: "/models" },
    {
      id: "routing",
      title: "Routing & Orchestration",
      icon: "flow",
      route: "/routing",
    },
    {
      id: "integrations",
      title: "Integrations",
      icon: "puzzle",
      route: "/integrations",
    },
    {
      id: "data_sources",
      title: "Data Sources",
      icon: "flow",
      route: "/data-sources",
    },
    {
      id: "mapping",
      title: "Schema & Mapping",
      icon: "flow",
      route: "/data-sources/mapping",
    },
    {
      id: "lineage",
      title: "Data Lineage",
      icon: "flow",
      route: "/data-sources/lineage",
    },
    {
      id: "ingest_monitor",
      title: "Ingest Monitor",
      icon: "flow",
      route: "/data-sources/monitor",
    },
    {
      id: "privacy",
      title: "Privacy & PII",
      icon: "shield",
      route: "/data-sources/privacy",
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: "chart",
      route: "/analytics",
    },
    { id: "admin", title: "Admin", icon: "shield", route: "/admin" },
    {
      id: "help",
      title: "Help & Docs",
      icon: "help",
      route: "/help",
    },
  ],
};

