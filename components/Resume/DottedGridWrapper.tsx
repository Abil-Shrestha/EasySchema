import React, { ReactNode } from 'react';
import styles from './gridstyle.module.css';

interface GridSystemProps {
  children: ReactNode;
  guideWidth?: number | string;
  guideColor?: string;
  crossColor?: string;
  maxWidth?: number | string;
  minWidth?: number | string;
  className?: string;
}

const GridSystem: React.FC<GridSystemProps> = ({
  children,
  guideWidth = 1,
  guideColor = 'rgba(0, 0, 0, 0.1)',
  crossColor = 'rgba(0, 0, 0, 0.2)',
  maxWidth = '100%',
  minWidth,
  className = '',
}) => {
  const formattedGuideWidth = typeof guideWidth === 'number' ? `${guideWidth}px` : guideWidth;
  const formattedMaxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
  const formattedMinWidth = minWidth ? (typeof minWidth === 'number' ? `${minWidth}px` : minWidth) : undefined;

  return (
    <div 
      className={`${styles.gridSystem} ${className}`}
      style={{
        '--guide-width': formattedGuideWidth,
        '--guide-color': guideColor,
        '--cross-color': crossColor,
        '--max-width': formattedMaxWidth,
        '--min-width': formattedMinWidth,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default GridSystem;