"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Nav = () => {
  const pathname = usePathname();
  // i.e. /work ==> ["/", "work"]
  const url = pathname.split("/")[1];

  // const baseLinkStyles = `transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2`;
  const baseLinkStyles = `hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 border-gradient`;

  return (
    <nav
      className="mb-16 flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
      id="nav"
    >
      <div className="flex flex-row space-x-4 pr-10">
        <Link
          href="/"
          className={`${baseLinkStyles} ${
            url === "" ? "border-gradient-active" : ""
          }`}
        >
          home
        </Link>
        <Link
          href="/work"
          className={`${baseLinkStyles} ${
            url === "work" ? "border-gradient-active" : ""
          }`}
        >
          work
        </Link>
        <Link
          href="/projects"
          className={`${baseLinkStyles} ${
            url === "projects" ? "border-gradient-active" : ""
          }`}
        >
          projects
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
