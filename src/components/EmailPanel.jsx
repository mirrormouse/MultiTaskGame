// src/components/EmailPanel.jsx
import React, { useState, useEffect } from 'react';

const baseSubjects = ['サーバーメンテ', '会議案内', 'プロジェクト報告', '資料送付', '人事連絡', '請求書', '納品書', 'お知らせ', 'ご案内', 'ご確認'];
const markers = [
  { label: '[要返信]', action: 'reply' },
  { label: '[要転送]', action: 'forward' },
  { label: '', action: 'read' }
];

const genEmails = (numEmails) => {
  return Array.from({ length: numEmails }, (_, i) => {
    const base = baseSubjects[Math.floor(Math.random()*baseSubjects.length)];
    const mk = markers[Math.floor(Math.random()*markers.length)];
    // prefix or suffix
    const subject = Math.random()<0.5 ? `${mk.label}${base}` : `${base}${mk.label}`;
    return { id: Date.now()+i, subject, required: mk.action };
  });
};

const EmailPanel = ({ limitTime, onComplete, onGameOver, disabled, numEmails, isCause  }) => {
  const [emails, setEmails] = useState(genEmails(numEmails));
  const [timeLeft, setTimeLeft] = useState(limitTime);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    if (disabled) return;
    if (timeLeft <= 0) { onGameOver(); return; }
    const id = setTimeout(() => setTimeLeft(t => t-1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, disabled]);


  // レベル切り替わったら（プロップ変化で）リセット
  useEffect(() => {
    setEmails(genEmails(numEmails));
    setTimeLeft(limitTime);
  }, [limitTime, numEmails]);

  // 全メール処理後リセット
  useEffect(() => {
    if (emails.length === 0 && !disabled) {
      onComplete();
      setEmails(genEmails(numEmails));
      setTimeLeft(limitTime);
    }
  }, [emails, disabled]);

  const handleMenu = id => { if (!disabled) setOpenMenuId(openMenuId===id? null : id); };
  const handleAction = (id, action) => {
    const mail = emails.find(e=>e.id===id);
    if (mail.required === action) {
      setEmails(emails.filter(e=>e.id!==id));
    }
    setOpenMenuId(null);
  };

  return (
    <div className={`panel ${isCause ? 'panel-cause' : ''}`} >
      <h3>メール分類（何もなければ既読）</h3>
      <ul>
        {emails.map(e=> (
          <li key={e.id} style={{ marginBottom: '6px', position: 'relative' }}>
            <span>{e.subject}</span>
            <button onClick={()=>handleMenu(e.id)} style={{ marginLeft: '8px' }} disabled={disabled}>…</button>
            {openMenuId===e.id && (
              <div className="menu">
                <ul>
                  <li onClick={()=>handleAction(e.id, 'reply')}>返信</li>
                  <li onClick={()=>handleAction(e.id, 'forward')}>転送</li>
                  <li onClick={()=>handleAction(e.id, 'read')}>既読</li>
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="progress-bar" style={{ width:`${(timeLeft/limitTime)*100}%` }} />
    </div>
  );
};

export default EmailPanel;