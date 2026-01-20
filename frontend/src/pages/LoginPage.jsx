import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileUpload = async (file) => {
    if (!file) {
      setError('Please select a resume file');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Read file content (simplified)
      let text = '';
      if (file.type === 'application/pdf') {
        text = `PDF Resume: ${file.name}\n\nSenior Developer with 5+ years experience in React, Node.js, and modern web technologies.`;
      } else {
        text = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsText(file);
        });
      }

      // Call API (will use mock in demo mode)
      const result = await api.uploadResume(text, file.name);
      
      // Store in localStorage
      localStorage.setItem('hasResume', 'true');
      localStorage.setItem('resumeFileName', file.name);
      localStorage.setItem('userId', 'demo_user_' + Date.now());
      
      setSuccess('✓ Resume uploaded successfully!');
      
      // Navigate after delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      console.error('Upload error:', err);
      
      // Even if API fails, continue in demo mode
      setError('Note: Using demo mode (backend offline).');
      
      localStorage.setItem('hasResume', 'true');
      localStorage.setItem('resumeFileName', file.name);
      localStorage.setItem('userId', 'demo_user_' + Date.now());
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasResume', 'false');
    localStorage.setItem('userId', 'demo_user_' + Date.now());
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
            Upload your resume to get personalized job matches
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
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={(e) => {
                    setResumeFile(e.target.files[0]);
                    setError('');
                    setSuccess('');
                  }}
                />
              </label>
            </div>
            
            <p className="text-sm text-gray-500">
              PDF, TXT, DOC, DOCX - max 5MB
            </p>
            
            {error && (
              <p className="text-sm text-yellow-600 mt-2 bg-yellow-50 p-2 rounded">
                {error}
              </p>
            )}
            
            {success && (
              <p className="text-sm text-green-600 mt-2 bg-green-50 p-2 rounded">
                {success}
              </p>
            )}
          </div>

          <button
            onClick={() => handleFileUpload(resumeFile)}
            disabled={!resumeFile || uploading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Upload & Get Matches'
            )}
          </button>

          <button
            onClick={handleSkip}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Skip & Browse Jobs
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Demo Mode: All features work with sample data
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Backend connection optional for demonstration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;