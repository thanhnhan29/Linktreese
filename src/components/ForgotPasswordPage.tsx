import { useState } from "react";
import { authService } from "@/features/auth/services/authService";
import svgPaths from "../imports/svg-du8004kdwc";

interface ForgotPasswordPageProps {
  onSwitchToLogin: () => void;
}

export default function ForgotPasswordPage({
  onSwitchToLogin,
}: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) setEmailError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError("");

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    setIsLoading(true);

    try {
      await authService.sendPasswordResetEmail(email);
      setEmailSent(true);
    } catch (error: any) {
      setEmailError(error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Logo */}
      <div className="absolute left-12 top-12">
        <svg className="h-6 w-[113px]" fill="none" viewBox="0 0 113 24">
          <g>
            <path d={svgPaths.p3b866300} fill="black" />
            <path d={svgPaths.p895a00} fill="#43E660" />
          </g>
        </svg>
      </div>

      {/* Forgot Password Form */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[592px]">
        {!emailSent ? (
          <>
            <h1 className="font-['Inter'] tracking-[-2px] text-black mb-6 text-[24px]">
              Reset your password
            </h1>
            <p className="tracking-[-0.32px] text-[#676b5f] mb-12">
              Enter your email address and we'll send you a link to reset your
              password
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="Your email"
                  disabled={isLoading}
                  className={`bg-[#f6f7f5] rounded-[8px] w-full px-4 py-4 text-black placeholder:text-[#676b5f] disabled:opacity-50 ${
                    emailError ? "border-2 border-red-500" : ""
                  }`}
                />
                {emailError && (
                  <p className="text-red-500 mt-2 text-[14px]">{emailError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#8129d9] text-white rounded-[64px] w-full py-3 tracking-[-0.32px] hover:bg-[#7020c0] transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </button>

              <div className="text-center">
                <p className="text-[#676b5f]">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-[#8129d9] hover:underline"
                  >
                    Back to login
                  </button>
                </p>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="font-['Inter'] tracking-[-2px] text-black mb-4 text-[24px]">
              Check your email
            </h1>
            <p className="tracking-[-0.32px] text-[#676b5f] mb-8">
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions.
            </p>
            <button
              onClick={onSwitchToLogin}
              className="bg-[#8129d9] text-white rounded-[64px] px-8 py-3 tracking-[-0.32px] hover:bg-[#7020c0] transition-colors text-center"
            >
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
