'use client';

import { useState, useCallback } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

export default function UploadZone({ onUpload, uploading, error }) {
  const [isDragActive, setIsDragActive] = useState(false);

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
        onUpload(file);
      } else {
        alert('Please drop a video file');
      }
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      onUpload(files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className="relative border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer"
        style={{
          borderColor: isDragActive ? '#22a861' : '#1d8659',
          backgroundColor: isDragActive ? 'rgba(29, 134, 89, 0.1)' : 'rgba(29, 134, 89, 0.05)',
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
          <Upload
            size={48}
            style={{ color: '#22a861', opacity: uploading ? 0.6 : 1 }}
          />
          <div>
            <p className="text-xl font-semibold" style={{ color: '#ffffff' }}>
              {uploading ? 'Uploading & Analyzing...' : 'Drop your video here'}
            </p>
            <p style={{ color: '#b0b0b0' }} className="text-sm mt-1">
              or click to select (MP4, WebM, etc.)
            </p>
          </div>
        </label>

        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: '#22a861',
                  width: '66%',
                }}
              />
            </div>
            <p style={{ color: '#b0b0b0' }} className="text-xs mt-2">
              Running detection engines...
            </p>
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
