'use client';

import { Zap, Shield, AlertTriangle } from 'lucide-react';

export default function LoadingScreen({ progress }) {
  const stages = [
    { name: 'Uploading', icon: Zap, complete: progress > 30 },
    { name: 'Scanning Frames', icon: Shield, complete: progress > 60 },
    { name: 'Analyzing Content', icon: AlertTriangle, complete: progress > 85 },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Animated Background */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .slide-in { animation: slide-in 0.5s ease-out; }
        .spin-fast { animation: spin-fast 1s linear infinite; }
      `}</style>

      {/* Main Loading Card */}
      <div
        className="p-8 rounded-lg text-center"
        style={{
          backgroundColor: 'rgba(29, 134, 89, 0.05)',
          borderLeft: '4px solid #22a861',
        }}
      >
        {/* Animated Spinner */}
        <div className="flex justify-center mb-6">
          <div
            className="spin-fast"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '3px solid rgba(34, 168, 97, 0.2)',
              borderTop: '3px solid #22a861',
            }}
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>
          Analyzing Video
        </h2>
        <p style={{ color: '#b0b0b0' }} className="mb-6">
          Running detection engines for NSFW and Gore content
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div
            className="w-full bg-gray-800 rounded-full h-3 overflow-hidden"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <div
              className="h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: '#22a861',
                width: `${progress}%`,
                boxShadow: '0 0 10px rgba(34, 168, 97, 0.6)',
              }}
            />
          </div>
          <p style={{ color: '#b0b0b0' }} className="text-sm mt-2">
            {Math.round(progress)}% Complete
          </p>
        </div>

        {/* Stage Indicators */}
        <div className="space-y-3">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div
                key={idx}
                className="slide-in flex items-center gap-3 p-3 rounded"
                style={{
                  backgroundColor: stage.complete
                    ? 'rgba(34, 168, 97, 0.15)'
                    : 'rgba(93, 93, 93, 0.1)',
                  animationDelay: `${idx * 100}ms`,
                }}
              >
                <div>
                  {stage.complete ? (
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#22a861',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <path d="M2 8l4 4 8-10" />
                      </svg>
                    </div>
                  ) : (
                    <Icon
                      size={24}
                      style={{ color: '#22a861', opacity: 0.6 }}
                      className="pulse-glow"
                    />
                  )}
                </div>
                <span
                  style={{
                    color: stage.complete ? '#22a861' : '#b0b0b0',
                    fontWeight: stage.complete ? '600' : '400',
                  }}
                >
                  {stage.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: 'rgba(29, 134, 89, 0.1)' }}
        >
          <p style={{ color: '#b0b0b0' }} className="text-xs mb-2 uppercase">
            Detection
          </p>
          <p style={{ color: '#22a861' }} className="font-bold">
            NSFW + Gore
          </p>
        </div>
        <div
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: 'rgba(29, 134, 89, 0.1)' }}
        >
          <p style={{ color: '#b0b0b0' }} className="text-xs mb-2 uppercase">
            Processing
          </p>
          <p style={{ color: '#22a861' }} className="font-bold">
            Live Analysis
          </p>
        </div>
      </div>

      {/* Status Message */}
      <p style={{ color: '#b0b0b0', fontSize: '13px' }} className="text-center">
        This may take a few moments depending on video length...
      </p>
    </div>
  );
}
