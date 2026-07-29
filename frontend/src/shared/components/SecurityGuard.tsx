import React, { useEffect } from 'react';

export const SecurityGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 useEffect(() => {
  // 1. Disable context menu
  const blockContextMenu = (e: MouseEvent) => e.preventDefault();

  // 2. Disable Ctrl+C, Ctrl+P
  const blockKeyExploits = (e: KeyboardEvent) => {
   if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
    e.preventDefault();
    alert('Cảnh báo bảo mật: Hệ thống đã chặn hành vi in tệp tài liệu cuộc họp này.');
   }
   if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
    e.preventDefault();
    alert('Cảnh báo bảo mật: Không được phép sao chép dữ liệu văn bản cuộc họp.');
   }
  };

  document.addEventListener('contextmenu', blockContextMenu);
  document.addEventListener('keydown', blockKeyExploits);

  return () => {
   document.removeEventListener('contextmenu', blockContextMenu);
   document.removeEventListener('keydown', blockKeyExploits);
  };
 }, []);

 return (
  <div className="select-none print:hidden relative w-full h-full">
   {children}
  </div>
 );
};
