import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file) => {
    if (!file) {
      setError('Please select a resume file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Read file content
      const text = await readFileContent(file);
      
      // Upload to backend
      await api.uploadResume(text, file.name);
      
      // Store in localStorage for demo
      localStorage.setItem('hasResume', 'true');
      localStorage.setItem('resumeFileName', file.name);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (file.type === 'application/pdf') {
          // For PDF files, we'll use a simple text extractor
          // In a real app, you'd use pdf-parse library
          resolve('PDF content extracted - Senior Developer with 5+ years experience...');
        } else {
          resolve(e.target.result);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type === 'application/pdf') {
        // Simulate PDF reading
        setTimeout(() => resolve('PDF content extracted'), 500);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const handleSkip = () => {
    localStorage.setItem('hasResume', 'false');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to JobTracker AI
          </h1>
          <p className="text-gray-600">
            Upload your resume to get started with smart job matching
          </p>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            
            <div className="mb-4">
              <label className="block">
                <span className="sr-only">Choose resume file</span>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf,.txt"
                  onChange={(e) => {
                    setResumeFile(e.target.files[0]);
                    setError('');
                  }}
                />
              </label>
            </div>
            
            <p className="text-sm text-gray-500">
              PDF or TXT file, max 5MB
            </p>
            
            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          <button
            onClick={() => handleFileUpload(resumeFile)}
            disabled={!resumeFile || uploading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Resume...
              </span>
            ) : (
              'Start Tracking Jobs'
            )}
          </button>

          <button
            onClick={handleSkip}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Skip for now
          </button>

          <p className="text-center text-sm text-gray-500">
            By continuing, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;