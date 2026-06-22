import React from "react";

export interface UseSidebarResizeProps {
	/**
	 * Direction of the resize handle
	 * - 'left': Handle is on left side (for right-positioned panels)
	 * - 'right': Handle is on right side (for left-positioned panels)
	 */
	direction?: "left" | "right";

	/**
	 * Current width of the panel
	 */
	currentWidth: string;

	/**
	 * Callback to update width when resizing
	 */
	onResize: (width: string) => void;

	/**
	 * Callback to toggle panel visibility
	 */
	onToggle?: () => void;

	/**
	 * Whether the panel is currently collapsed
	 */
	isCollapsed?: boolean;

	/**
	 * Minimum resize width
	 */
	minResizeWidth?: string;

	/**
	 * Maximum resize width
	 */
	maxResizeWidth?: string;

	/**
	 * Whether to enable auto-collapse when dragged below threshold
	 */
	enableAutoCollapse?: boolean;

	/**
	 * Auto-collapse threshold as percentage of minResizeWidth
	 * A value of 1.0 means the panel will collapse when dragged to minResizeWidth
	 * A value of 0.5 means the panel will collapse when dragged to 50% of minResizeWidth
	 * A value of 1.5 means the panel will collapse when dragged to 50% beyond minResizeWidth
	 * Can be any positive number, not limited to the range 0.0-1.0
	 */
	autoCollapseThreshold?: number;

	/**
	 * Threshold to expand when dragging in opposite direction (0.0-1.0)
	 * Percentage of distance needed to drag back to expand
	 */
	expandThreshold?: number;

	/**
	 * Whether to enable drag functionality
	 */
	enableDrag?: boolean;

	/**
	 * Callback to update dragging rail state
	 */
	setIsDraggingRail?: (isDragging: boolean) => void;

	/**
	 * Cookie name for persisting width
	 */
	widthCookieName?: string;

	/**
	 * Cookie max age in seconds
	 */
	widthCookieMaxAge?: number;

	/**
	 * Whether this is a nested sidebar (not at the edge of the screen)
	 */
	isNested?: boolean;

	/**
	 * Whether to enable toggle functionality
	 */
	enableToggle?: boolean;

	/**
	 * Root element that owns the --sidebar-width custom property.
	 * During drag, the hook writes to this element directly and commits React state
	 * only after pointerup.
	 */
	resizeRootRef?: React.RefObject<HTMLElement | null>;
}

interface WidthUnit {
	value: number;
	unit: "rem" | "px";
}

/**
 * Parse width string into value and unit
 */
function parseWidth(width: string): WidthUnit {
	const unit = width.endsWith("rem") ? "rem" : "px";
	const value = Number.parseFloat(width);
	return { value, unit };
}

/**
 * Convert any width to pixels for calculations
 */
function toPx(width: string): number {
	const { value, unit } = parseWidth(width);
	return unit === "rem" ? value * 16 : value;
}

/**
 * Format width value with unit
 */
function formatWidth(value: number, unit: "rem" | "px"): string {
	return `${unit === "rem" ? value.toFixed(1) : Math.round(value)}${unit}`;
}

/**
 * A versatile hook for handling resizable sidebar (or inset) panels
 * Works for both sidebar (left side) and artifacts (right side) panels
 * Supports VS Code-like continuous drag to collapse/expand
 */
