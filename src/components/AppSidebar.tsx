import {
  LayoutDashboard, Users, GraduationCap, ClipboardList, CalendarCheck,
  Settings, BookOpen, Shield, FileText, Search as SearchIcon
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSchool } from "@/contexts/SchoolContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const allItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, roles: ["super_admin", "admin", "registrar", "teacher", "student"] },
  { title: "Students", url: "/students", icon: Users, roles: ["super_admin", "admin", "registrar", "teacher"] },
  { title: "Teachers", url: "/teachers", icon: GraduationCap, roles: ["super_admin", "admin"] },
  { title: "Courses", url: "/courses", icon: BookOpen, roles: ["super_admin", "admin", "teacher", "student"] },
  { title: "Grades", url: "/grades", icon: ClipboardList, roles: ["super_admin", "admin", "teacher", "student"] },
  { title: "Attendance", url: "/attendance", icon: CalendarCheck, roles: ["super_admin", "admin", "teacher"] },
  { title: "Audit Logs", url: "/audit", icon: FileText, roles: ["super_admin"] },
  { title: "Verification", url: "/verify", icon: SearchIcon, roles: ["super_admin", "admin", "registrar"] },
];

const bottomItems = [
  { title: "Settings", url: "/settings", icon: Settings, roles: ["super_admin", "admin"] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user } = useAuth();
  const { settings } = useSchool();

  const role = user?.role || "student";
  const visibleMain = allItems.filter(item => item.roles.includes(role));
  const visibleBottom = bottomItems.filter(item => item.roles.includes(role));

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-sidebar">
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
          <img src={settings.logo} alt={settings.name} className="h-10 w-10 rounded-full object-cover" />
          {!collapsed && (
            <div>
              <h1 className="font-display text-sm font-bold text-sidebar-foreground leading-tight">
                {settings.name}
              </h1>
              <p className="text-xs text-sidebar-foreground/60">{settings.subtitle}</p>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleBottom.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <NavLink
                        to={item.url}
                        className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
