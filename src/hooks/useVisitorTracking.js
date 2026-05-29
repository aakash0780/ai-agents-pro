import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { visitorsAPI } from '@/lib/api';

function getSessionId() {
  const key = 'visitorSessionId';
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;

  const next = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  sessionStorage.setItem(key, next);
  return next;
}

export function useVisitorTracking() {
  const location = useLocation();

  useEffect(() => {
    const sessionId = getSessionId();
    const page = `${location.pathname}${location.search}`;

    visitorsAPI.track({
      page,
      referrer: document.referrer || 'direct',
      sessionId,
    }).catch(() => {
      // Visitor tracking should never interrupt navigation.
    });
  }, [location.pathname, location.search]);
}
