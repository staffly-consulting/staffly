import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

/**
 * Every indexable page, once per locale, with hreflang alternates so Google
 * knows the en and th versions are the same page rather than duplicates.
 *
 * Add new routes here as they ship - this list is not derived from the
 * filesystem, so a new page is invisible to search until it is listed.
 */
const ROUTES = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/products/ats", priority: 0.8, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}${route.path}`]),
        ),
      },
    })),
  );
}
