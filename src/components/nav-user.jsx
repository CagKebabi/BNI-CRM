"use client"

import { useState, useEffect } from "react"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/auth.service"

export function NavUser({user}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate();
  
  // Kullanıcı bilgilerini state olarak tutma
  const [userData, setUserData] = useState({
    name: user?.name || localStorage.getItem('user'),
    email: user?.email || ''
  });
  
  // Kullanıcı bilgilerini güncellemek için effect hook
  useEffect(() => {
    // Kullanıcı bilgilerini kontrol etmek için bir fonksiyon
    const checkUserInfo = () => {
      const currentUser = localStorage.getItem('user');
      
      if (currentUser !== userData.name) {
        setUserData(prevData => ({
          ...prevData,
          name: currentUser
        }));
      }
    };
    
    // İlk yüklemede kontrol et
    checkUserInfo();
    
    // localStorage değişikliklerini dinle
    window.addEventListener('storage', checkUserInfo);
    
    // Component unmount olduğunda event listener'ı temizle
    return () => {
      window.removeEventListener('storage', checkUserInfo);
    };
  }, [userData.name]);
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData.name}</span>
                <span className="truncate text-xs">{userData.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData.name}</span>
                  <span className="truncate text-xs">{userData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {/* <DropdownMenuItem>
                <BadgeCheck />
                Hesap
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Bildirimler
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut color="red" />
              <span className="text-red-500">Çıkış yap</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
