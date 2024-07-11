import React, { FC } from "react";

import Link from "next/link";

export type SpecialAnchorType = {
  anchorText: string;
  anchorHref: string;
};

export const MockedAnchorComponent: FC<SpecialAnchorType> = ({
  anchorText,
  anchorHref,
}) => {
  return (
    <span className="content-none relative z-10 special-anchor-gradient">
      {anchorText}
    </span>
  );
};

export default MockedAnchorComponent;
