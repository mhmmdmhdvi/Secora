import SectionOverview from "./SectionOverview";
import SectionRisks from "./SectionRisks";
import SectionProtection from "./SectionProtection";
import CodeSamples from "./CodeSamples";

export default function SQLInjectionGuide() {
  return (
    <div className="w-full min-h-screen bg-white px-4 sm:px-8 lg:px-16 py-10 sm:py-12 lg:py-16">
      
      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20 lg:space-y-24">
        <SectionOverview />
        <SectionRisks />
        <SectionProtection />
        <CodeSamples />
      </div>

    </div>
  );
}
