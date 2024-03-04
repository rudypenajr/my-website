import { CallOutComponent } from "@/components/base/CallOutComponent";
import SpecialAnchor from "@/components/base/SpecialAnchorComponent";

export const DTNJobDescComponent = () => {
  return (
    <>
      <h2 className="font-medium text-xl mb-1 tracking-tighter">
        <SpecialAnchor anchorHref="https://www.dtn.com/" anchorText="DTN" />
      </h2>

      <p className="subtitle text-neutral-600 dark:text-neutral-400 text-sm">
        Senior Software Engineer
      </p>

      <p>
        I joined DTN within the early stages of their Research & Development
        expansion. DTN has grown through acquisitions so many of their
        applications and services range from older technologies such as BASIC to
        .NET 4.2 to modern technologies such as React and Next.js.
      </p>
      <p>
        My primary objective is to help develop and scale a variety of NPM
        packages that help support DTN developers. These NPM packages range from
        a component library (built in{" "}
        <SpecialAnchor anchorHref="https://react.dev/" anchorText="React" />
        ), handling Authentication (through{" "}
        <SpecialAnchor anchorHref="https://oauth.net/2/" anchorText="OAuth" />
        ), to a CLI tool (built in{" "}
        <SpecialAnchor anchorHref="https://yeoman.io/" anchorText="yeoman" />)
        that assists in bootstrapping an application for DTN developers within
        seconds.
      </p>

      <ul className="list-disc list-outside">
        <li>
          <span>
            In 2022, my focus was on growing our Component Library. This
            involved us working with UX/UI and working with DTN developers,
            trying to create a standard and trying to find a one-size-fits-all
            solution.
          </span>
        </li>

        <li>
          <p>
            At the end of 2022 and start of 2023, my responsibilities grew and I
            began to wear multiple hats. 🕵🏼‍♂️ 🧙🏼‍♂️ 👨🏼‍🚒 👨🏼‍🌾 👨🏼‍🍳 💂🏼‍♂️
          </p>
          <p>
            I was responsible for scaling our infrastructure to allow us to
            &ldquo;move fast, fail fast&ldquo; and simultaneously minimize
            defects.{" "}
            <CallOutComponent
              positive={false}
              text={`In 2022,
              we moved fast but we found that defects increased by 10%.`}
            ></CallOutComponent>{" "}
            We want to provide DTN developers with new features, resolved
            bugs/defects as quickly as possible while maintaining their trust
            and confidence.
          </p>

          <p>
            Within our monorepo, we use{" "}
            <SpecialAnchor
              anchorHref="https://lerna.js.org/"
              anchorText="lerna"
            />{" "}
            to promote and publish all of our NPM packages. In 2022, promotion
            and publishing was a manual step. It was costly, it could take up to
            a morning for us to release and deploy to our Dev, Staging, and
            Production environments. The solution was to make this process part
            of our CI/CD pipeline in Gitlab. We utilized{" "}
            <SpecialAnchor
              anchorHref="https://github.com/lerna/lerna/tree/main/libs/commands/version#--conventional-prerelease"
              anchorText="lerna's conventional prerelease command"
            />{" "}
            so when our team merged Pull Requests, our CI/CD would kick off and
            publish a release candidate. This gave our QA and the DTN Developers
            a way to test new features, bug fixes without any major impacts. If
            the issue persists, developers can revert back to production. At the
            end of a Sprint, we would publish our production versions of our
            packages.
          </p>
        </li>

        <li>
          <p>
            End of 2023, my focus shifted on a new initiative, Widgets. We
            wanted to replicate the success of our monorepo and NPM packages but
            there were caveats. Widgets needed to be both an NPM package but,
            also have have the capability to import the Widget through an
            Javascript file.
          </p>

          <p>
            The NPM package aspect and CI/CD process were simple and straight
            forward since we had solved it with our monorepo.{" "}
            <SpecialAnchor
              anchorHref="https://webpack.js.org/"
              anchorText="Webpack"
            />{" "}
            provided us with the ability to create these Javascript files per
            widget. We then extended the CI/CD pipeline to incorporate both
            aspects so the necessary commands would call our default
            <code>tsconfig.json</code> for NPM packages and the necessary
            command would call our <code>tsconfig.esm.json</code> for creating
            our Javascript files.
          </p>
        </li>
      </ul>
    </>
  );
};

export default DTNJobDescComponent;
