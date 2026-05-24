import { useNavigate } from "react-router-dom";
import SectionOverview from "./SectionOverview";
import SectionRisks from "./SectionRisks";
import SectionProtection from "./SectionProtection"


export default function CrossSiteScriptingGuide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fdfcf9] text-black px-4 sm:px-6 py-10">

      <div className="max-w-6xl mx-auto flex flex-col gap-20">
        <SectionOverview />
        <SectionRisks />
        <SectionProtection />

      </div>
    </div>
  );
}
