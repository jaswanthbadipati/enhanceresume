import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { ResumeAnalysis } from '../lib/resumeEnhancements';

interface EnhancementProgressProps {
  analysis: ResumeAnalysis | null;
  isProcessing: boolean;
}

export const EnhancementProgress: React.FC<EnhancementProgressProps> = ({
  analysis,
  isProcessing,
}) => {
  if (!analysis && !isProcessing) return null;

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold mb-6">Analysis Results</h2>
      
      {isProcessing ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-8 w-8"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          {Object.entries(analysis.suggestions).map(([category, items]) => (
            <div key={category} className="border-b pb-4 last:border-b-0">
              <h3 className="text-lg font-medium mb-3 capitalize">{category}</h3>
              <ul className="space-y-3">
                {items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    {item.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    ) : item.type === 'warning' ? (
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    )}
                    <div className="ml-3">
                      <p className="text-gray-800">{item.message}</p>
                      {item.suggestion && (
                        <p className="text-gray-600 text-sm mt-1">{item.suggestion}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Match Score</h4>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    {analysis.matchScore}% Match
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${analysis.matchScore}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                ></div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};