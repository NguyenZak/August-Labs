"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumb({ items }: { items?: BreadcrumbItem[] }) {
  const pathname = usePathname();
  
  // If items are not provided, try to generate from pathname
  const generatedItems = items || pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, array) => {
      const href = `/${array.slice(0, index + 1).join('/')}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      return { label, href };
    });

  return (
    <nav aria-label="Breadcrumb" className="flex mb-8">
      <ol className="flex items-center space-x-2 text-sm font-medium text-gray-500">
        <li>
          <Link href="/" className="hover:text-gray-900 transition-colors flex items-center gap-1">
            <Home size={14} />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {generatedItems.map((item, index) => (
          <li key={item.href} className="flex items-center space-x-2">
            <ChevronRight size={14} className="text-gray-300" />
            <Link
              href={item.href}
              className={`hover:text-gray-900 transition-colors ${
                index === generatedItems.length - 1 ? "text-gray-900 font-bold" : ""
              }`}
              aria-current={index === generatedItems.length - 1 ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
