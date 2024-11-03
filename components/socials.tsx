import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RiGithubFill, RiTwitterXFill } from "@remixicon/react";
import Link from "next/link";
import { getGithubStars } from "@/app/actions/github";

export default async function Socials() {
  const stars = await getGithubStars();

  return (
    <div className="inline-flex flex-wrap gap-2">
      <div className="inline-flex -space-x-px rounded-lg shadow-sm shadow-black/[0.04] rtl:space-x-reverse">
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://x.com/felixlyu_1018/status/1852376714569015541"
          aria-label="Open link"
          className={cn(
            buttonVariants({
              variant: "outline",
              className:
                "rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 hidden md:block",
            })
          )}
        >
          Check out the tweet
        </Link>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://x.com/felixlyu_1018/status/1852376714569015541"
          aria-label="Open link"
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "icon",
              className:
                "rounded-lg md:rounded-none shadow-none md:first:rounded-s-lg md:last:rounded-e-lg focus-visible:z-10",
            })
          )}
        >
          <RiTwitterXFill size={16} aria-hidden="true" />
        </Link>
      </div>

      <div className="inline-flex -space-x-px rounded-lg shadow-sm shadow-black/[0.04] rtl:space-x-reverse">
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/lumpinif/drag-to-resize-sidebar.git"
          aria-label="Open link"
          className={cn(
            buttonVariants({
              variant: "outline",
              className:
                "rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 hidden md:block",
            })
          )}
        >
          {stars} Stars on Github
        </Link>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/lumpinif/drag-to-resize-sidebar.git"
          aria-label="Open link"
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "icon",
              className:
                "rounded-lg md:rounded-none shadow-none md:first:rounded-s-lg md:last:rounded-e-lg focus-visible:z-10",
            })
          )}
        >
          <RiGithubFill size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
