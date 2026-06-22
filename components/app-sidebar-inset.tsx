import { SidebarInset } from "./ui/sidebar";

import Socials from "@/components/socials";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function AppSidebarInset({ children }: { children: React.ReactNode }) {
	return (
		<SidebarInset className="h-svh overflow-hidden">
			<header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-background/95 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
				<div className="flex min-w-0 items-center gap-2">
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
									shadcn/ui Resizable Sidebar
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage className="block md:hidden">
									Resizable on desktop
								</BreadcrumbPage>
								<BreadcrumbPage className="hidden md:block">
									Drag or click the rail
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					<ThemeSwitcher />
					<Socials />
				</div>
			</header>
			<div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
		</SidebarInset>
	);
}
