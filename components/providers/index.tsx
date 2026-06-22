import { ThemeProvider } from "next-themes";
import { cookies } from "next/headers";
import { AppSidebar } from "../app-sidebar";
import { AppSidebarInset } from "../app-sidebar-inset";
import { SidebarProvider } from "../ui/sidebar";

type ProviderProps = {
	children: React.ReactNode;
};

const SIDEBAR_COOKIE_KEY = "sidebar";

export async function Providers({ children }: ProviderProps) {
	const cookieStore = await cookies();

	const sidebarState = cookieStore.get(`${SIDEBAR_COOKIE_KEY}:state`)?.value;
	//* get sidebar width from cookie
	const sidebarWidth = cookieStore.get(`${SIDEBAR_COOKIE_KEY}:width`)?.value;

	let defaultOpen = true;

	if (sidebarState) {
		defaultOpen = sidebarState === "true";
	}

	return (
		<ThemeProvider
			enableSystem
			attribute="class"
			defaultTheme="dark"
			disableTransitionOnChange
		>
			<SidebarProvider
				cookieKey={SIDEBAR_COOKIE_KEY}
				defaultOpen={defaultOpen}
				defaultWidth={sidebarWidth}
			>
				<AppSidebar>
					<AppSidebarInset>{children}</AppSidebarInset>
				</AppSidebar>
			</SidebarProvider>
		</ThemeProvider>
	);
}
