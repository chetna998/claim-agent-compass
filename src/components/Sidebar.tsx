
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
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
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
    },
    {
      title: 'Agents',
      icon: Users,
      path: '/agents',
      id: 'agents-navigation'
    },
    {
      title: 'Search',
      icon: Search,
      path: '/search',
      id: 'search-navigation'
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings',
      id: 'settings-navigation'
    }
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
          {currentUser && (
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{currentUser.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{currentUser.role}</span>
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
