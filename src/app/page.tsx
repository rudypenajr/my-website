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
      {/* 
      <h1 className="font-medium text-2xl mb-8 tracking-tighter mb-80">
        🚧 🚧 🚧{" "}
        <span className="mx-2">Pardon the mess. Site is work in progress.</span>
        🚧 🚧 🚧
      </h1>  
      */}
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        👋 <span className="mx-2">hello</span> /{" "}
        <span className="mx-2">howdy</span> / <span className="mx-2">hola</span>
      </h1>
      <h1 className="font-medium text-2xl mb-8 flex justify-end tracking-tighter">
        <span className="mx-1">my</span>
        <span className="mx-1">name</span>
        <span className="mx-1">is</span>
        <span className="ml-1 mr-2">rudy</span> 🤠
      </h1>
      <p className="leading-8">
        I focus on all things Javascript, such as{" "}
        <span className="font-bold">NextJS, React, and Express</span>. Outside
        of work, I love to play around with{" "}
        <span className="font-bold">Python and Golang</span>... while still
        using NextJS for my interfaces.
      </p>
      <div className="my-6"></div>
      <p className="leading-8">
        I currently work as a{" "}
        <span className="font-bold">Lead Software Engineer</span> at{" "}
        <SpecialAnchor anchorHref="https://www.dtn.com/" anchorText="DTN" />. At{" "}
        <SpecialAnchor anchorHref="https://www.dtn.com/" anchorText="DTN" />, I
        wear an array of hats <span className="font-bold">[🧢, 🎩, ⛑️]</span>{" "}
        from leading a team of engineers that builds and maintains a suite of
        NPM packages (i.e. design system, authentication) to carving out our new
        initiatives for Forward Deployed Engineers and setting an infrastructure
        for AI workflows.
      </p>

      <div className="my-6"></div>
      {/* <div className="my-10"></div> */}
    </>
  );
}
