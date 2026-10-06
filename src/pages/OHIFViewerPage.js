import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function OHIFViewerPage() {
  const { search } = useLocation();
  const iframeRef = useRef(null);
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const studyUID = params.get('StudyInstanceUID') || '';
  const seriesUID = params.get('SeriesInstanceUID') || '';
  const ohifBase = process.env.REACT_APP_OHIF_URL || '/ohif';

  // Construct viewer URL with query params expected by OHIF
  const viewerUrl = useMemo(() => {
    const u = new URL(ohifBase, window.location.origin);
    // common patterns: /?StudyInstanceUID=<uid> or /viewer
    if (!u.searchParams.has('StudyInstanceUID') && studyUID) {
      u.searchParams.set('StudyInstanceUID', studyUID);
    }
    if (seriesUID) u.searchParams.set('SeriesInstanceUID', seriesUID);
    return u.toString();
  }, [ohifBase, studyUID, seriesUID]);

  useEffect(() => {
    const token = localStorage.getItem('access') || localStorage.getItem('token') || '';
    // Try to send token to viewer once loaded
    const onLoad = () => {
      try {
        iframeRef.current?.contentWindow?.postMessage({ type: 'SET_TOKEN', token }, '*');
      } catch {}
    };
    const el = iframeRef.current;
    if (el) el.addEventListener('load', onLoad);
    return () => el && el.removeEventListener('load', onLoad);
  }, []);

  return (
    <div style={{ height: 'calc(100vh - 120px)' }}>
      <iframe
        ref={iframeRef}
        src={viewerUrl}
        title="OHIF Viewer"
        style={{ width: '100%', height: '100%', border: 'none' }}
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
