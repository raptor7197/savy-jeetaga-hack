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
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Wave configurations
    const waves = [
      { 
        color: '#22c55e', 
        amplitude: 35, 
        frequency: 0.02, 
        speed: 2,
        offset: 0,
        noise: 0.3
      },
      { 
        color: '#06b6d4', 
        amplitude: 28, 
        frequency: 0.025, 
        speed: 2.5,
        offset: 2,
        noise: 0.4
      },
      { 
        color: '#f97316', 
        amplitude: 42, 
        frequency: 0.015, 
        speed: 1.8,
        offset: 4,
        noise: 0.5
      }
    ];

    // Grid configuration
    const gridConfig = {
      verticalSpacing: 30,
      horizontalSpacing: 50,
      color: 'rgba(255, 255, 255, 0.05)'
    };

    let time = 0;
    const drawWave = (wave, yOffset) => {
      ctx.beginPath();
      ctx.strokeStyle = wave.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = wave.color;
      ctx.shadowBlur = 8;

      const centerY = canvas.height / 4 + yOffset * (canvas.height / 4);
      
      for (let x = 0; x < canvas.width; x++) {
        const noise = (Math.random() - 0.5) * wave.noise * wave.amplitude;
        const waveY = Math.sin((x + time * wave.speed) * wave.frequency + wave.offset) * wave.amplitude;
        const y = centerY + waveY + noise;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const drawGrid = () => {
      ctx.strokeStyle = gridConfig.color;
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridConfig.horizontalSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridConfig.verticalSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const animate = () => {
      // Clear canvas with dark background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      drawGrid();
      
      // Draw waves
      waves.forEach((wave, index) => {
        drawWave(wave, index);
      });
      
      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  return (
    <div className="card overflow-hidden opacity-0 animate-fade-slide-up animate-delay-5">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Live Multi-Channel EEG Feed</h3>
          <p className="text-sm text-gray-500 mt-0.5">Real-time neural activity monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">Alpha</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-500" />
            <span className="text-sm text-gray-600">Beta</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-sm text-gray-600">Delta</span>
          </div>
        </div>
      </div>
      <div className="h-80 relative">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
        />
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-400">Recording</span>
        </div>
      </div>
    </div>
  );
}
