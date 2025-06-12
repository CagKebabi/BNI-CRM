import * as React from "react"
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

const user = localStorage.getItem('user');

// This is sample data.
const data = {
  user: {
    name: user,
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
        {
          title: "Yeni Kullanıcı",
          url: "/create-user",
        },
        {
          title: "Kullanıcılar",
          url: "/test-page-2",
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
          title: "Yeni Ülke",
          url: "/create-country",
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
