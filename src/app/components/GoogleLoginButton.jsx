"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function GoogleLoginButton({ onSuccess }) {
  const router = useRouter();
  const handleGoogleLogin = async () => {
    try {
      console.log("Starting Google login...");
      
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/profile",
      });

      console.log("Google login result:", result);

      if (result?.error) {
        console.error("Google login error:", result.error);
        toast.error(`Google login failed: ${result.error}`);
      } else if (result?.ok) {
        // After successful Google OAuth, create/verify user in our database
        try {
          const session = await getSession();
          if (session?.user?.email) {
            // First, ensure user exists in our database
            const userResponse = await fetch('/api/auth/google-user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            const userData = await userResponse.json();

            if (userResponse.ok) {
              // Now get JWT token from unified login
              const loginResponse = await fetch('/api/auth/unified-login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: session.user.email,
                  authMethod: 'google'
                }),
              });

              const loginData = await loginResponse.json();

              if (loginResponse.ok && loginData.token) {
                // Store JWT token for our app
                localStorage.setItem("token", loginData.token);
                toast.success("Logged in successfully!");
                if (onSuccess) {
                  onSuccess();
                }
                // Redirect to profile page
                router.push("/profile");
              } else {
                toast.error(loginData.message || "Failed to complete login");
              }
            } else {
              toast.error(userData.message || "Failed to create user account");
            }
          }
        } catch (apiError) {
          console.error("API call error:", apiError);
          toast.error("Failed to complete login process");
        }
      }
    } catch (error) {
      console.error("Google login exception:", error);
      toast.error(`An error occurred during Google login: ${error.message}`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Continue with Google
    </button>
  );
}
