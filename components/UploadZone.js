'use client';

import { useState, useCallback } from 'react';
import { Upload, AlertCircle, Check } from 'lucide-react';

export default function UploadZone({ onUpload, uploading, error }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setUploadedFile(file);
        onUpload(file);
      } else {
        alert('Please drop a video file');
      }
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      setUploadedFile(files[0]);
      onUpload(files[0]);
    }
  };

  return (
    <div className="w-full">
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className="relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer"
        style={{
          borderColor: isDragActive ? '#22a861' : '#1d8659',
          backgroundColor: isDragActive ? 'rgba(29, 134, 89, 0.15)' : 'rgba(29, 134, 89, 0.05)',
          transform: isDragActive ? 'scale(1.01)' : 'scale(1)',
        }}
      >
        <input
          type="file"
          id="fileInput"
          accept="video/*"
          onChange={handleChange}
          disabled={uploading}
          className="hidden"
        />

        <label
          htmlFor="fileInput"
          className="cursor-pointer flex flex-col items-center gap-3"
        >
          <div className="bounce-subtle">
            <Upload
              size={48}
              style={{ color: '#22a861', opacity: uploading ? 0.6 : 1 }}
            />
          </div>
          <div>
            <p className="text-xl font-semibold" style={{ color: '#ffffff' }}>
              {uploading ? 'Uploading & Analyzing...' : 'Drop your video here'}
            </p>
            <p style={{ color: '#b0b0b0' }} className="text-sm mt-1">
              or click to select (MP4, WebM, etc.)
            </p>
          </div>
        </label>

        {uploadedFile && !uploading && (
          <div className="mt-4 fade-in p-3 rounded-lg" style={{ backgroundColor: 'rgba(34, 168, 97, 0.1)' }}>
            <div className="flex items-center gap-2" style={{ color: '#22a861' }}>
              <Check size={20} />
              <span className="text-sm font-medium">{uploadedFile.name}</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div
          className="mt-4 p-4 rounded-lg flex gap-3"
          style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', borderLeft: '4px solid #dc2626' }}
        >
          <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }} />
          <div>
            <p style={{ color: '#ffffff' }} className="font-semibold">
              Error
            </p>
            <p style={{ color: '#fca5a5' }} className="text-sm">
              {error}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
