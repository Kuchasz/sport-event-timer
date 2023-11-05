"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import classNames from "classnames";

const ScrollArea = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
    <ScrollAreaPrimitive.Root ref={ref} className={classNames("relative overflow-hidden", className)} {...props}>
        <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
        ref={ref}
        orientation={orientation}
        className={classNames(
            "data-[state=hidden]:animate-fadeOut data-[state=visible]:animate-fadeIn group flex touch-none select-none transition-all",
            orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
            orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
            className,
        )}
        {...props}
    >
        <ScrollAreaPrimitive.ScrollAreaThumb
            className={classNames(
                "relative rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200",
                orientation === "vertical" && "flex-1",
            )}
        />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };

// import * as ScrollAreaA from "@radix-ui/react-scroll-area";

// export const ScrollArea = ({ children }) => (
//     <ScrollAreaA.Root type="scroll" className="scrollarea">
//         <ScrollAreaA.Viewport className="scrollarea__viewport">{children}</ScrollAreaA.Viewport>

//         <ScrollAreaA.Scrollbar className="scrollarea__bar" orientation="vertical">
//             <ScrollAreaA.Thumb className="scrollarea__thumb" />
//         </ScrollAreaA.Scrollbar>
//     </ScrollAreaA.Root>
// );
