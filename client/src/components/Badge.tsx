import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import darkBadge from '../assets/bolt-badge-dark.png';
import lightBadge from '../assets/bolt-badge-light.png';

const Badge: React.FC = () => {
  const { theme } = useContext(ThemeContext) ?? { theme: 'light' };
  const badgeSrc = theme === 'dark' ? darkBadge : lightBadge;
  return (
    <div
      className="fixed left-4 bottom-4 z-50 w-20 h-20 md:w-24 md:h-24 select-none pointer-events-none"
      style={{ maxWidth: '25vw', maxHeight: '25vw' }}
    >
      <img
        src={badgeSrc}
        alt="Powered by Bolt.New"
        className="w-full h-full object-contain"
        draggable={false}
      />
    </div>
  );
};

export default Badge;
