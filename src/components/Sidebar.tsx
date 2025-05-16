
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Search,
  User
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Sidebar() {
  const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();
  const isAdmin = userProfile?.role === 'admin';

  // Base menu items for all users
  const baseMenuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      id: 'dashboard-navigation'
    },
    {
      title: 'Claims',
      icon: FileText,
      path: '/claims',
      id: 'claims-navigation'
    }
  ];
  
  // Admin-specific menu items
  const adminMenuItems = [
    {
      title: 'Agents',
      icon: Users,
      path: '/agents',
      id: 'agents-navigation'
    }
  ];
  
  // Agent-specific menu items
  const agentMenuItems = [
    {
      title: 'Search',
      icon: Search,
      path: '/search',
      id: 'search-navigation'
    }
  ];
  
  // Settings available to all users
  const settingsMenuItem = {
    title: 'Settings',
    icon: Settings,
    path: '/settings',
    id: 'settings-navigation'
  };
  
  // Combine menu items based on user role
  const menuItems = [
    ...baseMenuItems,
    ...(isAdmin ? adminMenuItems : agentMenuItems),
    settingsMenuItem
  ];

  return (
    <SidebarComponent>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 pt-4">
          <div className="rounded-md bg-primary p-1">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold">Claims Manager</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path} id={item.id}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? 'text-primary' : 'text-sidebar-foreground'
                  }
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          {currentUser && userProfile && (
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userProfile.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{userProfile.role}</span>
              </div>
            </div>
          )}
          <Button 
            variant="outline" 
            className="w-full text-sidebar-foreground hover:text-primary"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
      <SidebarTrigger className="absolute top-3 right-0 translate-x-1/2 h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center" />
    </SidebarComponent>
  );
}
