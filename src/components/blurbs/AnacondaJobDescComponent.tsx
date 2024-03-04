import { CallOutComponent } from "@/components/base/CallOutComponent";
import SpecialAnchor, {
  SpecialAnchorComponent,
} from "@/components/base/SpecialAnchorComponent";

export const AnacondaJobDescComponent = () => {
  return (
    <>
      <h2 className="font-medium text-xl mb-1 tracking-tighter">
        <SpecialAnchorComponent
          anchorHref="https://www.anaconda.com/"
          anchorText="Anaconda, Inc."
        />
      </h2>
      <p className="subtitle text-neutral-600 dark:text-neutral-400 text-sm">
        Senior Software Engineer III, 2019 - 2022
      </p>
      Hy-Vee, an almost 100-year-old grocery chain in the United States, wanted
      to build a new version of their digital storefront. I joined a team of
      product engineers working across web and mobile to rebuild their legacy
      .NET application (~500k MAU) with React and React Native.
      <p>
        I joined Anaconda as an Application Engineer focusing on developing
        features for their existing Anaconda Enterprise 5 Solution using Angular
        and Python (Flask). While working on Anaconda Enterprise 5, I increased
        our testing coverage from 2% to 60%, moving us from{" "}
        <SpecialAnchorComponent
          anchorHref="https://angular.io/guide/testing"
          anchorText="Karma"
        ></SpecialAnchorComponent>{" "}
        to{" "}
        <SpecialAnchorComponent
          anchorHref="https://jestjs.io/"
          anchorText="Jest"
        ></SpecialAnchorComponent>
        .
      </p>
      <p>
        Within the coming years, I worked on multiple initiatives to help
        reshape how Anaconda was viewed, moving beyond just a package management
        service -
        <SpecialAnchorComponent
          anchorHref="https://anaconda.org/"
          anchorText="anaconda.org"
        ></SpecialAnchorComponent>
        .
      </p>
      <ul>
        <li>
          <p>
            I led the initial development for{" "}
            <SpecialAnchorComponent
              anchorHref="https://www.anaconda.com/"
              anchorText="Nucleus"
            ></SpecialAnchorComponent>
            , which would be Anaconda&apos;s new front facing website . Nucleus
            was initially built in React, which we later moved to Angular.
            Anaconda was primarily an Angular shop, hence the move from React to
            Anaconda.
          </p>
          <p>
            After{" "}
            <SpecialAnchorComponent
              anchorHref="https://www.anaconda.com/"
              anchorText="Nucleus"
            ></SpecialAnchorComponent>
            was defined, I became a Full Stack Developer for Anaconda. I was
            responsible for developing features across multiple products, which
            involved architecture discussions with Backend Engineers and DevOps
            using Angular, React, and Python/FastAPI
          </p>

          <p>
            Within that lifespan, we lost our Product Manager. With no Product
            Manager, I created a Hypothesis Initiative, which was essentially an
            Excel Document with ideas, features, offerings that could help grow
            Nucleus. The engineering team could pull from this document, develop
            a Story in JIRA, the required tasks and develop the feature. The
            catch was for the engineer to come back to that feature and measure
            it&apos;s effectiveness using
          </p>
        </li>
        <li>
          I lead a few MVP products built in React that assisted with Anaconda
          gaining partnerships with HP, Snowflake, and Microsoft. Out of those
          variety of MVP products, 40% of them would ultimately become products,
          offerings, and/or features that would live in Nucleus such as{" "}
          <SpecialAnchorComponent
            anchorHref="https://www.anaconda.com/anaconda-notebooks"
            anchorText="Anaconda Notebooks"
          ></SpecialAnchorComponent>
          .
        </li>
      </ul>
    </>
  );
};

export default AnacondaJobDescComponent;
