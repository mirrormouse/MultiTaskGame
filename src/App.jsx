import React, { useState, useEffect, useCallback } from 'react';
import SequencePanel from './components/SequencePanel';
import EmailPanel from './components/EmailPanel';
import GraphPanel from './components/GraphPanel';
import TimerPanel from './components/TimerPanel';
import CalcPanel from './components/CalcPanel';
import WordFlowPanel from './components/WordFlowPanel';

// レベルごとの設定（後で調整）
const LEVEL_CONFIG = [
  // Level 1
  {
    limitTime: 30,
    numWords: 3,
    limitEmailTime: 30,
    numEmails: 1,
    graphTickMs: 4000,
    timerLimitTime: 20,
    calcLimitTime: 30,
    calcRange: 20,
    wordFlowTick: 200,
    delayBase: 5000
  },
  // Level 2
  {
    limitTime: 30,
    numWords: 3,
    limitEmailTime: 30,
    numEmails: 2,
    graphTickMs: 4000,
    timerLimitTime: 20,
    calcLimitTime: 30,
    calcRange: 30,
    wordFlowTick: 180,
    delayBase: 4500
  },
  // Level 3
  {
    limitTime: 40,
    numWords: 4,
    limitEmailTime: 30,
    numEmails: 2,
    graphTickMs: 4000,
    timerLimitTime: 25,
    calcLimitTime: 30,
    calcRange: 40,
    wordFlowTick: 150,
    delayBase: 4000
  },
  // Level 4
  {
    limitTime: 40,
    numWords: 4,
    limitEmailTime: 40,
    numEmails: 3,
    graphTickMs: 3500,
    timerLimitTime: 25,
    calcLimitTime: 25,
    calcRange: 50,
    wordFlowTick: 150,
    delayBase: 3500
  },
  // Level 5
  {
    limitTime: 40,
    numWords: 5,
    limitEmailTime: 30,
    numEmails: 3,
    graphTickMs: 3000,
    timerLimitTime: 20,
    calcLimitTime: 20,
    calcRange: 80,
    wordFlowTick: 120,
    delayBase: 3000
  },
  // Level 6
  {
    limitTime: 40,
    numWords: 5,
    limitEmailTime: 30,
    numEmails: 3,
    graphTickMs: 2800,
    timerLimitTime: 20,
    calcLimitTime: 20,
    calcRange: 90,
    wordFlowTick: 120,
    delayBase: 3000
  },
  // Level 7
  {
    limitTime: 35,
    numWords: 5,
    limitEmailTime: 25,
    numEmails: 3,
    graphTickMs: 2500,
    timerLimitTime: 18,
    calcLimitTime: 20,
    calcRange: 100,
    wordFlowTick: 120,
    delayBase: 2800
  },
  // Level 8
  {
    limitTime: 35,
    numWords: 5,
    limitEmailTime: 30,
    numEmails: 4,
    graphTickMs: 2500,
    timerLimitTime: 18,
    calcLimitTime: 18,
    calcRange: 120,
    wordFlowTick: 120,
    delayBase: 2600
  },
  // Level 9
  {
    limitTime: 30,
    numWords: 5,
    limitEmailTime: 25,
    numEmails: 4,
    graphTickMs: 2500,
    timerLimitTime: 16,
    calcLimitTime: 18,
    calcRange: 150,
    wordFlowTick: 120,
    delayBase: 2500
  },
  // Level 10
  {
    limitTime: 25,
    numWords: 5,
    limitEmailTime: 25,
    numEmails: 4,
    graphTickMs: 2500,
    timerLimitTime: 16,
    calcLimitTime: 18,
    calcRange: 150,
    wordFlowTick: 120,
    delayBase: 2400
  },
  // Level 11
  {
    limitTime: 25,
    numWords: 5,
    limitEmailTime: 25,
    numEmails: 4,
    graphTickMs: 2500,
    timerLimitTime: 16,
    calcLimitTime: 18,
    calcRange: 150,
    wordFlowTick: 120,
    delayBase: 2300
  },
  // Level 12
  {
    limitTime: 25,
    numWords: 5,
    limitEmailTime: 40,
    numEmails: 5,
    graphTickMs: 2300,
    timerLimitTime: 15,
    calcLimitTime: 18,
    calcRange: 200,
    wordFlowTick: 120,
    delayBase: 2200
  },
  // Level 13
  {
    limitTime: 25,
    numWords: 5,
    limitEmailTime: 30,
    numEmails: 5,
    graphTickMs: 2000,
    timerLimitTime: 15,
    calcLimitTime: 15,
    calcRange: 200,
    wordFlowTick: 100,
    delayBase: 2000
  },
  // Level 14
  {
    limitTime: 20,
    numWords: 5,
    limitEmailTime: 25,
    numEmails: 5,
    graphTickMs: 2000,
    timerLimitTime: 15,
    calcLimitTime: 15,
    calcRange: 300,
    wordFlowTick: 80,
    delayBase: 2000
  },
  // Level 15
  {
    limitTime: 40,
    numWords: 6,
    limitEmailTime: 40,
    numEmails: 6,
    graphTickMs: 1500,
    timerLimitTime: 12,
    calcLimitTime: 12,
    calcRange: 500,
    wordFlowTick: 80,
    delayBase: 1800
  },
  // Level 16
  {
    limitTime: 35,
    numWords: 6,
    limitEmailTime: 35,
    numEmails: 6,
    graphTickMs: 1200,
    timerLimitTime: 12,
    calcLimitTime: 12,
    calcRange: 1000,
    wordFlowTick: 80,
    delayBase: 1500
  },
  // Level 17
  {
    limitTime: 30,
    numWords: 6,
    limitEmailTime: 30,
    numEmails: 6,
    graphTickMs: 1000,
    timerLimitTime: 12,
    calcLimitTime: 12,
    calcRange: 1000,
    wordFlowTick: 80,
    delayBase: 1300
  },
  // Level 18
  {
    limitTime: 25,
    numWords: 6,
    limitEmailTime: 25,
    numEmails: 6,
    graphTickMs: 900,
    timerLimitTime: 12,
    calcLimitTime: 12,
    calcRange: 1000,
    wordFlowTick: 70,
    delayBase: 1200
  },
  // Level 19
  {
    limitTime: 25,
    numWords: 6,
    limitEmailTime: 25,
    numEmails: 6,
    graphTickMs: 800,
    timerLimitTime: 11,
    calcLimitTime: 11,
    calcRange: 1500,
    wordFlowTick: 60,
    delayBase: 1100
  },
  // Level 20
  {
    limitTime: 20,
    numWords: 6,
    limitEmailTime: 20,
    numEmails: 6,
    graphTickMs: 500,
    timerLimitTime: 10,
    calcLimitTime: 10,
    calcRange: 2000,
    wordFlowTick: 50,
    delayBase: 1000
  },
];
const level_time = [0, 20, 50, 80, 110, 
                    150, 190, 230, 270, 320, 
                    370, 430, 500, 600, 700,
                    820, 1000, 1200, 1500, 1800]; // 各レベルの経過時間
