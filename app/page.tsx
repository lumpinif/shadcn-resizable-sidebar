const actionCards = [
	{
		kicker: "Drag",
		title: "Drag to resize",
		body: "Save on release. Refresh to see the sidebar keep the same width.",
	},
	{
		kicker: "Click",
		title: "Click to collapse",
		body: "The same rail toggles compact mode. The keyboard shortcut still works.",
	},
	{
		kicker: "Drop-in",
		title: "Keep shadcn/ui",
		body: "Use the normal Sidebar composition, then add resize where products need it.",
	},
];

const specs = [
	["Next.js", "16.2.9"],
	["React", "19.2.7"],
	["Tailwind CSS", "4.3.1"],
	["Radix UI", "1.6.0"],
	["shadcn/ui", "new-york v4"],
	["Package", "Bun"],
];

const advantages = [
	"SSR width restore",
	"Pointer Events drag",
	"Mobile Sheet a11y",
	"Tailwind v4 tokens",
	"Radix primitives",
	"Cookie persistence",
];

export default function Home() {
	return (
		<div className="relative flex min-h-full flex-col gap-4 p-4">
			<section className="relative overflow-visible py-5 md:py-7">
				<svg
					data-demo-arrow="rail"
					aria-hidden="true"
					className="pointer-events-none absolute left-0 top-[-3.25rem] z-10 hidden h-52 w-16 translate-x-10 -rotate-90 text-foreground/70 md:block"
					fill="none"
					viewBox="0 0 90 221"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						clipRule="evenodd"
						d="M84.0605 0.220148C82.3012 0.571891 81.621 0.900181 76.7889 4.04241C72.2617 6.9736 69.7049 8.47437 61.7765 12.9532C54.4814 17.0803 47.7258 21.9578 45.7789 24.5138C44.3011 26.4601 44.9579 28.852 47.1159 29.5086C48.4295 29.9072 49.4381 29.4851 54.153 26.507C61.6357 21.8171 68.532 17.479 72.074 15.2513C73.974 14.0319 75.5926 13.0705 75.6395 13.1174C75.7099 13.2112 72.4728 17.69 66.9135 25.2173C49.4381 48.8075 39.0233 65.058 29.406 83.7473C21.196 99.646 13.3614 119.484 9.04537 135.242C3.83794 154.166 0.389773 178.319 0.0379198 198.228C-0.196649 211.313 0.647801 217.714 2.82929 219.543C3.55646 220.153 4.18979 220.317 4.18979 219.895C4.18979 219.754 4.00214 219.262 3.74411 218.77C2.80583 216.894 2.66509 215.463 2.66509 206.998C2.66509 197.102 3.46263 186.902 5.26881 173.465C8.15401 151.892 12.1886 135.172 18.7331 117.772C27.764 93.7367 37.5455 74.8599 53.1209 51.387C57.6011 44.6101 72.4024 23.9745 72.6135 24.1855C72.637 24.209 71.9333 26.2256 71.0419 28.6878C67.0543 39.6622 64.4036 50.449 63.7938 58.328C63.6765 60.0633 63.4888 63.7917 63.4184 66.6057C63.3012 71.108 63.3246 71.7177 63.653 71.8349C63.8641 71.9287 64.0987 71.9287 64.1691 71.8349C64.2394 71.7646 64.7555 68.9975 65.3185 65.6677C65.8814 62.3379 66.7259 58.117 67.1716 56.3114C69.9395 45.1728 79.2284 22.9896 85.4679 12.6015C89.3852 6.08252 90.1828 3.76102 89.1741 1.81471C88.2828 0.102898 86.9222 -0.31919 84.0605 0.220148Z"
						fill="currentColor"
						fillRule="evenodd"
					/>
				</svg>
				<div className="flex max-w-4xl flex-col gap-4 md:pl-44 lg:pl-48">
					<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
						Resizable sidebar for shadcn/ui
					</p>
					<div className="flex flex-col gap-3">
						<h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
							Drag the rail. Keep the Sidebar.
						</h1>
						<p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
							A focused shadcn/ui Sidebar enhancement with resize, collapse,
							persistence, and mobile behavior already wired in.
						</p>
					</div>
					<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
						<span className="rounded-md border bg-background px-2.5 py-1">
							↔ Drag rail
						</span>
						<span className="rounded-md border bg-background px-2.5 py-1">
							👈 Click rail
						</span>
						<span className="rounded-md border bg-background px-2.5 py-1">
							⌘B toggle
						</span>
						<span className="rounded-md border bg-background px-2.5 py-1">
							↻ Persists on reload
						</span>
					</div>
				</div>
			</section>

			<section className="grid gap-4 md:grid-cols-3">
				{actionCards.map((card) => (
					<div
						key={card.title}
						className="flex min-h-40 flex-col justify-between rounded-lg border bg-card p-4"
					>
						<div className="flex flex-col gap-2">
							<span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
								{card.kicker}
							</span>
							<h2 className="text-lg font-semibold tracking-tight">
								{card.title}
							</h2>
						</div>
						<p className="text-sm leading-6 text-muted-foreground">
							{card.body}
						</p>
					</div>
				))}
			</section>

			<section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
				<div className="rounded-lg border bg-card p-5 md:p-6">
					<div className="flex max-w-3xl flex-col gap-6">
						<div className="flex flex-col gap-2">
							<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
								Philosophy
							</p>
							<h2 className="text-2xl font-semibold tracking-tight">
								Native Sidebar first.
							</h2>
							<p className="text-sm leading-6 text-muted-foreground">
								The project keeps shadcn/ui&apos;s component model and adds the
								missing product layer: resize state, cookies, pointer capture,
								and a stable mobile Sheet.
							</p>
						</div>

						<div className="grid gap-4 border-y py-5 sm:grid-cols-2">
							<div>
								<h3 className="text-sm font-medium">Advantage</h3>
								<p className="mt-2 text-sm leading-6 text-muted-foreground">
									Persistence, SSR restore, mobile accessibility, and Tailwind v4
									tokens are already handled.
								</p>
							</div>
							<div>
								<h3 className="text-sm font-medium">Customization</h3>
								<p className="mt-2 text-sm leading-6 text-muted-foreground">
									Menus, variants, slots, and styling remain shadcn/ui. Resize is
									only the added layer.
								</p>
							</div>
						</div>

						<div className="flex flex-wrap gap-2">
							{advantages.map((item) => (
								<span
									key={item}
									className="rounded-md border bg-background px-2.5 py-1 text-xs text-muted-foreground"
								>
									{item}
								</span>
							))}
						</div>
					</div>
				</div>

				<div className="rounded-lg border bg-card p-5 md:p-6">
					<div className="flex flex-col gap-5">
						<div className="flex flex-col gap-2">
							<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
								Specs
							</p>
							<h2 className="text-2xl font-semibold tracking-tight">
								Modern stack.
							</h2>
						</div>
						<div className="grid gap-2">
							{specs.map(([label, value]) => (
								<div
									key={label}
									className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm"
								>
									<span className="text-muted-foreground">{label}</span>
									<span className="font-medium">{value}</span>
								</div>
							))}
						</div>
						<p className="text-sm leading-6 text-muted-foreground">
							Built for semantic tokens, accessible dialogs, keyboard control,
							and low-noise React updates during drag.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
