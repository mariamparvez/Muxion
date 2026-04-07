import { CheckCircle } from "lucide-react";

interface ProgressBarProps {
  percentage: number;
  completedCount: number;
  totalCount: number;
}

export function ProgressBar({ percentage, completedCount, totalCount }: ProgressBarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm">Course Progress</span>
        </div>
        <span className="text-sm">
          {completedCount} of {totalCount} lessons completed
        </span>
      </div>
      
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="mt-2 text-right">
        <span className="text-sm text-gray-600">{percentage}% Complete</span>
      </div>
    </div>
  );
}
