'use client';

import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function ModerationResults({ data }) {
  // Handle both success (moderation) and rejection (decision) response formats
  const moderation = data.moderation || data.decision;
  const { rejected, success, url, thumbnail_url, video_id, error } = data;

  if (!moderation) {
    return (
      <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', borderLeft: '4px solid #dc2626' }}>
        <h2 className="text-xl font-bold" style={{ color: '#dc2626' }}>Error</h2>
        <p style={{ color: '#b0b0b0' }} className="mt-2">{error || 'Unknown error'}</p>
      </div>
    );
  }

  const getDecisionColor = (decision) => {
    switch (decision) {
      case 'safe':
        return { bg: '#1d8659', text: '#ffffff', icon: CheckCircle2, label: 'Safe ✓' };
      case 'review':
        return { bg: '#b45309', text: '#ffffff', icon: AlertTriangle, label: 'Review' };
      case 'reject':
        return { bg: '#dc2626', text: '#ffffff', icon: XCircle, label: 'Rejected' };
      default:
        return { bg: '#6b7280', text: '#ffffff', icon: AlertTriangle, label: 'Unknown' };
    }
  };

  const decisionInfo = getDecisionColor(moderation?.finalDecision || 'unknown');
  const DecisionIcon = decisionInfo.icon;

  const EngineScore = ({ title, data: engineData, type }) => (
    <div
      className="p-4 rounded-lg"
      style={{ backgroundColor: 'rgba(93, 93, 93, 0.2)', borderLeft: `4px solid ${decisionInfo.bg}` }}
    >
      <h4 className="font-semibold uppercase text-sm mb-3" style={{ color: '#22a861' }}>
        {title}
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span style={{ color: '#b0b0b0' }}>Max Score:</span>
          <span style={{ color: '#ffffff' }} className="font-mono">
            {(engineData.max * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: '#b0b0b0' }}>Average Score:</span>
          <span style={{ color: '#ffffff' }} className="font-mono">
            {(engineData.average * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: '#b0b0b0' }}>Flagged Frames:</span>
          <span style={{ color: '#ffffff' }} className="font-mono font-bold">
            {engineData.framesFlagged}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-3">
        <div
          className="w-full bg-gray-700 rounded-full h-2"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <div
            className="h-2 rounded-full transition-all"
            style={{
              backgroundColor: engineData.max > 0.5 ? '#dc2626' : '#22a861',
              width: `${engineData.max * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* Decision Header */}
      <div
        className="p-6 rounded-lg flex items-start gap-4"
        style={{ backgroundColor: `${decisionInfo.bg}20`, borderLeft: `4px solid ${decisionInfo.bg}` }}
      >
        <DecisionIcon size={32} style={{ color: decisionInfo.bg, flexShrink: 0 }} />
        <div>
          <h2 className="text-2xl font-bold" style={{ color: decisionInfo.text }}>
            {decisionInfo.label}
          </h2>
          <p style={{ color: '#b0b0b0' }} className="text-sm mt-1">
            {moderation?.finalDecision === 'safe'
              ? 'Content passed all moderation checks'
              : moderation?.finalDecision === 'review'
              ? 'Content requires manual review'
              : 'Content failed moderation checks'}
          </p>
        </div>
      </div>

      {/* Video Info */}
      {(success || video_id) && (
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: 'rgba(29, 134, 89, 0.1)', borderLeft: '4px solid #22a861' }}
        >
          <h3 className="font-semibold mb-3" style={{ color: '#ffffff' }}>
            Upload Information
          </h3>
          <div className="space-y-2 text-sm">
            {video_id && (
              <div>
                <span style={{ color: '#b0b0b0' }}>Video ID:</span>
                <p style={{ color: '#ffffff' }} className="font-mono text-xs break-all">
                  {video_id}
                </p>
              </div>
            )}
            {thumbnail_url && (
              <div>
                <span style={{ color: '#b0b0b0' }}>Thumbnail:</span>
                <p style={{ color: '#22a861' }} className="text-xs truncate">
                  {thumbnail_url}
                </p>
              </div>
            )}
            {url && (
              <div>
                <span style={{ color: '#b0b0b0' }}>Video URL:</span>
                <p style={{ color: '#22a861' }} className="text-xs truncate">
                  {url}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detection Results */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg" style={{ color: '#ffffff' }}>
          Detection Analysis
        </h3>

        <EngineScore title="NSFW Detection" data={moderation.nsfw} type="nsfw" />
        <EngineScore title="Gore Detection" data={moderation.gore} type="gore" />
      </div>

      {/* Summary Stats */}
      <div
        className="p-4 rounded-lg grid grid-cols-2 gap-4"
        style={{ backgroundColor: 'rgba(93, 93, 93, 0.15)' }}
      >
        <div>
          <p style={{ color: '#b0b0b0' }} className="text-sm">
            Total Flagged Frames
          </p>
          <p style={{ color: '#ffffff' }} className="text-2xl font-bold mt-1">
            {moderation.nsfw.framesFlagged + moderation.gore.framesFlagged}
          </p>
        </div>
        <div>
          <p style={{ color: '#b0b0b0' }} className="text-sm">
            Max Combined Score
          </p>
          <p style={{ color: '#ffffff' }} className="text-2xl font-bold mt-1">
            {Math.max(moderation.nsfw.max, moderation.gore.max) > 0.5 ? '⚠️' : '✓'}{' '}
            {(Math.max(moderation.nsfw.max, moderation.gore.max) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
