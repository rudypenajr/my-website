import SpecialAnchor from "@/components/base/SpecialAnchorComponent";

//colorkit.co/palettes/gradient/
//colorkit.co/palette/c7522a-cb6036-cf6e41-d68a58-dea66f-e5c185-f0daa5-fbf2c4-dae0b8-b8cdab/

// https://digitalsynopsis.com/design/beautiful-color-gradient-palettes/
// Number 22:
// #264D59 -- #022c22 emerald-950
// #43978D -- #0d9488 teal-600
// #F9E07F -- #fef08a yellow-200
// #F9AD6A -- #fdba74 orange-300
// #D46C4E -- #b45309 amber-700

export default function Home() {
  return (
    <>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter mb-80">
        🚧 🚧 🚧{" "}
        <span className="mx-2">
          Pardon the mess. Site is working in progress.
        </span>
        🚧 🚧 🚧
      </h1>

      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        👋 <span className="mx-2">hello</span> /{" "}
        <span className="mx-2">howdy</span> / <span className="mx-2">hola</span>
      </h1>

      {/* <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        🤠 <span className="ml-2 mr-1">my</span>
        <span className="mx-1">name</span>
        <span className="mx-1">is</span>
        <span className="mx-1">rudy</span>
      </h1> */}

      <h1 className="font-medium text-2xl mb-8 flex justify-end tracking-tighter">
        <span className="mx-1">my</span>
        <span className="mx-1">name</span>
        <span className="mx-1">is</span>
        <span className="ml-1 mr-2">rudy</span> 🤠
      </h1>

      <p>
        I&apos;m, <span className="font-bold">primarily</span>, a frontend
        developer focusing on React. I currently work (link to resume) as a
        Senior Software Engineer at{" "}
        <SpecialAnchor anchorHref="https://www.dtn.com/" anchorText="DTN" />. At{" "}
        <SpecialAnchor anchorHref="https://www.dtn.com/" anchorText="DTN" />, I
        lead a team of developers who build and maintain a suite of
        tools/packages such as a design system, a component library,
        authentication that support{" "}
        <SpecialAnchor anchorHref="https://www.dtn.com/" anchorText="DTN" />
        {""} developers.
      </p>

      <div className="my-6"></div>

      <p>
        I used the word <span className="font-bold">primarily</span> because,
        within my career path, I have had the opportunity to go Full Stack,
        working in languages such as Golang (Chi / Viper / Cobra) and Python
        (Flask / Python).
      </p>

      <div className="my-10"></div>

      <hr />
    </>
  );
}
