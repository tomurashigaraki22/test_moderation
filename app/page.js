'use client';

import { useState, useRef } from 'react';
import UploadZone from '@/components/UploadZone';
import ModerationResults from '@/components/ModerationResults';

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Upload failed');
        setResults(data.decision ? { ...data, rejected: true } : null);
      } else {
        setResults({ ...data, rejected: false });
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setUploading(false);
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
          {!results ? (
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
