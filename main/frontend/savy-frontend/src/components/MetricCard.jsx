import { useEffect, useState, useRef } from 'react';

export default function MetricCard({ icon: Icon, label, value, suffix, change, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value]);

  const isPositive = change > 0;

  return (
    <div 
      ref={cardRef}
      className="card p-5 bg-white border border-gray-100 rounded-xl shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
          <Icon />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full' : 'text-rose-600 bg-rose-50 px-2 py-1 rounded-full'}`}>
            <svg 
              width="10" 
              height="10" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3"
              className={isPositive ? '' : 'rotate-180'}
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-gray-900">{displayValue}</span>
        {suffix && <span className="text-sm text-gray-400 font-medium">{suffix}</span>}
      </div>
    </div>
  );
}
