import React, { FC } from "react";

export type PillType = {
  text: string;
};

export const PillComponent: FC<PillType> = ({ text }) => {
  return (
    <span className="text-xs px-3 py-2 text-white rounded-full gradient-option-2 inline-block mx-1">
      # {text}
    </span>
  );
};

export default PillComponent;
