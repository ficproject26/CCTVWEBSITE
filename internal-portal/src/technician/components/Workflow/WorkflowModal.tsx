import React, { useState } from 'react';
import type { Job, InspectionSummary, DailyReport } from '../../types/job';
import { PhotoStep } from './PhotoStep';
import { CompletionSummaryStep } from './CompletionSummaryStep';
import { 
  X, 
  Camera, 
  CheckCircle2, 
  Wrench 
} from 'lucide-react';

interface WorkflowModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (jobId: string, status: any, note?: string) => Promise<void>;
  onSaveInspection: (jobId: string, inspection: InspectionSummary) => Promise<void>;
  onAddDailyReport: (jobId: string, report: Omit<DailyReport, 'id' | 'createdAt'>) => Promise<void>;
  onUploadPhoto: (jobId: string, photoUrl: string, caption: string, type: 'BEFORE' | 'AFTER') => Promise<void>;
  onCompleteJob: (jobId: string, notes: string, signature?: string) => Promise<void>;
}

export const WorkflowModal: React.FC<WorkflowModalProps> = ({
  job,
  isOpen,
  onClose,
  onSaveInspection,
  onAddDailyReport,
  onUploadPhoto,
  onCompleteJob,
}) => {
  const [currentStep, setCurrentStep] = useState<
    'BEFORE_PHOTOS' | 'AFTER_PHOTOS' | 'COMPLETION'
  >('BEFORE_PHOTOS');

  if (!isOpen || !job) return null;

  const steps = [
    { id: 'BEFORE_PHOTOS', label: 'Before Photos', icon: Camera },
    { id: 'AFTER_PHOTOS', label: 'After Photos', icon: Camera },
    { id: 'COMPLETION', label: 'Sign-off & Done', icon: CheckCircle2 },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white">
              <Wrench className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-zinc-400">{job.jobCode}</span>
                <span className="text-[10px] bg-zinc-800 text-emerald-400 px-2 py-0.5 rounded font-semibold uppercase">
                  {job.status.replace(/_/g, ' ')}
                </span>
              </div>
              <h2 className="text-sm font-semibold text-white mt-0.5">{job.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-3 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px] space-x-2">
            {steps.map((st, index) => {
              const Icon = st.icon;
              const isActive = currentStep === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setCurrentStep(st.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>
                    {index + 1}. {st.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content Body */}
        <div className="p-6 flex-1 overflow-y-auto bg-zinc-55/50">
          {currentStep === 'BEFORE_PHOTOS' && (
            <PhotoStep
              job={job}
              type="BEFORE"
              onUploadPhoto={onUploadPhoto}
              onNextStep={() => setCurrentStep('AFTER_PHOTOS')}
            />
          )}

          {currentStep === 'AFTER_PHOTOS' && (
            <PhotoStep
              job={job}
              type="AFTER"
              onUploadPhoto={onUploadPhoto}
              onNextStep={() => setCurrentStep('COMPLETION')}
            />
          )}

          {currentStep === 'COMPLETION' && (
            <CompletionSummaryStep
              job={job}
              onCompleteJob={onCompleteJob}
              onCloseWorkflow={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};
