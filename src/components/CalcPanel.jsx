// src/components/CalcPanel.jsx
import React, { useState, useEffect } from 'react';

const offsets = [10, 5, -5, -10, 1, -1, 20, -20, 15, -15, 3, -3];

// 2桁±2桁で正の解を生成し、4択の選択肢を作る
function genQuestion(range) {
  const a = Math.floor(Math.random() * range) + 10;
  const b = Math.floor(Math.random() * range) + 10;
  const op = Math.random() < 0.5 ? '+' : '-';
  const correct = op === '+' ? a + b : a - b;
  if (correct <= 0) return genQuestion(range);

  // 誤答候補生成
  const candidates = offsets
    .map(off => correct + off)
    .filter(x => x > 0 && x !== correct);
  const distractors = [];
  const pool = [...candidates];
  while (distractors.length < 3 && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    distractors.push(pool.splice(idx, 1)[0]);
  }

  // 4択をシャッフル
  const options = [correct, ...distractors];
  while (options.length < 4) {
    const randOpt = Math.floor(Math.random() * 90) + 10;
    if (!options.includes(randOpt)) options.push(randOpt);
  }
  options.sort(() => Math.random() - 0.5);

  return { q: `${a} ${op} ${b} = ?`, correct, options };
}

export default function CalcPanel({ limitTime, onComplete, onGameOver, disabled, range, isCause }) {
  const [qa, setQa] = useState(genQuestion(range));
  const [timeLeft, setTimeLeft] = useState(limitTime);
  const [feedback, setFeedback] = useState(null); // 'ok' or 'ng'

  // 時間制限カウントダウン
  useEffect(() => {
    if (disabled) return;
    if (timeLeft <= 0) {
      onGameOver();
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, disabled]);

  useEffect(() => {
   setQa(genQuestion(range));
   setTimeLeft(limitTime);
   setFeedback(null);
  }, [limitTime, range]);

  const handleSelect = val => {
    if (disabled || feedback) return;
    const isCorrect = val === qa.correct;
    setFeedback(isCorrect ? 'ok' : 'ng');
    if (isCorrect) {
      onComplete();
      setTimeLeft(limitTime);
    }
    // 0.5秒後に次の問題へ
    setTimeout(() => {
      setFeedback(null);
      setQa(genQuestion(range));
    }, 500);
  };

  return (
    <div className={`panel ${isCause ? 'panel-cause' : ''}`}  style={{ position: 'relative' }}>
      <h3>計算</h3>
      <p style={{ fontSize: '18px', margin: '4px 0' }}>{qa.q}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {qa.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            disabled={disabled || feedback}
            style={{ padding: '8px', fontSize: '16px' }}
          >
            {opt}
          </button>
        ))}
      </div>
      {/* フィードバック */}
      {feedback === 'ok' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '48px', color: '#76c7c0'
        }}>✔</div>
      )}
      {feedback === 'ng' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '48px', color: '#f00'
        }}>✕</div>
      )}
      <div className="progress-bar" style={{ width: `${(timeLeft / limitTime) * 100}%` }} />
    </div>
  );
}