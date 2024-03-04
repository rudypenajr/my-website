import AnacondaJobDescComponent from "@/components/blurbs/AnacondaJobDescComponent";
import BitfusionJobDescComponent from "@/components/blurbs/BitfusionJobDescComponent";
import DTNJobDescComponent from "@/components/blurbs/DTNJobDescComponent";
import IBMJobDescComponent from "@/components/blurbs/IBMJobDescComponent";

export default function WorkPage() {
  return (
    <>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">my work</h1>

      <div className="prose prose-neutral dark:prose-invert">
        <p>
          Focused on building tools and products that developers love while
          balancing the need for teams to move and fail fast. Below is a summary
          of my work so far.
        </p>

        <hr className="my-6 border-neutral-100 dark:border-neutral-800"></hr>

        <DTNJobDescComponent />

        <hr className="my-6 border-neutral-100 dark:border-neutral-800"></hr>

        <AnacondaJobDescComponent />

        <hr className="my-6 border-neutral-100 dark:border-neutral-800"></hr>

        <IBMJobDescComponent />

        <hr className="my-6 border-neutral-100 dark:border-neutral-800"></hr>

        <BitfusionJobDescComponent />
      </div>
    </>
  );
}
