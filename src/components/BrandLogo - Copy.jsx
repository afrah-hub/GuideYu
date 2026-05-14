import React from 'react';

const BrandLogo = ({ size = 24, className = "" }) => {
  return (
    <div
      className={`shrink-0 bg-gradient-to-br var(--gradient-brand) ${className}`}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: 'url("/brand logo.png?v=3")',
        maskImage: 'url("/brand logo.png?v=3")',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center'
      }}
    />
  );
};

export default BrandLogo;
