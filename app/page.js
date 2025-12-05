'use client';

import { useState, useRef, useEffect } from 'react';
import UploadZone from '@/components/UploadZone';
import ModerationResults from '@/components/ModerationResults';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setResults(null);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append('video', file);

    try {
      // Simulate upload progress for UX (only up to 85%)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 85) return prev; // Stop at 85% until API completes
          return prev + Math.random() * 20;
        });
      }, 400);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(95); // Move to 95% while processing response

      const data = await response.json();

      // Only set to 100% after successfully processing the response
      setUploadProgress(100);

      if (!response.ok) {
        setError(data.error || 'Upload failed');
        setResults(data.decision ? { ...data, rejected: true } : null);
      } else {
        setResults({ ...data, rejected: false });
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      setUploadProgress(0);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 800);
    }
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#ffffff' }}>
            Video Upload & Moderation
          </h1>
          <p className="text-lg" style={{ color: '#b0b0b0' }}>
            Fast, local detection for NSFW and Gore content
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {uploading ? (
            <LoadingScreen progress={uploadProgress} />
          ) : !results ? (
            <UploadZone
              onUpload={handleUpload}
              uploading={uploading}
              error={error}
            />
          ) : (
            <>
              <ModerationResults data={results} />
              <button
                onClick={() => {
                  setResults(null);
                  setError(null);
                }}
                className="w-full mt-6 px-6 py-3 font-semibold rounded-lg transition"
                style={{
                  backgroundColor: '#1d8659',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = '#22a861')
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = '#1d8659')
                }
              >
                Upload Another Video
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
