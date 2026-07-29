import React, { useEffect, useState } from 'react';

export const NetworkStatusBanner: React.FC = () => {
 const [isOnline, setIsOnline] = useState(navigator.onLine);

 useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
   window.removeEventListener('online', handleOnline);
   window.removeEventListener('offline', handleOffline);
  };
 }, []);

 if (isOnline) return null;

 return (
  <div className="fixed top-0 left-0 w-full z-[9999] bg-[#f59e0b] text-white py-[8px] text-center shadow-md animate-slide-down">
   <p className="text-[14px] font-bold tracking-wide">
    Mất kết nối mạng. Đang tự động kết nối lại...
   </p>
  </div>
 );
};
