import * as React from "react";
import {
  Grip,
  LifeBuoy,
  Percent,
  PersonStanding,
  Send,
  Store,
  ShoppingBag,
  Star,
  HandCoins,
  Truck,
  MapPin,
  Settings,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";
import { useMe } from "@/hooks/useMe";
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/models",
      icon: Grip,
      isAccardion: false,
      acardionItems: [
        {
          title: "Products",
          url: "/products",
        },
      ],
    },
    {
      title: "Online Shop",
      url: "/online-shop",
      icon: Store,
      isActive: true,
      isAccardion: true,
      acardionItems: [
        {
          title: "Products",
          url: "/products",
        },
        {
          title: "Categories",
          url: "/categories",
        },
        {
          title: "Import",
          url: "/import/products",
        },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: PersonStanding,
      isActive: true,
      isAccardion: false,
      acardionItems: [
        {
          title: "Products",
          url: "/products",
        },
      ],
    },
    {
      title: "Sales",
      url: "/sales",
      icon: ShoppingBag,
      isActive: true,
      isAccardion: true,
      acardionItems: [
        {
          title: "All sales",
          url: "/sales",
        },
        {
          title: "Settings",
          url: "/sales/settings",
        },
      ],
    },
    {
      title: "Marketing",
      url: "/marketing",
      icon: Percent,
      isActive: true,
      isAccardion: true,
      acardionItems: [
        {
          title: "Promocodes",
          url: "/marketing/promocodes",
        },
        {
          title: "Text messages",
          url: "/marketing/messages",
        },
      ],
    },
    {
      title: "Reviews",
      url: "/rewievs",
      icon: Star,
      isActive: true,
      isAccardion: false,
      acardionItems: [
        {
          title: "All sales",
          url: "/all-sales",
        },
        {
          title: "Pre-orders",
          url: "/pre-orders",
        },
        {
          title: "Settings",
          url: "/sales/settings",
        },
      ],
    },
    {
      title: "Paying system",
      url: "/rewievs",
      icon: HandCoins,
      isActive: true,
      isAccardion: true,
      acardionItems: [
        {
          title: "Add paying system",
          url: "/loyality/scores",
        },
        {
          title: "Tranzactions",
          url: "/loyality/analitics",
        },
      ],
    },
    {
      title: "Delivering methods",
      url: "/delivering-methods",
      icon: Truck,
      isActive: true,
      isAccardion: false,
      acardionItems: [],
    },
    {
      title: "Branches",
      url: "/filials",
      icon: MapPin,
      isActive: true,
      isAccardion: false,
      acardionItems: [],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      isActive: true,
      isAccardion: false,
      acardionItems: [],
    },
  ],

  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { t } = useTranslation();
  const { data: user, isLoading, isError } = useMe();

  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))] hover:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-rounded"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {user && (
                    <img
                      src={`http://127.0.0.1:8000${user.market.logo}`}
                      alt="logo"
                    />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {user && (
                    <span className="truncate font-semibold">
                      {user.market.name}
                    </span>
                  )}
                  <span className="truncate text-xs">{t("Dashboard")}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {isLoading && (
          <div className="p-4 text-sm text-gray-500">{t("Loading")}...</div>
        )}

        {isError && (
          <div className="p-4 text-sm text-red-600">
            {t("Could not load user")}
          </div>
        )}

        {user && (
          <NavUser
            user={{
              name: user.user.user_name,
              email: user.user.email,
              avatar: user.user.avatar || "/avatars/default.png",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
