// src/components/TimerPanel.jsx
import React, { useState, useEffect } from 'react';

// 円グラフによるTimerPanel（青→赤ゾーン上書き、両方とも残量に応じて縮小）
export default function TimerPanel({ limitTime, onComplete, onGameOver, disabled, isCause }) {
  const [timeLeft, setTimeLeft] = useState(limitTime);
  // 赤ゾーン比率（30%〜60%）
  const [redRatio, setRedRatio] = useState(Math.random() * 0.3 + 0.3);

  // カウントダウン
  useEffect(() => {
    if (disabled) return;
    if (timeLeft <= 0) { onGameOver(); return; }
    const id = setTimeout(() => setTimeLeft(t => t-1), 1000);
    // console.log('timeLeft', timeLeft);
    return () => clearTimeout(id);
  }, [timeLeft, disabled]);

  // リセット可能か
  const canReset = timeLeft <= limitTime * redRatio;
  const handleReset = () => {
    if (!canReset || disabled) return;
    onComplete();
    setTimeLeft(limitTime);
    setRedRatio(Math.random() * 0.4 + 0.3);
  };

  // レベル切替後にリセット
  useEffect(() => {
    setTimeLeft(limitTime);
    setRedRatio(Math.random() * 0.4 + 0.3);
  }, [limitTime]);

  // SVG 円グラフ計算
  const size = 100;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = timeLeft / limitTime;
  const offset = circumference * (1 - percent);
  const blueLength = circumference * percent;
  const redFull = circumference * redRatio;
  // 赤 arc は青と redFull の最小
  const redLength = Math.min(blueLength, redFull);

  return (

    <div className={`panel ${isCause ? 'panel-cause' : ''}`}  style={{ textAlign: 'center' }}>
      <h3>赤色に到達したらカウントをリセット</h3>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* 背景灰 */}
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke="#eee" strokeWidth={strokeWidth}
        />
        {/* 青残量 */}
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke="#76c7c0" strokeWidth={strokeWidth}
          strokeDasharray={`${blueLength} ${circumference - blueLength}`}
          strokeDashoffset={0}
        />
        {/* 赤ゾーン(上書き) */}
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke="#f00" strokeWidth={strokeWidth}
          strokeDasharray={`${redLength} ${circumference - redLength}`}
          strokeDashoffset={0}
        />
      </svg>
      <div style={{ marginTop: '8px' }}>
        <button onClick={handleReset} disabled={!canReset || disabled}>
          リセット
        </button>
      </div>
    </div>
  );
}