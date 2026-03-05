import React from 'react';

const TropicalScene = () => (
  <div className="scene">
    {/* Sparkles */}
    <svg className="sparkle-svg" style={{ left: '20%', top: '16%' }} width="8" height="8" viewBox="0 0 8 8">
      <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="var(--champagne-light)" />
    </svg>
    <svg className="sparkle-svg" style={{ right: '18%', top: '10%', animationDelay: '1.2s' }} width="6" height="6" viewBox="0 0 8 8">
      <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="var(--green-light)" />
    </svg>
    <svg className="sparkle-svg" style={{ left: '42%', top: '4%', animationDelay: '2.4s' }} width="7" height="7" viewBox="0 0 8 8">
      <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z" fill="var(--teal-light)" />
    </svg>

    {/* Cloud left */}
    <div className="deco df-cloud">
      <svg width="56" height="30" viewBox="0 0 56 30" fill="none">
        <ellipse cx="28" cy="20" rx="22" ry="10" fill="white" opacity="0.55" />
        <ellipse cx="19" cy="15" rx="13" ry="10" fill="white" opacity="0.45" />
        <ellipse cx="37" cy="14" rx="11" ry="9" fill="white" opacity="0.4" />
      </svg>
    </div>

    {/* Cloud right */}
    <div className="deco df-cloud-2">
      <svg width="38" height="20" viewBox="0 0 38 20" fill="none">
        <ellipse cx="19" cy="13" rx="15" ry="7" fill="white" opacity="0.45" />
        <ellipse cx="13" cy="10" rx="9" ry="7" fill="white" opacity="0.35" />
        <ellipse cx="26" cy="9" rx="8" ry="6" fill="white" opacity="0.3" />
      </svg>
    </div>

    {/* Sun with cute face */}
    <div className="deco df-sun">
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="var(--champagne-light)" opacity="0.3" />
        <circle cx="26" cy="26" r="14" fill="#FFEAB5" />
        <circle cx="26" cy="26" r="11" fill="#FFD976" />
        <line x1="26" y1="4" x2="26" y2="9" stroke="#FFD976" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="26" y1="43" x2="26" y2="48" stroke="#FFD976" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="4" y1="26" x2="9" y2="26" stroke="#FFD976" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="43" y1="26" x2="48" y2="26" stroke="#FFD976" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#FFD976" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="38" x2="41.5" y2="41.5" stroke="#FFD976" strokeWidth="2" strokeLinecap="round" />
        <line x1="41.5" y1="10.5" x2="38" y2="14" stroke="#FFD976" strokeWidth="2" strokeLinecap="round" />
        <line x1="14" y1="38" x2="10.5" y2="41.5" stroke="#FFD976" strokeWidth="2" strokeLinecap="round" />
        {/* Cute face */}
        <circle cx="22" cy="24.5" r="1.5" fill="#E8AA30" />
        <circle cx="30" cy="24.5" r="1.5" fill="#E8AA30" />
        <path d="M22.5 28.5 C24 30.5 28 30.5 29.5 28.5" stroke="#E8AA30" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <ellipse cx="19.5" cy="27" rx="2" ry="1.2" fill="#FFB5A0" opacity="0.35" />
        <ellipse cx="32.5" cy="27" rx="2" ry="1.2" fill="#FFB5A0" opacity="0.35" />
      </svg>
    </div>

    {/* Birds */}
    <div className="deco df-birds">
      <svg width="32" height="14" viewBox="0 0 32 14" fill="none">
        <path d="M2 10C4 5 7 3 9 5" stroke="var(--text-muted)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M9 5C11 3 13 5 15 3" stroke="var(--text-muted)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M18 8C19.5 5 21.5 3.5 23 5" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <path d="M23 5C24.5 3.5 26 5 27.5 3.5" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </svg>
    </div>

    {/* Left palm tree */}
    <div className="deco df-palm-l">
      <svg width="75" height="125" viewBox="0 0 75 125" fill="none">
        <path d="M38 125 C37 105 35 80 36 58" stroke="#C4A06A" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M38 125 C39 105 40 80 38 58" stroke="#D4B47A" strokeWidth="3" strokeLinecap="round" />
        <path d="M34 100 Q37 98 40 100" stroke="#B8945A" strokeWidth="0.8" opacity="0.4" />
        <path d="M34.5 90 Q37 88 39.5 90" stroke="#B8945A" strokeWidth="0.8" opacity="0.4" />
        <path d="M35 80 Q37 78 39 80" stroke="#B8945A" strokeWidth="0.8" opacity="0.4" />
        <path d="M35.5 70 Q37 68 38.5 70" stroke="#B8945A" strokeWidth="0.8" opacity="0.4" />
        <path d="M36 58 C28 44 12 38 4 44" stroke="var(--green)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M36 58 C26 40 12 28 6 26" stroke="var(--green-light)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M36 58 C30 36 18 22 12 18" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M36 58 C42 40 54 32 64 34" stroke="var(--green)" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M36 58 C44 42 58 36 66 42" stroke="var(--green-light)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M36 58 C40 38 50 26 58 22" stroke="var(--teal-light)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <circle cx="34" cy="59" r="3.5" fill="#D4A96A" />
        <circle cx="39.5" cy="58" r="3" fill="#C4986A" />
        <circle cx="36.5" cy="56" r="2.5" fill="#D4B47A" />
      </svg>
    </div>

    {/* Right palm tree */}
    <div className="deco df-palm-r">
      <svg width="65" height="110" viewBox="0 0 65 110" fill="none">
        <path d="M32 110 C31 92 30 72 31 55" stroke="#C4A06A" strokeWidth="5" strokeLinecap="round" />
        <path d="M32 110 C33 92 34 72 33 55" stroke="#D4B47A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M29 95 Q32 93 35 95" stroke="#B8945A" strokeWidth="0.7" opacity="0.4" />
        <path d="M29.5 85 Q32 83 34.5 85" stroke="#B8945A" strokeWidth="0.7" opacity="0.4" />
        <path d="M30 75 Q32 73 34 75" stroke="#B8945A" strokeWidth="0.7" opacity="0.4" />
        <path d="M32 55 C24 42 10 36 3 40" stroke="var(--green)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M32 55 C25 38 14 28 8 26" stroke="var(--teal-light)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M32 55 C38 40 50 34 58 38" stroke="var(--green)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M32 55 C40 42 52 38 60 44" stroke="var(--green-light)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M32 55 C36 36 44 26 50 22" stroke="var(--teal-light)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="56.5" r="3" fill="#D4A96A" />
        <circle cx="34.5" cy="55.5" r="2.5" fill="#C4986A" />
      </svg>
    </div>

    {/* Flower left */}
    <div className="deco df-flower-l">
      <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
        <path d="M14 40 C14 40 13 28 14 22" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 30 C10 27 7 28 7 28" stroke="var(--green-light)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <circle cx="14" cy="18" r="6" fill="var(--champagne-light)" opacity="0.6" />
        <circle cx="10" cy="16" r="3.5" fill="var(--champagne-glow)" />
        <circle cx="18" cy="16" r="3.5" fill="var(--champagne-glow)" />
        <circle cx="12" cy="20" r="3.5" fill="var(--champagne-glow)" />
        <circle cx="16" cy="20" r="3.5" fill="var(--champagne-glow)" />
        <circle cx="14" cy="14" r="3.5" fill="var(--champagne-glow)" />
        <circle cx="14" cy="17.5" r="2.5" fill="#FFD976" />
      </svg>
    </div>

    {/* Flower right */}
    <div className="deco df-flower-r">
      <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
        <path d="M12 36 C12 36 11.5 26 12 20" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M12 28 C15 25.5 17 26.5 17 26.5" stroke="var(--green-light)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
        <circle cx="12" cy="16" r="5" fill="var(--teal-pale)" opacity="0.6" />
        <circle cx="9" cy="14.5" r="3" fill="var(--teal-light)" opacity="0.6" />
        <circle cx="15" cy="14.5" r="3" fill="var(--teal-light)" opacity="0.6" />
        <circle cx="10" cy="18" r="3" fill="var(--teal-light)" opacity="0.6" />
        <circle cx="14" cy="18" r="3" fill="var(--teal-light)" opacity="0.6" />
        <circle cx="12" cy="12.5" r="3" fill="var(--teal-light)" opacity="0.6" />
        <circle cx="12" cy="15.5" r="2.2" fill="var(--champagne-light)" />
      </svg>
    </div>

    {/* Couple circle */}
    <div className="couple-circle">
      <div className="couple-inner">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          <circle cx="16" cy="14" r="5" fill="var(--green)" opacity="0.2" />
          <circle cx="16" cy="14" r="3.5" fill="var(--green)" />
          <path d="M10 28C10 23 12.5 20 16 20C19.5 20 22 23 22 28" fill="var(--green)" opacity="0.7" />
          <circle cx="26" cy="14" r="5" fill="var(--teal)" opacity="0.2" />
          <circle cx="26" cy="14" r="3.5" fill="var(--teal)" />
          <path d="M20 28C20 23 22.5 20 26 20C29.5 20 32 23 32 28" fill="var(--teal)" opacity="0.7" />
          <path d="M21 16.5C20.2 15.5 18.8 15.5 18.8 16.8C18.8 18 21 19.5 21 19.5C21 19.5 23.2 18 23.2 16.8C23.2 15.5 21.8 15.5 21 16.5Z" fill="var(--champagne)" opacity="0.8" />
        </svg>
      </div>
    </div>
  </div>
);

export default TropicalScene;
