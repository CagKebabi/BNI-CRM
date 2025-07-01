import * as React from "react"
import { useState, useEffect } from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import bniLogo from "@/assets/bni-2020-seeklogo.png"

// localStorage değerleri artık doğrudan burada alınmayacak

// This is sample data.
const data = {
  user: {
    //name: user,
    //email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "BNI",
      logo: () => <img src={bniLogo} alt="BNI Logo" />,
      plan: "Enterprise",
    },
    {
      name: "BNI",
      logo: () => <img src={bniLogo} alt="BNI Logo" />,
      plan: "Startup",
    },
    {
      name: "BNI",
      logo: () => <img src={bniLogo} alt="BNI Logo" />,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Kullanıcılar",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        // {
        //   title: "Yeni Kullanıcı",
        //   url: "/create-user",
        // },
        {
          title: "Kullanıcılar",
          url: "/user-list",
        },
      ]
    },
    {
      title: "Organizasyon",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Ülkeler",
          url: "/country-list",
        },
        {
          title: "Bölgeler",
          url: "/region-list",
        },
        {
          title: "Gruplar",
          url: "/group-list",
        },
      ]
    },
    // {
    //   title: "Models",
    //   url: "/test-page-2",
    //   icon: Bot,
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    // },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "/test-page-2",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "/test-page-3",
      icon: Map,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  // State hook'ları ile kullanıcı bilgilerini saklama
  const [username, setUsername] = useState(localStorage.getItem('user'));
  const [isSuperuser, setIsSuperuser] = useState(localStorage.getItem('is_superuser') === 'true');

  // Kullanıcı bilgilerini güncellemek için effect hook
  useEffect(() => {
    // Kullanıcı bilgilerini kontrol etmek için bir fonksiyon
    const checkUserInfo = () => {
      const currentUser = localStorage.getItem('user');
      const currentSuperuser = localStorage.getItem('is_superuser') === 'true';
      
      if (currentUser !== username) {
        setUsername(currentUser);
      }
      
      if (currentSuperuser !== isSuperuser) {
        setIsSuperuser(currentSuperuser);
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
  }, [username, isSuperuser]);

  // User data'sını güncelle
  data.user.name = username;
  
  // Filter navigation items based on superuser status
  const filteredNavItems = data.navMain.map(item => {
    // Only show "Kullanıcılar" to superusers
    if (item.title === "Kullanıcılar") {
      return isSuperuser ? item : null;
    }
    
    // For "Organizasyon" menu, filter its sub-items
    if (item.title === "Organizasyon") {
      // Create a copy of the item
      const modifiedItem = { ...item };
      
      // Filter sub-items to only show "Gruplar" for non-superusers
      if (!isSuperuser && modifiedItem.items) {
        modifiedItem.items = modifiedItem.items.filter(subItem => 
          subItem.title === "Gruplar"
        );
      }
      
      return modifiedItem;
    }
    
    // Show other items to all users
    return item;
  }).filter(Boolean); // Remove null items

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavItems} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
