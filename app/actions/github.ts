import "server-only";

import { unstable_cache as cache } from "next/cache";

export async function getGithubStars() {
  return await cache(
    async () => {
      const response = await fetch(
        "https://api.github.com/repos/lumpinif/drag-to-resize-sidebar",
        {
          headers: {
            Accept: "application/vnd.github+json",
          },
          next: {
            revalidate: 60,
          },
        }
      );

      if (!response.ok) {
        return 0;
      }

      const data = (await response.json()) as { stargazers_count: number };

      return data.stargazers_count;
    },
    ["github-stars"],
    {
      revalidate: 60,
      tags: ["github-stars"],
    }
  )();
}
