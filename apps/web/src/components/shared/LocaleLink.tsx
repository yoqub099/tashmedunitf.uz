"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePathname } from "next/navigation";

function getCurrentLocale(pathname: string): string {
  const match = pathname.match(/^\/(uz|ru|en)(\/|$)/);
  return match?.[1] || "uz";
}

type LocaleLinkProps = ComponentProps<typeof Link>;

export default function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const pathname = usePathname();
  const locale = getCurrentLocale(pathname);

  if (typeof href === "string" && href.startsWith("/") && !href.match(/^\/(uz|ru|en)(\/|$)/)) {
    return <Link href={`/${locale}${href}`} {...props} />;
  }

  if (typeof href === "object" && href.pathname && !href.pathname.match(/^\/(uz|ru|en)(\/|$)/)) {
    return <Link href={{ ...href, pathname: `/${locale}${href.pathname}` }} {...props} />;
  }

  return <Link href={href} {...props} />;
}
