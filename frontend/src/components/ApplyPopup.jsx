import React, { useEffect, useState } from 'react';
import { 
  XMarkIcon, 
  CheckCircleIcon,
  ClockIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

const ApplyPopup = ({ job, isOpen, onClose, onConfirm }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
    }
  }, [isOpen]);

  const updateApplicationMutation = useMutation({
    mutationFn: (status) => api.applyToJob(job),
    onSuccess: () => {
      queryClient.invalidateQueries(['applications']);
      queryClient.invalidateQueries(['stats']);
      onClose();
    }
  });

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    
    if (option === 'yes') {
      // If user says "Yes, Applied", update status immediately
      updateApplicationMutation.mutate();
      onConfirm && onConfirm('applied');
    } else if (option === 'browsing') {
      // If "No, just browsing", we don't track it
      onClose();
    } else if (option === 'earlier') {
      // If "Applied Earlier", update status but keep original date
      updateApplicationMutation.mutate();
      onConfirm && onConfirm('applied_earlier');
    }
  };

  if (!isOpen) return null;

  const options = [
    {
      id: 'yes',
      title: 'Yes, Applied',
      description: 'I submitted my application just now',
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'earlier',
      title: 'Applied Earlier',
      description: 'I had already applied to this position',
      icon: ClockIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'browsing',
      title: 'No, just browsing',
      description: 'I only viewed the job page',
      icon: QuestionMarkCircleIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Track Your Application
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <p className="text-gray-600">
              Did you apply to <span className="font-semibold">{job.job_title}</span> at{' '}
              <span className="font-semibold">{job.employer_name}</span>?
            </p>
          </div>

          {/* Options */}
          <div className="p-6 space-y-3">
            {options.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedOption === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={updateApplicationMutation.isLoading}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? `${option.borderColor} ring-2 ring-offset-2 ring-opacity-50`
                      : 'border-gray-200 hover:border-gray-300'
                  } ${option.bgColor}`}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg ${option.color} bg-white bg-opacity-50`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="ml-4">
                      <h4 className={`font-medium ${option.color}`}>
                        {option.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
            <div className="flex items-center text-sm text-gray-500">
              <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
              <span>
                Tracking helps us improve your job recommendations and keep you organized.
              </span>
            </div>
            
            {updateApplicationMutation.isLoading && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Updating your applications...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyPopup;