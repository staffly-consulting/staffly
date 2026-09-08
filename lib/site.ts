/**
 * Canonical origin for the site.
 *
 * Used for metadataBase, the sitemap and robots.txt. Set
 * NEXT_PUBLIC_SITE_URL in the deployment environment if the domain differs.
 * No trailing slash.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://stafflyconsulting.com"
).replace(/\/$/, "");
