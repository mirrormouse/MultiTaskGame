// src/components/GraphPanel.jsx
import React, { useState, useEffect } from 'react';

export default function GraphPanel({ onComplete, onGameOver, disabled, tickMs, isCause  }) {
  const length = 20;
  const threshold = 75;
  // 初期データ：最初の10要素は0、それ以降はランダム
  const [data, setData] = useState(
    Array.from({ length }, (_, i) => (i < 10 ? 0 : rand()))
  );

  // カウントダウン
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (disabled) return;
    const id = setTimeout(() => setTime(t => t+1), 1000);
    if (time >= 5) {
      onComplete();
      console.log('Game completed');
    }
    return () => clearTimeout(id);
  }, [time, disabled]);

  // 3秒ごとに必ずデータをスライド更新（クリックに依存しない）
  useEffect(() => {
    if (disabled) return;
    const iv = setInterval(() => {
      setData(prev => {
        // 左端が閾値超過ならゲームオーバー
        if (prev[0] > threshold) {
          onGameOver();
          clearInterval(iv);
          return prev;
        }
        // 最新データを末尾に追加
        return [...prev.slice(1), rand()];
      });
    }, tickMs);
    return () => clearInterval(iv);
  }, [disabled, tickMs]);

  

  // 閾値超過点をクリックで直接低減
  const handlePoint = i => {
    if (disabled || data[i] <= threshold) return;
    setData(prev => {
      const nd = [...prev];
      nd[i] = Math.max(threshold * 0.5, nd[i] - 30);
      return nd;
    });
    onComplete();
  };

  // 固定スケール：0〜100
  const w = 400, h = 160;
  const scaleY = v => h - (v / 100) * h;
  const points = data.map((v, i) => `${(i / (length - 1)) * w},${scaleY(v)}`);

  return (
    <div className={`panel ${isCause ? 'panel-cause' : ''}`} >
      <h3>異常値をクリックして解決</h3>
      <svg width={w} height={h} style={{ border: '1px solid #ccc' }}>
        {/* 安全基準線 */}
        <line
          x1={0}
          y1={scaleY(threshold)}
          x2={w}
          y2={scaleY(threshold)}
          stroke="#f00"
          strokeDasharray="4"
        />
        {/* 折れ線 */}
        <polyline points={points.join(' ')} fill="none" stroke="#333" />
        {/* データ点 */}
        {data.map((v, i) => (
          <circle
            key={i}
            cx={(i / (length - 1)) * w}
            cy={scaleY(v)}
            r={6}
            fill={v > threshold ? '#f00' : '#333'}
            onClick={() => handlePoint(i)}
            style={{ cursor: v > threshold && !disabled ? 'pointer' : 'default' }}
          />
        ))}
      </svg>
    </div>
  );
}

function rand() {
  return Math.floor(Math.random() * 100);
}