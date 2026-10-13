import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Every time the page changes, start at the top, instantly (no scrolling animation),
// like a normal website page.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