export function useSidebarResize({
	direction = "right",
	currentWidth,
	onResize,
	onToggle,
	isCollapsed = false,
	minResizeWidth = "14rem",
	maxResizeWidth = "24rem",
	enableToggle = true,
	enableAutoCollapse = true,
	autoCollapseThreshold = 1.5, // Default to collapsing at minWidth + 50%
	expandThreshold = 0.2,
	enableDrag = true,
	setIsDraggingRail = () => {},
	widthCookieName,
	widthCookieMaxAge = 60 * 60 * 24 * 7, // 1 week default
	isNested = false,
	resizeRootRef,
}: UseSidebarResizeProps) {
	// Refs for tracking drag state
	const dragRef = React.useRef<HTMLButtonElement>(null);
	const startWidth = React.useRef(0);
	const startX = React.useRef(0);
	const isDragging = React.useRef(false);
	const isInteractingWithRail = React.useRef(false);
	const activePointerId = React.useRef<number | null>(null);
	const pendingWidth = React.useRef<string | null>(null);
	const lastDragDirection = React.useRef<"expand" | "collapse" | null>(null);
	const lastTogglePoint = React.useRef(0);
	const toggleCooldown = React.useRef(false);
	const lastToggleTime = React.useRef(0);
	const dragDistanceFromToggle = React.useRef(0);
	const railRect = React.useRef<DOMRect | null>(null);
	const previousBodyUserSelect = React.useRef<string | null>(null);

	// Memoize min/max width calculations for performance
	const minWidthPx = React.useMemo(
		() => toPx(minResizeWidth),
		[minResizeWidth],
	);
	const maxWidthPx = React.useMemo(
		() => toPx(maxResizeWidth),
		[maxResizeWidth],
	);

	// Helper function to determine if width is increasing based on direction and pointer movement
	const isIncreasingWidth = React.useCallback(
		(currentX: number, referenceX: number): boolean => {
			return direction === "left"
				? currentX < referenceX // For left-positioned handle, moving left increases width
				: currentX > referenceX; // For right-positioned handle, moving right increases width
		},
		[direction],
	);

	// Helper function to calculate width based on pointer position and direction
	const calculateWidth = React.useCallback(
		(
			currentX: number,
			initialX: number,
			initialWidth: number,
			currentRailRect: DOMRect | null,
		): number => {
			if (isNested && currentRailRect) {
				// For nested sidebars, use the delta from start position for precise tracking
				const deltaX = currentX - initialX;

				if (direction === "left") {
					// For left-positioned handle (right panel)
					// Width increases as pointer moves left (negative deltaX)
					return initialWidth - deltaX;
				}
				// For right-positioned handle (left panel)
				// Width increases as pointer moves right (positive deltaX)
				return initialWidth + deltaX;
			}
			// For standard sidebars at window edges
			if (direction === "left") {
				// For left-positioned handle (right panel)
				return window.innerWidth - currentX;
			}
			// For right-positioned handle (left panel)
			return currentX;
		},
		[direction, isNested],
	);

	// Persist width to cookie if cookie name is provided
	const persistWidth = React.useCallback(
		(width: string) => {
			if (widthCookieName) {
				document.cookie = `${widthCookieName}=${width}; path=/; max-age=${widthCookieMaxAge}`;
			}
		},
		[widthCookieName, widthCookieMaxAge],
	);

	const writeResizeRootWidth = React.useCallback(
		(width: string): boolean => {
			const resizeRoot = resizeRootRef?.current;

			if (!resizeRoot) {
				return false;
			}

			resizeRoot.style.setProperty("--sidebar-width", width);
			return true;
		},
		[resizeRootRef],
	);

	const restoreBodyUserSelect = React.useCallback(() => {
		if (previousBodyUserSelect.current === null) {
			return;
		}

		document.body.style.userSelect = previousBodyUserSelect.current;
		previousBodyUserSelect.current = null;
	}, []);

	const beginInteraction = React.useCallback(
		(
			clientX: number,
			pointerId: number | null,
			target: HTMLButtonElement,
		) => {
			isInteractingWithRail.current = true;
			activePointerId.current = pointerId;

			if (pointerId !== null) {
				target.setPointerCapture(pointerId);
			}

			if (!enableDrag) {
				return;
			}

			// Store initial state
			const currentWidthPx = isCollapsed ? 0 : toPx(currentWidth);
			startWidth.current = currentWidthPx;
			startX.current = clientX;
			lastTogglePoint.current = clientX;
			lastDragDirection.current = null;
			toggleCooldown.current = false;
			lastToggleTime.current = 0;
			dragDistanceFromToggle.current = 0;
			pendingWidth.current = null;

			previousBodyUserSelect.current = document.body.style.userSelect;
			document.body.style.userSelect = "none";

			// Store the rail element's position for nested sidebars
			if (isNested && dragRef.current) {
				railRect.current = dragRef.current.getBoundingClientRect();
			} else {
				railRect.current = null;
			}
		},
		[enableDrag, isCollapsed, currentWidth, isNested],
	);

	const handlePointerDown = React.useCallback(
		(e: React.PointerEvent<HTMLButtonElement>) => {
			beginInteraction(e.clientX, e.pointerId, e.currentTarget);
			e.preventDefault();
		},
		[beginInteraction],
	);

	// Backward-compatible handler for consumers still wiring the hook to onMouseDown.
	const handleMouseDown = React.useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			beginInteraction(e.clientX, null, e.currentTarget);
			e.preventDefault();
		},
		[beginInteraction],
	);

	const handleDragMove = React.useEffectEvent(
		(clientX: number, pointerId: number | null) => {
			if (!isInteractingWithRail.current || !enableDrag) return;

			if (activePointerId.current !== pointerId) {
				return;
			}

			const deltaX = Math.abs(clientX - startX.current);
			let startedDragging = false;

			if (!isDragging.current && deltaX > 5) {
				isDragging.current = true;
				startedDragging = true;
				setIsDraggingRail(true);
			}

			if (!isDragging.current) {
				return;
			}

			// Get unit for width calculations
			const { unit } = parseWidth(currentWidth);

			// Get current rail position for ultra-precise tracking
			let currentRailRect = railRect.current;
			if (isNested && dragRef.current) {
				currentRailRect = dragRef.current.getBoundingClientRect();
			}

			// Determine current drag direction
			const currentDragDirection = isIncreasingWidth(
				clientX,
				lastTogglePoint.current,
			)
				? "expand"
				: "collapse";

			// Update direction tracking
			if (lastDragDirection.current !== currentDragDirection) {
				lastDragDirection.current = currentDragDirection;
			}

			// Calculate distance from last toggle point
			dragDistanceFromToggle.current = Math.abs(
				clientX - lastTogglePoint.current,
			);

			// Check for toggle cooldown (prevent rapid toggling)
			const now = Date.now();
			if (toggleCooldown.current && now - lastToggleTime.current > 200) {
				toggleCooldown.current = false;
			}

			// Handle toggling between collapsed and expanded states
			if (!toggleCooldown.current) {
				// Handle collapsing when expanded
				if (enableAutoCollapse && onToggle && !isCollapsed) {
					// Calculate precise width based on pointer position
					const currentDragWidth = calculateWidth(
						clientX,
						startX.current,
						startWidth.current,
						currentRailRect,
					);

					// Determine if we should collapse based on threshold
					let shouldCollapse = false;

					if (autoCollapseThreshold <= 1.0) {
						// For thresholds <= 1.0, collapse when width is below minWidth * threshold
						shouldCollapse =
							currentDragWidth <= minWidthPx * autoCollapseThreshold;
					} else {
						// For thresholds > 1.0, we need to drag beyond minWidth by a certain amount
						if (currentDragWidth <= minWidthPx) {
							// Calculate how much beyond minWidth we need to drag
							const extraDragNeeded =
								minWidthPx * (autoCollapseThreshold - 1.0);

							// Only collapse if we've dragged far enough beyond minWidth
							const distanceBeyondMin = minWidthPx - currentDragWidth;

							shouldCollapse = distanceBeyondMin >= extraDragNeeded;
						}
					}

					if (currentDragDirection === "collapse" && shouldCollapse) {
						onToggle(); // Collapse
						lastTogglePoint.current = clientX;
						toggleCooldown.current = true;
						lastToggleTime.current = now;
						return;
					}
				}

				// Handle expanding when collapsed
				if (
					onToggle &&
					isCollapsed &&
					currentDragDirection === "expand" &&
					dragDistanceFromToggle.current > minWidthPx * expandThreshold
				) {
					onToggle(); // Expand

					// Calculate initial width based on exact pointer position
					const initialWidth = calculateWidth(
						clientX,
						startX.current,
						startWidth.current,
						currentRailRect,
					);

					// Clamp to min/max
					const clampedWidth = Math.max(
						minWidthPx,
						Math.min(maxWidthPx, initialWidth),
					);

					// Set initial width when expanding
					const formattedWidth = formatWidth(
						unit === "rem" ? clampedWidth / 16 : clampedWidth,
						unit,
					);
					pendingWidth.current = formattedWidth;
					writeResizeRootWidth(formattedWidth);
					onResize(formattedWidth);
					persistWidth(formattedWidth);

					lastTogglePoint.current = clientX;
					toggleCooldown.current = true;
					lastToggleTime.current = now;
					return;
				}
			}

			// Skip width calculations if panel is collapsed
			if (isCollapsed) {
				return;
			}

			// Calculate new width based on pointer position and drag direction
			const newWidthPx = calculateWidth(
				clientX,
				startX.current,
				startWidth.current,
				currentRailRect,
			);

			// Clamp width between min and max
			const clampedWidthPx = Math.max(
				minWidthPx,
				Math.min(maxWidthPx, newWidthPx),
			);

			// Convert to the target unit
			const newWidth = unit === "rem" ? clampedWidthPx / 16 : clampedWidthPx;

			// Format and update the live DOM width. React state and cookie commit on pointerup.
			const formattedWidth = formatWidth(newWidth, unit);
			pendingWidth.current = formattedWidth;
			writeResizeRootWidth(formattedWidth);

			if (startedDragging || !resizeRootRef?.current) {
				onResize(formattedWidth);
			}
		},
	);

	const finishInteraction = React.useEffectEvent(
		(pointerId: number | null, shouldToggleClick = true) => {
			if (!isInteractingWithRail.current) return;

			if (activePointerId.current !== pointerId) {
				return;
			}

			const rail = dragRef.current;

			if (pointerId !== null && rail?.hasPointerCapture(pointerId)) {
				rail.releasePointerCapture(pointerId);
			}

			// Handle click (not drag) behavior
			if (shouldToggleClick && !isDragging.current && onToggle && enableToggle) {
				onToggle();
			}

			if (isDragging.current && pendingWidth.current) {
				onResize(pendingWidth.current);
				persistWidth(pendingWidth.current);
			}

			// Reset all state
			isDragging.current = false;
			isInteractingWithRail.current = false;
			activePointerId.current = null;
			pendingWidth.current = null;
			lastDragDirection.current = null;
			lastTogglePoint.current = 0;
			toggleCooldown.current = false;
			lastToggleTime.current = 0;
			dragDistanceFromToggle.current = 0;
			railRect.current = null;
			restoreBodyUserSelect();
			setIsDraggingRail(false);
		},
	);

	React.useEffect(() => {
		const handleDocumentPointerMove = (event: PointerEvent) => {
			handleDragMove(event.clientX, event.pointerId);
		};
		const handleDocumentPointerUp = (event: PointerEvent) => {
			finishInteraction(event.pointerId);
		};
		const handleDocumentPointerCancel = (event: PointerEvent) => {
			finishInteraction(event.pointerId, false);
		};
		const handleDocumentMouseMove = (event: MouseEvent) => {
			handleDragMove(event.clientX, null);
		};
		const handleDocumentMouseUp = () => {
			finishInteraction(null);
		};

		document.addEventListener("pointermove", handleDocumentPointerMove);
		document.addEventListener("pointerup", handleDocumentPointerUp);
		document.addEventListener("pointercancel", handleDocumentPointerCancel);
		document.addEventListener("mousemove", handleDocumentMouseMove);
		document.addEventListener("mouseup", handleDocumentMouseUp);

		return () => {
			document.removeEventListener("pointermove", handleDocumentPointerMove);
			document.removeEventListener("pointerup", handleDocumentPointerUp);
			document.removeEventListener(
				"pointercancel",
				handleDocumentPointerCancel,
			);
			document.removeEventListener("mousemove", handleDocumentMouseMove);
			document.removeEventListener("mouseup", handleDocumentMouseUp);
			restoreBodyUserSelect();
		};
	}, [restoreBodyUserSelect]);

	return {
		dragRef,
		isDragging,
		handlePointerDown,
		handleMouseDown,
	};
}
