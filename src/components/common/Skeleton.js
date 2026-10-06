import React from 'react';
import PropTypes from 'prop-types';
import './Skeleton.css';

export const Skeleton = ({ width, height, circle, className = '', style = {} }) => {
  const skeletonStyle = {
    width,
    height,
    borderRadius: circle ? '50%' : '4px',
    ...style
  };

  return <div className={`skeleton ${className}`} style={skeletonStyle} />;
};

export const SkeletonText = ({ lines = 1, className = '' }) => {
  return (
    <div className={`skeleton-text ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          width={i === lines - 1 && i !== 0 ? '60%' : '100%'} 
          height="0.8rem" 
          className="mb-2"
        />
      ))}
    </div>
  );
};

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  circle: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
};

SkeletonText.propTypes = {
  lines: PropTypes.number,
  className: PropTypes.string
};

export default Skeleton;
