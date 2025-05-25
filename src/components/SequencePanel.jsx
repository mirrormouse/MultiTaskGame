// src/components/SequencePanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// 英単語をアルファベット順に並べ替えるパネル
export default function SequencePanel({ limitTime, onComplete, onGameOver, disabled, numWords, isCause }) {
  const [cards, setCards] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(limitTime);

  // 単語候補リスト
  const WORDS = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  // 配列をシャッフル
  const shuffleArr = arr => [...arr].sort(() => Math.random() - 0.5);

  // リセット: 5単語を選んでシャッフル
  const reset = () => {
    const selected = shuffleArr(WORDS).slice(0, numWords);
    setCards(selected);
    setTimeLeft(limitTime);
  };

  useEffect(reset, []);
  useEffect(() => {
    reset();
  }, [limitTime, numWords]);
  // 制限時間カウントダウン
  useEffect(() => {
    if (disabled) return;
    if (timeLeft <= 0) { onGameOver(); return; }
    const tid = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(tid);
  }, [timeLeft, disabled]);


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

  const handleDragEnd = (result) => {
    if (!result.destination || disabled) return;

    setCards(prev => {
      const reordered = Array.from(prev);
      const [moved] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, moved);
      return reordered;
    });
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

    const getItemStyle = (isDragging, isDropAnimating, draggableStyle) => ({
      touchAction: 'none',
      width: '80%',           // 通常時は中央寄せ
      maxWidth: 320,
      margin: isDragging ? '4px 0' : '4px auto',   // ドラッグ中は margin-auto を外して横ズレ防止
      border: '2px solid #76c7c0',
      borderRadius: 4,
      background: '#e0f7f5',
      cursor: 'move',
      userSelect: 'none',
      textAlign: 'center',
      fontSize: 16,
      // ドロップ後のアニメーションを短縮（既定 250 ms → 120 ms）
      transitionDuration: '0s',
      ...draggableStyle           // ★最後に展開して width をピクセル値で上書き
    });

  return (
    <div
      className={`panel ${isCause ? 'panel-cause' : ''}`} 
    >
      <h3>アルファベット順に並べ替え</h3>
      <p style={{ margin: '4px 0', fontWeight: 'bold' }}>
        
      </p>
      <div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="cards">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ display: 'flex', flexDirection: 'column', margin: '10px 0' }}
              >
                {cards.map((word, i) => (
                  <Draggable key={word} draggableId={word} index={i} isDragDisabled={disabled}>
                    {provided => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          snapshot.isDropAnimating,
                          provided.draggableProps.style
                        )}
                      >
                        {word}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

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