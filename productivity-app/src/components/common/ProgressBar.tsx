import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  percentage: number;
  height?: number;
  color?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  height = 8,
  color,
  showLabel = false,
  animated = true,
}) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  const getColor = () => {
    if (color) return color;
    if (clampedPercentage === 100) return '#22c55e';
    if (clampedPercentage >= 75) return '#3b82f6';
    if (clampedPercentage >= 50) return '#8b5cf6';
    if (clampedPercentage >= 25) return '#f97316';
    return '#94a3b8';
  };

  const barColor = getColor();

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-500 font-medium">{clampedPercentage}%</span>
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: `${height}px`, backgroundColor: '#e2e8f0' }}
      >
        {animated ? (
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: barColor }}
            initial={{ width: 0 }}
            animate={{ width: `${clampedPercentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ) : (
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${clampedPercentage}%`, backgroundColor: barColor }}
          />
        )}
      </div>
    </div>
  );
};
