export default function Header({ isRecording, setIsRecording, onLogout }) {
  const userName = localStorage.getItem('userName');
  const userType = localStorage.getItem('userType');

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40 ml-[260px]">
      <div className="flex items-center gap-4">
        <div className="relative">
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#9ca3af" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder="Search patients, sessions..." 
            className="w-72 pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:bg-white transition-all"
          />
        </div>
      </div>
      <button 
          onClick={() => setIsRecording(!isRecording)}
          className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all flex items-center gap-2 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-cyan-500 hover:bg-cyan-600 text-white'
          }`}
        >
          {isRecording ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              Stop Recording
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="8" />
              </svg>
              Start Recording
            </>
          )}
        </button>

      <div className="flex items-center gap-3">
        {isRecording && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-medium text-red-600">REC</span>
          </div>
        )}
        <span className="text-xs text-gray-400">
          {isRecording ? 'Recording Session #NEU-2024-0892' : 'No active session'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        
        
        

        

        {/* User Profile and Logout */}
        <div className="relative">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {userName?.charAt(0) || 'U'}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">{userName || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{userType || 'user'}</p>
            </div>
          </button>
          
          {/* Logout Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
