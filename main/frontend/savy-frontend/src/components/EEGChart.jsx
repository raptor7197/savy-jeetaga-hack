import { useEffect, useRef, useState } from 'react';

export default function EEGChart() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const canvas = canvasRef.current;
    if (canvas) observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const waves = [
      { 
        color: '#22c55e', // Alpha - Green
        amplitude: 30, 
        frequency: 0.02, 
        speed: 2,
        offset: 80,
        noise: 0.2
      },
      { 
        color: '#0d9488', // Beta - Teal
        amplitude: 25, 
        frequency: 0.035, 
        speed: 2.5,
        offset: 150,
        noise: 0.15
      },
      { 
        color: '#f97316', // Delta - Orange
        amplitude: 40, 
        frequency: 0.01, 
        speed: 1.5,
        offset: 220,
        noise: 0.4
      }
    ];

    let time = 0;

    const animate = () => {
      // Clear with dark bg
      ctx.fillStyle = '#0a0a0a'; 
      const rect = canvas.parentElement.getBoundingClientRect();
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Draw Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 40;
      
      ctx.beginPath();
      // Vertical grid
      for(let x = 0; x < rect.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
      }
      // Horizontal grid
      for(let y = 0; y < rect.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
      }
      ctx.stroke();

      // Draw Waves
      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';

        for (let x = 0; x < rect.width; x++) {
          const t = x * wave.frequency + time * wave.speed;
          const y = wave.offset + 
             Math.sin(t) * wave.amplitude + 
             Math.sin(t * 2.2) * (wave.amplitude * 0.3);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white rounded-xl overflow-hidden shadow-lg border border-gray-800">
        
        {/* Header / Legend */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#0a0a0a]">
            <h3 className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Live Multi-Channel EEG Feed</h3>
            <div className="flex gap-4">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">CH-1 Alpha</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488]"></span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">CH-2 Beta</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]"></span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">CH-3 Delta</span>
                </div>
            </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative w-full h-[320px]">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
        </div>

        {/* Controls Footer */}
        <div className="px-6 py-4 bg-[#0a0a0a] border-t border-gray-800 flex items-center justify-center gap-12">
            <button className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
                Pause Feed
            </button>
            <button className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                </svg>
                Snapshot
            </button>
             <button className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="20" x2="12" y2="10"></line>
                    <line x1="18" y1="20" x2="18" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="16"></line>
                </svg>
                Channels
            </button>
            
        </div>
    </div>
  );
}
