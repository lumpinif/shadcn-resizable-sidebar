import { SidebarInset } from "../ui/sidebar";

import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Socials from "@/components/socials";
import { SidebarTrigger } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function AppSidebarInset({ children }: { children: React.ReactNode }) {
  return (
    <SidebarInset className="overflow-x-hidden">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
        <div className="flex items-center gap-2 px-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger className="-ml-1" />
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              Toggle Sidebar <kbd className="ml-2">⌘+b</kbd>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  A shadcn/ui Resizeable Sidebar
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="block md:hidden">
                  Sidebar is only resizable on desktop
                </BreadcrumbPage>
                <BreadcrumbPage className="hidden md:block">
                  Try to drag the sidebar
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="mr-2 sm:mr-4">
          <Socials />
        </div>
      </header>
      {children}
    </SidebarInset>
  );
}
