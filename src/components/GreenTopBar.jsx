import { X } from '@phosphor-icons/react';
import ProgressBar from './ProgressBar';

export default function GreenTopBar({ leftIcon, leftOnClick, title, rightContent, progressCurrent, progressTotal }) {
  return (
    <div>
      <div style={{
        background: 'linear-gradient(180deg, #56C45A 0%, #4CAF50 40%, #3D9142 100%)', padding: '10px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 48,
        boxShadow: '0 4px 20px rgba(56,142,60,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {leftIcon && (
            <button
              onClick={leftOnClick}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {leftIcon === '✕' ? (
                <X size={22} weight="bold" color="white" />
              ) : (
                <span style={{ fontSize: 20, color: 'white' }}>{leftIcon}</span>
              )}
            </button>
          )}
          {title && (
            <span style={{ fontSize: 16, fontWeight: 800, color: 'white', fontFamily: 'Nunito, sans-serif' }}>
              {title}
            </span>
          )}
        </div>
        {rightContent}
      </div>
      {progressCurrent !== undefined && progressTotal !== undefined && (
        <ProgressBar current={progressCurrent} total={progressTotal} />
      )}
    </div>
  );
}
