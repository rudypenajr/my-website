import React, { FC } from "react";

import Link from "next/link";

export type BadCallOutType = {
  text: string;
  positive: boolean;
};

export const CallOutComponent: FC<BadCallOutType> = ({
  text,
  positive = true,
}) => {
  // bg-gradient-to-r from-teal-400 to-yellow-200
  return (
    // <span className="content-none inline-block relative z-10 bad-call-out-gradient">
    <span
      className={`px-2 bg-gradient-to-r ${
        positive ? "from-green-200 to-green-200" : "from-red-300 to-red-300"
      }`}
    >
      {text}
    </span>
  );
};

export default CallOutComponent;