const MAX_LEVEL = LEVEL_CONFIG.length;
const LEVEL_UP_INTERVAL = 10; // 秒ごとにレベルアップ

export default function App() {
  const [score, setScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  // // 表示用レベル（問題を解き終わったタイミングでのみ更新）
  const [displayLevel, setDisplayLevel] = useState(1);
  // 各パネルに対するレベルを保持するように変更
  const [displayLevels, setDisplayLevels] = useState(Array(6).fill(1));
  const [gameOver, setGameOver] = useState(false);
  const [gameOverPanel, setGameOverPanel] = useState(null);

  // 1秒ごとにスコアと経過時間を更新
  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      setScore(s => s + 1);
      setElapsed(e => e + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [gameOver]);

  // 経過時間から「本来のレベル」を計算
  // const desiredLevel = Math.min(
  //   MAX_LEVEL,
  //   Math.floor(elapsed / LEVEL_UP_INTERVAL) + 1
  // );
  //level_timeを元にdesiredLevelを計算するように、計算方法を変更
  const desiredLevel = Math.min(
    MAX_LEVEL,
    level_time.findIndex(time => elapsed < time)
  );


  //displayLevelsの各要素について、Complete時に更新する関数を用意する、つまり関数のリストを作る
  function handleCompleteForPanel(panelIndex) {
    return useCallback(() => {
      setDisplayLevels(prevLevels => {
        const newLevels = [...prevLevels];
        newLevels[panelIndex] = Math.min(desiredLevel, MAX_LEVEL);
        return newLevels;
      });
    }, [desiredLevel]);
  }

  const onComplete = () => {};
  // 識別子付き onGameOver を返す
  const makeOnGameOver = panelId => () => {
    setGameOver(true);
    setGameOverPanel(panelId);
  };


  const config = LEVEL_CONFIG[Math.min(displayLevel - 1, MAX_LEVEL - 1)];
  //各displayLevelに対するconfigをそれぞれ用意
  function getConfig(index) {
    const level = displayLevels[index];
    if (index === 2){
      console.log('GraphPanel level:', level);
    }
    return LEVEL_CONFIG[Math.min(level - 1, MAX_LEVEL - 1)];
  }


  const commonProps = { disabled: gameOver, onComplete: handleCompleteForPanel(0) };

  const SequenceProps = { ...commonProps, onGameOver: makeOnGameOver('Sequence'), isCause: gameOverPanel === "Sequence", limitTime: getConfig(0).limitTime, numWords: getConfig(0).numWords, onComplete: handleCompleteForPanel(0) };
  const EmailProps    = { ...commonProps, onGameOver: makeOnGameOver('Email'), isCause: gameOverPanel === "Email", limitTime: getConfig(1).limitEmailTime, numEmails: getConfig(1).numEmails, onComplete: handleCompleteForPanel(1)};
  const GraphProps    = { ...commonProps, onGameOver: makeOnGameOver('Graph'), isCause: gameOverPanel === "Graph", tickMs: getConfig(2).graphTickMs, onComplete: handleCompleteForPanel(2) };
  const TimerProps    = { ...commonProps, onGameOver: makeOnGameOver('Timer'), isCause: gameOverPanel === "Timer", limitTime: getConfig(3).timerLimitTime, onComplete: handleCompleteForPanel(3) };
  const CalcProps     = { ...commonProps, onGameOver: makeOnGameOver('Calc'), isCause: gameOverPanel === "Calc", limitTime: getConfig(4).calcLimitTime, range: getConfig(4).calcRange, onComplete: handleCompleteForPanel(4) };
  const WordFlowProps = { ...commonProps, onGameOver: makeOnGameOver('WordFlow'), isCause: gameOverPanel === "WordFlow", tick: getConfig(5).wordFlowTick, delay: getConfig(5).delayBase, onComplete: handleCompleteForPanel(5) };

  const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, 1fr)', gap: 10, height: '100vh', padding: 10 };

  return (
    <>
      {gameOver && <div className="game-over">Game Over: score:{score}, level:{desiredLevel}</div>}
      <div className="score">
        TimeScore: {score} ／ Level: {desiredLevel}
      </div>
      <div style={grid}>
        <SequencePanel {...SequenceProps} />
        <EmailPanel    {...EmailProps}    />
        <GraphPanel    {...GraphProps}    />
        <TimerPanel    {...TimerProps}    />
        <CalcPanel     {...CalcProps}     />
        <WordFlowPanel {...WordFlowProps} />
      </div>
    </>
  );
}
