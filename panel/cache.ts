import { createCacheComponent } from "@rsc-cache/next";
import fs from "fs/promises";
import { unstable_cache } from "next/cache";

export const Cache = createCacheComponent({
    cacheFn(generatePayload, cacheKey, ttl) {
        return unstable_cache(generatePayload, [cacheKey], {
            tags: [cacheKey],
            revalidate: ttl,
        })();
    },
    getBuildId: async () => await fs.readFile(".next/BUILD_ID", "utf-8"),
    defaultTTL: 604_800, // 7 days in seconds
});
