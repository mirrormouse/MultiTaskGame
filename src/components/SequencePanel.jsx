import React, { useState, useEffect, useRef } from 'react';

// 英単語をアルファベット順に並べ替えるパネル
export default function SequencePanel({ limitTime, onComplete, onGameOver, disabled, numWords }) {
  const [cards, setCards] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(limitTime);
  const containerRef = useRef(null);
  const touchIndexRef = useRef(null);

  // 単語候補リスト
  const WORDS = [
    'A','B','C','D','E','F','G','H','I','J',
    'K','L','M','N','O','P','Q','R','S','T',
    'U','V','W','X','Y','Z'
  ];

  // 配列をシャッフル
  const shuffleArr = arr => [...arr].sort(() => Math.random() - 0.5);

  // リセット: numWords単語を選んでシャッフル
  const reset = () => {
    const selected = shuffleArr(WORDS).slice(0, numWords);
    setCards(selected);
    setTimeLeft(limitTime);
  };

  // 初期化
  useEffect(reset, []);

  // 制限時間カウントダウン
  useEffect(() => {
    if (disabled) return;
    if (timeLeft <= 0) { onGameOver(); return; }
    const tid = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(tid);
  }, [timeLeft, disabled, onGameOver]);

  // ドラッグ開始
  const handleDragStart = i => {
    if (disabled) return;
    setDragIndex(i);
  };

  // ドラッグ要素がエンターした位置で配列更新
  const handleDragEnter = i => {
    if (disabled || dragIndex === null || i === dragIndex) return;
    setCards(prev => {
      const newCards = [...prev];
      const [moved] = newCards.splice(dragIndex, 1);
      newCards.splice(i, 0, moved);
      return newCards;
    });
    setDragIndex(i);
  };

  // ドロップ完了
  const handleDrop = e => {
    e.preventDefault();
    setDragIndex(null);
  };

  // タッチ開始
  const handleTouchStart = (i, e) => {
    if (disabled) return;
    touchIndexRef.current = i;
  };

  // タッチ移動で並び替え
  const handleTouchMove = e => {
    if (disabled || touchIndexRef.current === null) return;
    const touchY = e.touches[0].clientY;
    const container = containerRef.current;
    if (!container) return;
    const { top, height } = container.getBoundingClientRect();
    const relativeY = touchY - top;
    const cardHeight = height / cards.length;
    let newIndex = Math.floor(relativeY / cardHeight);
    newIndex = Math.max(0, Math.min(cards.length - 1, newIndex));
    if (newIndex !== touchIndexRef.current) {
      setCards(prev => {
        const newCards = [...prev];
        const [moved] = newCards.splice(touchIndexRef.current, 1);
        newCards.splice(newIndex, 0, moved);
        return newCards;
      });
      touchIndexRef.current = newIndex;
    }
  };

  // タッチ終了
  const handleTouchEnd = () => {
    touchIndexRef.current = null;
  };

  // 送信: アルファベット順かチェック
  const handleSubmit = () => {
    if (disabled) return;
    const sorted = [...cards].sort((a, b) => a.localeCompare(b));
    const correct = cards.every((w, idx) => w === sorted[idx]);
    if (correct) {
      onComplete();
      reset();
    }
  };

  return (
    <div className="panel" ref={containerRef}>
      <h3>アルファベット順に並べ替え</h3>
      <div style={{ display: 'flex', flexDirection: 'column', margin: '10px 0' }}>
        {cards.map((word, i) => (
          <div
            key={i}
            draggable={!disabled}
            onDragStart={() => handleDragStart(i)}
            onDragEnter={() => handleDragEnter(i)}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onTouchStart={e => handleTouchStart(i, e)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              width: '80%',
              margin: '4px auto',
              padding: '8px',
              border: '2px solid #76c7c0',
              borderRadius: 4,
              background: '#e0f7f5',
              cursor: disabled ? 'default' : 'move',
              userSelect: 'none',
              textAlign: 'center',
              fontSize: 16
            }}
          >
            {word}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={disabled}
        style={{ display: 'block', margin: '0 auto 8px', padding: '6px 12px' }}
      >
        送信
      </button>
      <div className="progress-bar" style={{ width: `${(timeLeft / limitTime) * 100}%` }} />
    </div>
  );
}
