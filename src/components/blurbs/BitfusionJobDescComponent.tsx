import React from "react";

import SpecialAnchor from "@/components/base/SpecialAnchorComponent";
import PillComponent from "@/components/base/PillComponent";

export const BitfusionJobDescComponent = () => {
  return (
    <>
      <h2 className="font-medium text-xl mb-1 tracking-tighter">
        <SpecialAnchor
          anchorHref="https://docs.vmware.com/en/VMware-vSphere-Bitfusion/4.0/Install-Guide/GUID-6F08501B-F3CB-4032-939C-EACEC0605FE1.html"
          anchorText="Bitfusion"
        />
      </h2>

      <p className="subtitle text-neutral-600 dark:text-neutral-400 text-sm">
        Software Engineer, 2017 - 2018
      </p>

      <p>
        Before Bitfusion&apos;s acquisition by VMWare, there was a software team
        I was apart of. As one one of the three Software Engineers, our
        objective was to develop a CLI tool, called Flex Pro, that would create
        and manage clusters in Amazon Web Services. Those clusters could be used
        by Data Scientists to create Jobs for creating, training and/or the
        exploration of their ML Models.
      </p>
      <p>
        Flex Pro (the CLI tool) was built in Golang using Cobra, Viper, and
        KOPS. I also managed the client tools, which were built using React and
        NodeJS. The users essentially could use the CLI tool to view their
        workloads or go to browser to view their workloads.
      </p>

      <div className="pills">
        <PillComponent text="Golang" />
        <PillComponent text="NodeJS" />
        <PillComponent text="React" />
      </div>
    </>
  );
};

export default BitfusionJobDescComponent;
