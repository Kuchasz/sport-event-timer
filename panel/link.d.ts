// Type definitions for Next.js routes

/**
 * Internal types used by the Next.js router and Link component.
 * These types are not meant to be used directly.
 * @internal
 */
declare namespace __next_route_internal_types__ {
    type SearchOrHash = `?${string}` | `#${string}`;
    type WithProtocol = `${string}:${string}`;

    type Suffix = "" | SearchOrHash;

    type SafeSlug<S extends string> = S extends `${string}/${string}`
        ? never
        : S extends `${string}${SearchOrHash}`
        ? never
        : S extends ""
        ? never
        : S;

    type CatchAllSlug<S extends string> = S extends `${string}${SearchOrHash}` ? never : S extends "" ? never : S;

    type OptionalCatchAllSlug<S extends string> = S extends `${string}${SearchOrHash}` ? never : S;

    type StaticRoutes =
        | ``
        | `/`
        | `/admin`
        | `/admin/accounts`
        | `/admin/hello`
        | `/admin/races`
        | `/id/login`
        | `/id/register`
        | `/my-races`
        | `/api/session`
        | `/api/restricted`;
    type DynamicRoutes<T extends string = string> =
        | `/${SafeSlug<T>}`
        | `/${SafeSlug<T>}/bib-numbers`
        | `/${SafeSlug<T>}/classifications`
        | `/${SafeSlug<T>}/classifications/${SafeSlug<T>}`
        | `/${SafeSlug<T>}/results`
        | `/${SafeSlug<T>}/player-registrations`
        | `/${SafeSlug<T>}/players`
        | `/${SafeSlug<T>}/settings`
        | `/${SafeSlug<T>}/timing-points`
        | `/${SafeSlug<T>}/split-times`
        | `/${SafeSlug<T>}/time-penalties`
        | `/registration/${SafeSlug<T>}`
        | `/results/${SafeSlug<T>}`
        | `/timer/${SafeSlug<T>}`
        | `/timer/${SafeSlug<T>}/m`
        | `/timer/${SafeSlug<T>}/t`
        | `/api/auth/${CatchAllSlug<T>}`
        | `/api/trpc/${SafeSlug<T>}`
        | `/auth/${SafeSlug<T>}`
        | `/stopwatch/${SafeSlug<T>}`
        | `/stopwatch/${SafeSlug<T>}/assign/${SafeSlug<T>}`
        | `/stopwatch/${SafeSlug<T>}/config`
        | `/stopwatch/${SafeSlug<T>}/history`
        | `/stopwatch/${SafeSlug<T>}/list`
        | `/stopwatch/${SafeSlug<T>}/pad`
        | `/stopwatch/${SafeSlug<T>}/reassign/${SafeSlug<T>}`
        | `/stopwatch/${SafeSlug<T>}/times`
        | `/stopwatch/${SafeSlug<T>}/tweak/${SafeSlug<T>}`
        | `/api/${SafeSlug<T>}/health-check`
        | `/api/${SafeSlug<T>}/list`
        | `/api/${SafeSlug<T>}/register`
        | `/api/${SafeSlug<T>}/registration-status`
        | `/api/${SafeSlug<T>}/start-list`
        | `/api/${SafeSlug<T>}/teams`
        | `/api/manifest/${SafeSlug<T>}/stopwatch`
        | `/api/manifest/${SafeSlug<T>}/timer`;

    type RouteImpl<T> =
        | StaticRoutes
        | SearchOrHash
        | WithProtocol
        | `${StaticRoutes}${SearchOrHash}`
        | (T extends `${DynamicRoutes<infer _>}${Suffix}` ? T : never);
}

declare module "next" {
    export { default } from "next/types/index.js";
    export * from "next/types/index.js";

    export type Route<T extends string = string> = __next_route_internal_types__.RouteImpl<T>;
}

declare module "next/link" {
    import type { LinkProps as OriginalLinkProps } from "next/dist/client/link.js";
    import type { AnchorHTMLAttributes, DetailedHTMLProps } from "react";
    import type { UrlObject } from "url";

    type LinkRestProps = Omit<
        Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, keyof OriginalLinkProps> & OriginalLinkProps,
        "href"
    >;

    export type LinkProps<T> = LinkRestProps & {
        /**
         * The path or URL to navigate to. This is the only required prop. It can also be an object.
         * @see https://nextjs.org/docs/api-reference/next/link
         */
        href: __next_route_internal_types__.RouteImpl<T> | UrlObject;
    };

    export default function Link<RouteType>(props: LinkProps<RouteType>): JSX.Element;
}

declare module "next/navigation" {
    export * from "next/dist/client/components/navigation.js";

    import type { NavigateOptions, AppRouterInstance as OriginalAppRouterInstance } from "next/dist/shared/lib/app-router-context.js";
    interface AppRouterInstance extends OriginalAppRouterInstance {
        /**
         * Navigate to the provided href.
         * Pushes a new history entry.
         */
        push<RouteType>(href: __next_route_internal_types__.RouteImpl<RouteType>, options?: NavigateOptions): void;
        /**
         * Navigate to the provided href.
         * Replaces the current history entry.
         */
        replace<RouteType>(href: __next_route_internal_types__.RouteImpl<RouteType>, options?: NavigateOptions): void;
        /**
         * Prefetch the provided href.
         */
        prefetch<RouteType>(href: __next_route_internal_types__.RouteImpl<RouteType>): void;
    }

    export declare function useRouter(): AppRouterInstance;
}
