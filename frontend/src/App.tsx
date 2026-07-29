import { useEffect, useMemo, useState } from "react";
import { DiaryDetailPage } from "./diary-detail";
import { DiaryPage } from "./diary-list";
import { UploadPage } from "./upload";
import { LandingPage } from "./landing/LandingPage";
import { NetworkStatusBanner } from "./shared/components/NetworkStatusBanner";
import { SecurityGuard } from "./shared/components/SecurityGuard";

function getCurrentPath() {
 return window.location.pathname;
}

function getMeetingIdFromPath(pathname: string): string | null {
 const match = pathname.match(/^\/diary\/([^/]+)$/);
 if (!match) {
  return null;
 }
 return decodeURIComponent(match[1]);
}

export default function App() {
 const [pathname, setPathname] = useState(getCurrentPath);

 useEffect(() => {
  // Theme Init
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
   document.documentElement.classList.remove('dark');
  } else {
   document.documentElement.classList.add('dark');
  }
  
  const handlePopState = () => setPathname(getCurrentPath());
  window.addEventListener("popstate", handlePopState);
  return () => window.removeEventListener("popstate", handlePopState);
 }, []);

 const activeMeetingId = useMemo(() => getMeetingIdFromPath(pathname), [pathname]);

 if (activeMeetingId) {
  return (
   <SecurityGuard>
    <NetworkStatusBanner />
    <DiaryDetailPage meetingId={activeMeetingId} />
   </SecurityGuard>
  );
 }

 if (pathname === "/upload") {
  return (
   <SecurityGuard>
    <NetworkStatusBanner />
    <UploadPage />
   </SecurityGuard>
  );
 }

 if (pathname === "/diary-list" || pathname === "/diary") {
  return (
   <SecurityGuard>
    <NetworkStatusBanner />
    <DiaryPage
     onOpenDiaryDetail={(meetingId) => {
      const nextPath = `/diary/${encodeURIComponent(meetingId)}`;
      window.history.pushState({}, "", nextPath);
      setPathname(nextPath);
     }}
    />
   </SecurityGuard>
  );
 }

 // Default to Landing Page for '/' and any unmatched paths
 return (
  <>
   <NetworkStatusBanner />
   <LandingPage />
  </>
 );
}
