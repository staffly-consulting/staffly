import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Staffly — Global HR & Workforce, simplified",
  description:
    "Staffly unifies payroll, people data, and compliance for distributed teams in 140+ countries. One dashboard. Zero spreadsheets.",
  // Icons come from the app/ file conventions (favicon.ico, icon.png,
  // apple-icon.png), which emit the right type/sizes and are content-hashed.
  openGraph: {
    type: "website",
    title: "Staffly — Global HR & Workforce, simplified",
    description:
      "Staffly unifies payroll, people data, and compliance for distributed teams in 140+ countries. One dashboard. Zero spreadsheets.",
    images: [{ url: "/thumbnail.png", alt: "Staffly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Staffly — Global HR & Workforce, simplified",
    description:
      "Staffly unifies payroll, people data, and compliance for distributed teams in 140+ countries. One dashboard. Zero spreadsheets.",
    images: ["/thumbnail.png"],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${interTight.variable} ${jetBrainsMono.variable}`}
    >
      <body suppressHydrationWarning>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
