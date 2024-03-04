import React from "react";

import SpecialAnchor from "@/components/base/SpecialAnchorComponent";
import PillComponent from "@/components/base/PillComponent";

export const IBMJobDescComponent = () => {
  return (
    <>
      <h2 className="font-medium text-xl mb-1 tracking-tighter">
        <SpecialAnchor
          anchorHref="https://www.ibm.com/us-en"
          anchorText="IBM"
        />
      </h2>

      <p className="subtitle text-neutral-600 dark:text-neutral-400 text-sm">
        Senior UI Developer, 2018 - 2019
      </p>

      <p>
        My second go around with{" "}
        <SpecialAnchor
          anchorHref="https://www.ibm.com/us-en"
          anchorText="IBM"
        />{" "}
        was an interesting venture. During that time, they were incubating a
        start-up inside{" "}
        <SpecialAnchor
          anchorHref="https://www.ibm.com/us-en"
          anchorText="IBM"
        />
        . Initially, I was the sole developer responsible for the development of
        the UI using Angular. I worked closely with the sole Architect (who was
        in India) developing the APIs and working with UX designers who were
        developing the interfaces.
      </p>

      <p>
        After a few months, I became Technical Lead for the project. I continued
        to work closely with the Architect in India but managed an Austin based
        team of Backend (4) and Frontend (4) developers. My objective switched
        from developing features to discussing with stakeholders what was
        feasible in the roadmap. I also was mentoring the Frontend developers,
        half had limited experience with Angular.
      </p>

      <div className="pills">
        <PillComponent text="Angular" />
        <PillComponent text="Python" />
      </div>
    </>
  );
};

export default IBMJobDescComponent;
