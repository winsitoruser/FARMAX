import { cn, truncate } from "@/lib/utils";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import * as React from "react";

type BreadcrumbItem = {
  title?: string;
  label?: string;
  href: string;
};

interface BreadcrumbsProps extends React.ComponentPropsWithoutRef<"nav"> {
  segments?: BreadcrumbItem[];
  items?: BreadcrumbItem[];
  separator?: React.ComponentType<{ className?: string }>;
  truncationLength?: number;
}

export function Breadcrumbs({
  segments,
  items,
  separator,
  truncationLength = 0,
  className,
  ...props
}: BreadcrumbsProps) {
  const SeparatorIcon = separator ?? ChevronRightIcon;
  
  // Use either segments or items prop, with segments taking precedence
  const breadcrumbItems = segments || items || [];

  return (
    <nav
      aria-label="breadcrumbs"
      className={cn(
        "flex w-full items-center overflow-auto text-sm font-medium text-muted-foreground",
        className,
      )}
      {...props}
    >
      {breadcrumbItems.map((item, index) => {
        const isLastSegment = index === breadcrumbItems.length - 1;
        const title = item.title || item.label || "";

        return (
          <React.Fragment key={item.href}>
            <Link
              aria-current={isLastSegment ? "page" : undefined}
              href={item.href}
              className={cn(
                "capitalize truncate transition-colors hover:text-foreground",
                isLastSegment ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {truncationLength > 0 && title
                ? truncate(title, truncationLength)
                : title}
            </Link>
            {!isLastSegment && (
              <SeparatorIcon className="mx-2 h-4 w-4" aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}