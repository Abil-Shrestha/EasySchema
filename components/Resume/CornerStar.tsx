import React from 'react';

interface CornerStarProps {
  size?: number;
  color?: string;
  className?: string;
}

const CornerStar: React.FC<CornerStarProps> = ({
  size = 20,
  color = 'grey',
  className = '',
}) => {
  const halfSize = size / 2;
  const quarterSize = size / 4;

  return (
    <div
      className={`corner-star ${className}`}
      style={{
        width: size,
        height: size,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: halfSize,
          height: size,
          borderRight: `2px solid ${color}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: halfSize,
          borderBottom: `2px solid ${color}`,
        }}
      />
    </div>
  );
};

export default CornerStar;