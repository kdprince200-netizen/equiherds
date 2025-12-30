'use client';

import { useEffect } from 'react';

export default function RemoveNextJSIndicator() {
  useEffect(() => {
    // Function to remove all Next.js indicators
    const removeIndicators = () => {
      // Remove by ID
      const idsToRemove = [
        '__next-build-watcher',
        '__next-dev-overlay',
      ];
      
      idsToRemove.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.remove();
        }
      });

      // Remove by data attributes
      const selectors = [
        '[data-nextjs-dialog]',
        '[data-nextjs-toast]',
        '[data-nextjs-dialog-overlay]',
        '[data-nextjs-icon]',
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });

      // Remove by class names
      const classSelectors = [
        '.nextjs-toast-errors-parent',
        '[class*="nextjs"]',
        '[class*="__next"]',
      ];

      classSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el.id && (el.id.includes('__next') || el.id.includes('nextjs'))) {
            el.remove();
          }
        });
      });

      // Remove fixed position elements in corners (likely indicators)
      const allDivs = document.querySelectorAll('div');
      allDivs.forEach(div => {
        const style = window.getComputedStyle(div);
        const id = div.id || '';
        const className = div.className || '';
        
        if (
          (id.includes('__next') || id.includes('nextjs') || 
           className.includes('nextjs') || className.includes('__next')) &&
          (style.position === 'fixed' && 
           (style.bottom === '0px' || style.right === '0px' || 
            style.zIndex === '9999' || style.zIndex === '99999'))
        ) {
          div.remove();
        }
      });

      // Remove iframes that might contain Next.js dev tools
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (iframe.src && iframe.src.includes('__nextjs')) {
          iframe.remove();
        }
      });
    };

    // Run immediately
    removeIndicators();

    // Set up MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      removeIndicators();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id', 'class', 'data-nextjs-dialog', 'data-nextjs-toast'],
    });

    // Also run periodically as backup
    const interval = setInterval(removeIndicators, 100);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
}

