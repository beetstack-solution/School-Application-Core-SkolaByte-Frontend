import { useEffect, useState } from 'react';

interface SchoolLoaderProps {
  duration?: number;
  message?: string;
  schoolName?: string;
}

const SpinnerLoader = ({ 
  duration = 5000, 
  message = "Loading school data...",
  schoolName = "SkolaByte"
}: SchoolLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [showChalkDust, setShowChalkDust] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 100));
        if (newProgress > 50) setShowChalkDust(true);
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/90 backdrop-blur-sm">
      {/* Chalkboard container */}
      <div className="relative w-full max-w-md h-96 bg-green-900 rounded-lg border-8 border-amber-800 shadow-2xl overflow-hidden">
        {/* Chalkboard surface */}
        <div className="absolute inset-2 bg-green-900 rounded-sm p-6 flex flex-col items-center justify-center">
          {/* Chalkboard texture */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')]"></div>
          
          {/* School name in chalk text */}
          <h2 className="text-white font-chalk text-2xl mb-6 tracking-wider border-b border-white/30 pb-2 w-full text-center">
            {schoolName}
          </h2>
          
          {/* Animated chalk writing */}
          <div className="relative w-full h-32 mb-6 flex items-center justify-center">
            <div className="relative">
              {/* Chalk text */}
              <p className="text-white font-chalk text-xl text-center">
                {message}
              </p>
              
              {/* Chalk hand animation */}
              <div className="absolute -right-10 -top-6">
                <div className="relative w-12 h-12 animate-chalk-writing">
                  <div className="absolute top-0 left-0 w-2 h-6 bg-gray-200 rounded-full transform rotate-45 origin-bottom"></div>
                  <div className="absolute top-2 left-2 w-4 h-1 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Chalk dust animation */}
            {showChalkDust && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute bg-white/30 rounded-full"
                    style={{
                      width: `${Math.random() * 6 + 2}px`,
                      height: `${Math.random() * 6 + 2}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `chalk-dust ${Math.random() * 3 + 1}s ease-out forwards`,
                      opacity: 0
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Progress bar as chalk line */}
          <div className="w-full h-2 bg-white/20 rounded-full mb-4 overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Percentage with school icon */}
          <div className="flex items-center text-white font-chalk">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" 
              />
            </svg>
            <span>{Math.min(100, Math.round(progress))}% Loaded</span>
          </div>
        </div>
        
        {/* Chalk tray at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-amber-700 flex items-center px-2">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="w-6 h-3 mx-1 bg-gray-200 rounded-full"
              style={{
                opacity: 0.7 - (i * 0.1),
                transform: `rotate(${Math.random() * 20 - 10}deg)`
              }}
            />
          ))}
        </div>
        
        {/* Floating school items */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['📚', '✏️', '📝', '🎒', '📓', '🧮', '🏫', '📖'].map((item, i) => (
            <div 
              key={i}
              className="absolute text-2xl opacity-20"
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 8 + 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      
      {/* Global styles (should be moved to your CSS file) */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes chalk-writing {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(10px) translateY(-5px); }
          100% { transform: translateX(0) translateY(0); }
        }
        
        @keyframes chalk-dust {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-20px) scale(1); opacity: 0; }
        }
        
        .font-chalk {
          font-family: 'Comic Sans MS', 'Marker Felt', 'Segoe Print', cursive;
          text-shadow: 0 0 2px rgba(255,255,255,0.5);
        }
        
        .animate-chalk-writing {
          animation: chalk-writing 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SpinnerLoader;