import React from 'react';
import './ProbabilityGrid.css';

const ProbabilityGrid = ({ probability }) => {
  const digits = Array.from({ length: 10 }, (_, i) => i);

  const getColor = (value) => {
    const num = parseFloat(value);
    if (num >= 12) return 'high';
    if (num >= 9) return 'medium';
    return 'low';
  };

  return (
    <div className="probability-grid">
      {digits.map((digit) => {
        const value = probability[digit] || '0.0';
        const color = getColor(value);
        return (
          <div key={digit} className={`digit-box ${color}`}>
            <div className="digit">{digit}</div>
            <div className="percentage">{value}%</div>
          </div>
        );
      })}
    </div>
  );
};

export default ProbabilityGrid;
