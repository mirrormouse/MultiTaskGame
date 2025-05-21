// src/components/WordFlowPanel.jsx
import React, { useState, useEffect, useRef } from 'react';

// 流れる単語を動物/植物で仕分けるパネル
export default function WordFlowPanel({ onComplete, onGameOver, disabled, tick, delay, isCause  }) {
  const ANIMALS = ['ネコ', 'イヌ', 'トリ', 'ウシ', 'カメ', 'ウマ', 'ウサギ', 'サル', 'キツネ', 'クマ', 'ゾウ', 'ライオン', 'トラ', 'ヒツジ', 'ペンギン'];
  const PLANTS  = ['サクラ', 'バラ', 'モモ', 'ツバキ', 'スイカ', 'トマト', 'キュウリ', 'ナス', 'イチゴ', 'ススキ', 'コスモス', 'ヒマワリ', 'アサガオ', 'カエデ', 'イチョウ'];


  // カウントダウン
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (disabled) return;
    const id = setTimeout(() => setTime(t => t+1), 1000);
    if (time >= 5) {
      onComplete();
    }
    return () => clearTimeout(id);
  }, [time, disabled]);

  const speed = 0.007;  // 1tickあたりの進行率
  
  const [tickMs, setTickMs] = useState(tick);
  const [delayBase, setDelayBase] = useState(delay);
  const [items, setItems] = useState([]);
  const nextId = useRef(0);

  useEffect(() => {
    setTickMs(tick);
    setDelayBase(delay);
  }, [tick, delay]);

  // ランダム間隔でアイテム生成
  useEffect(() => {
    if (disabled) return;
    let timeoutId;
    const spawn = () => {
      const isAnimal = Math.random() < 0.5;
      const list = isAnimal ? ANIMALS : PLANTS;
      const text = list[Math.floor(Math.random() * list.length)];
      setItems(prev => [
        ...prev,
        { id: nextId.current++, text, isAnimal, lane: Math.random() < 0.5 ? 0 : 1, x: 0 }
      ]);
      const delayTime = delayBase + Math.random() * delayBase;
      timeoutId = setTimeout(spawn, delayTime);
    };
    spawn();
    return () => clearTimeout(timeoutId);
  }, [disabled, tickMs, delayBase]);

  // 移動＆判定 (右端で判定)
  useEffect(() => {
    if (disabled) return;
    const iv = setInterval(() => {
      setItems(prev => prev.reduce((acc, it) => {
        const x = it.x + speed;
        if (x >= 1) {
          const correct = (it.lane === 0 && it.isAnimal) || (it.lane === 1 && !it.isAnimal);
          correct ? onComplete() : onGameOver();
          return acc;
        }
        acc.push({ ...it, x });
        return acc;
      }, []));
    }, tickMs);
    return () => clearInterval(iv);
  }, [disabled, onComplete, onGameOver, tickMs, delayBase]);

  // クリックでレーン切替
  const handleClick = id => {
    if (disabled) return;
    setItems(prev => prev.map(it => it.id === id ? { ...it, lane: 1 - it.lane } : it));
  };


  return (
    
    <div
      className={`panel ${isCause ? 'panel-cause' : ''}`} 
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <h3>単語仕分け　クリックでレーン切り替え</h3>
      <p style={{ margin: '4px 0' }}>上: 動物 / 下: 植物</p>
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateRows: '1fr 1fr'
        }}
      >
        {[0, 1].map(lane => (
          <div
            key={lane}
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: '#ddd',
              // 上下レーンの間に境界線
              ...(lane === 0 ? { borderBottom: '2px solid #888' } : {})
            }}
          >
            {items
              .filter(it => it.lane === lane)
              .map(it => (
                <div
                  key={it.id}
                  onClick={() => handleClick(it.id)}
                  style={{
                    position: 'absolute',
                    left: `${it.x * 100}%`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '4px 8px',
                    background: '#e0f7ff',
                    border: '1px solid #76c7c0',
                    borderRadius: 4,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {it.text}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
