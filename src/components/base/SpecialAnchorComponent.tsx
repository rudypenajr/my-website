import React, { FC } from "react";

import Link from "next/link";

export type SpecialAnchorType = {
  anchorText: string;
  anchorHref: string;
};

export const SpecialAnchorComponent: FC<SpecialAnchorType> = ({
  anchorText,
  anchorHref,
}) => {
  // bg-gradient-to-r from-teal-400 to-yellow-200
  return (
    <Link
      className="content-none relative z-10 special-anchor-gradient"
      href={`${anchorHref}`}
    >
      {anchorText}
    </Link>
  );
};

export default SpecialAnchorComponent;
