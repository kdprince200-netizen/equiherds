"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export default function AuthSessionProvider({ children }) {
  useEffect(() => {
    // Intercept fetch calls to handle empty JSON responses from NextAuth
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        const url = args[0];
        
        // Only intercept NextAuth session calls
        if (typeof url === 'string' && url.includes('/api/auth/session')) {
          const clonedResponse = response.clone();
          
          // Handle error status codes (500, etc.)
          if (!response.ok) {
            console.warn('NextAuth session endpoint returned error:', response.status);
            return new Response(
              JSON.stringify({ user: null, expires: null }),
              {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
          }
          
          const text = await clonedResponse.text();
          
          // If response is empty, return a valid JSON response
          if (!text || text.trim() === '') {
            return new Response(
              JSON.stringify({ user: null, expires: null }),
              {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
          }
          
          // Validate JSON
          try {
            JSON.parse(text);
            return response;
          } catch {
            // If invalid JSON, return valid empty session
            return new Response(
              JSON.stringify({ user: null, expires: null }),
              {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
          }
        }
        
        return response;
      } catch (error) {
        // If fetch fails, return valid JSON for session endpoint
        if (typeof args[0] === 'string' && args[0].includes('/api/auth/session')) {
          return new Response(
            JSON.stringify({ user: null, expires: null }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }
        throw error;
      }
    };
    
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <SessionProvider
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
