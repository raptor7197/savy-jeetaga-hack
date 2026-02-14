import React from 'react';

const frequencyBands = [
  { label: 'ALPHA (8-13 Hz)', value: 42, color: 'bg-emerald-500' },
  { label: 'BETA (13-30 Hz)', value: 28, color: 'bg-orange-500' },
  { label: 'THETA (4-8 Hz)', value: 18, color: 'bg-blue-500' },
  { label: 'DELTA (0.5-4 Hz)', value: 12, color: 'bg-slate-300' },
];

const electrodes = [
  { id: 'Fp1', status: 'optimal' },
  { id: 'Fp2', status: 'optimal' },
  { id: 'C3', status: 'optimal' },
  { id: 'C4', status: 'warning' },
  { id: 'O1', status: 'optimal' },
  { id: 'O2', status: 'optimal' },
  { id: 'REF', status: 'error' },
  { id: '', status: 'neutral' }, // Placeholder
];

export default function SpectralPanel() {
  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'bg-[#10b981] text-white';
      case 'warning': return 'bg-[#f59e0b] text-white';
      case 'error': return 'bg-[#ef4444] text-white';
      default: return 'bg-gray-200 text-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full flex flex-col gap-8">
      
      {/* Spectral Analysis Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Spectral Analysis</h3>
        <div className="space-y-5">
          {frequencyBands.map((band) => (
            <div key={band.label}>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
                <span>{band.label}</span>
                <span className={band.color.replace('bg-', 'text-')}>{band.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${band.color}`} 
                  style={{ width: `${band.value}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impedance Levels Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Impedance Levels</h3>
        <div className="grid grid-cols-4 gap-2">
          {electrodes.map((electrode, idx) => (
            <div 
              key={idx} 
              className={`aspect-square rounded flex items-center justify-center text-[10px] font-bold ${getStatusColor(electrode.status)}`}
            >
              {electrode.id}
            </div>
          ))}
        </div>
      </div>
    
    </div>
  );
}
