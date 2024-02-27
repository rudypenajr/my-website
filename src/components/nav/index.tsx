import Link from "next/link";
import React from "react";

export const Nav = () => {
  return (
    <nav
      className="mb-16 flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
      id="nav"
    >
      <div className="flex flex-row space-x-0 pr-10">
        <Link
          href="/"
          className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2"
        >
          home
        </Link>
        <Link
          href="/work"
          className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2"
        >
          work
        </Link>
        <Link
          href="/projects"
          className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2"
        >
          projects
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
