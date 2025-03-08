import { BriefcaseIcon } from "lucide-react";

const JobCard = ({ title, company, type }: { title: string; company: string; type: string }) => (
    <div className="bg-background rounded-2xl p-6 flex flex-col space-y-3 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-600">{company}</p>
        </div>
        <BriefcaseIcon className="w-6 h-6 text-[#448aff]" />
      </div>
      <span className="inline-block bg-[#448aff]/10 text-[#448aff] px-3 py-1 rounded-full text-sm">
        {type}
      </span>
    </div>
  );

  export default JobCard