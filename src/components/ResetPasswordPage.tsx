import { useState, useEffect } from "react";
import { authService } from "@/features/auth/services/authService";
import svgPaths from "../imports/svg-du8004kdwc";
import imgFrame from "figma:asset/a3d78743adbd2d2160e019486919a6bb2862cbcd.png";

interface ResetPasswordPageProps {
  onResetSuccess: () => void;
}

export default function ResetPasswordPage({
  onResetSuccess,
}: ResetPasswordPageProps) {
  const [status, setStatus] = useState<
    "idle" | "validating" | "valid" | "invalid" | "resetting" | "success"
  >("idle");
  const [oobCode, setOobCode] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const validateResetCode = async () => {
      // Get oobCode from URL query params
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("oobCode");
      const mode = urlParams.get("mode");

      if (!code || mode !== "resetPassword") {
        setStatus("invalid");
        setErrorMessage(
          "Invalid password reset link. Please request a new one."
        );
        return;
      }

      setOobCode(code);
      setStatus("validating");

      try {
        // Verify the reset code and get the associated email
        const userEmail = await authService.verifyPasswordResetCode(code);
        setEmail(userEmail);
        setStatus("valid");
      } catch (error: any) {
        setStatus("invalid");
        setErrorMessage(error.message || "Invalid or expired reset link.");
      }
    };

    validateResetCode();
  }, []);

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length > 50) {
      errors.push("maximum 50 characters");
    }
    if (password.length < 8) {
      errors.push("at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("one number");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push("one special character (!@#$%^&*)");
    }
    return errors;
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (value) {
      const errors = validatePassword(value);
      if (errors.length > 0) {
        setNewPasswordError(`Password must contain ${errors.join(", ")}`);
      } else {
        setNewPasswordError("");
      }
    } else {
      setNewPasswordError("");
    }

    // Re-validate confirm password if it exists
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else if (confirmPassword) {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value && value !== newPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else if (value) {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setNewPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    // Validate new password
    if (!newPassword) {
      setNewPasswordError("New password is required");
      hasError = true;
    } else {
      const errors = validatePassword(newPassword);
      if (errors.length > 0) {
        setNewPasswordError(`Password must contain ${errors.join(", ")}`);
        hasError = true;
      }
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      hasError = true;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setStatus("resetting");

    try {
      await authService.confirmPasswordReset(oobCode, newPassword);
      setStatus("success");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        onResetSuccess();
      }, 2000);
    } catch (error: any) {
      setNewPasswordError(
        error.message || "Failed to reset password. Please try again."
      );
      setStatus("valid"); // Go back to form state
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Background Image Section */}
      <div className="absolute bg-[#254f1a] h-full right-0 top-0 w-[470px] overflow-hidden">
        <div className="absolute h-[158.84%] left-0 top-[-29.42%] w-full">
          <img alt="" className="h-full w-full object-cover" src={imgFrame} />
        </div>
      </div>

      {/* Logo */}
      <div className="absolute left-12 top-12">
        <svg className="h-6 w-[113px]" fill="none" viewBox="0 0 113 24">
          <g>
            <path d={svgPaths.p3b866300} fill="black" />
            <path d={svgPaths.p895a00} fill="#43E660" />
          </g>
        </svg>
      </div>

      {/* Reset Password Form */}
      <div className="absolute left-[174px] top-[200px] w-[592px]">
        {status === "validating" && (
          <div className="text-center">
            <div className="mb-6 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#8129d9] border-r-transparent"></div>
            <h1 className="font-['Inter'] tracking-[-2px] text-black mb-4 text-[24px]">
              Validating reset link...
            </h1>
            <p className="tracking-[-0.32px] text-[#676b5f]">
              Please wait while we verify your password reset link.
            </p>
          </div>
        )}

        {status === "invalid" && (
          <div className="text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="font-['Inter'] tracking-[-2px] text-black mb-4 text-[24px]">
              Invalid Reset Link
            </h1>
            <p className="tracking-[-0.32px] text-[#676b5f] mb-8">
              {errorMessage}
            </p>
            <button
              onClick={onResetSuccess}
              className="bg-[#8129d9] text-white rounded-[64px] px-8 py-3 tracking-[-0.32px] hover:bg-[#7020c0] transition-colors text-center"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === "success" && (
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="font-['Inter'] tracking-[-2px] text-black mb-4 text-[24px]">
              Password reset successful!
            </h1>
            <p className="tracking-[-0.32px] text-[#676b5f] mb-8">
              Your password has been changed. Redirecting you to sign in...
            </p>
          </div>
        )}

        {(status === "valid" || status === "resetting") && (
          <>
            <h1 className="font-['Inter'] tracking-[-2px] text-black mb-6 text-[24px]">
              Create new password
            </h1>
            <p className="tracking-[-0.32px] text-[#676b5f] mb-12">
              Enter your new password for <strong>{email}</strong>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => handleNewPasswordChange(e.target.value)}
                    placeholder="New password"
                    disabled={status === "resetting"}
                    maxLength={50}
                    className={`bg-[#f6f7f5] rounded-[8px] w-full px-4 py-4 pr-12 text-black placeholder:text-[#676b5f] disabled:opacity-50 ${newPasswordError ? "border-2 border-red-500" : ""
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#676b5f] hover:text-black transition-colors"
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {newPasswordError && (
                  <p className="text-red-500 mt-2 text-[14px]">
                    {newPasswordError}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={status === "resetting"}
                    maxLength={50}
                    className={`bg-[#f6f7f5] rounded-[8px] w-full px-4 py-4 pr-12 text-black placeholder:text-[#676b5f] disabled:opacity-50 ${confirmPasswordError ? "border-2 border-red-500" : ""
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#676b5f] hover:text-black transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="text-red-500 mt-2 text-[14px]">
                    {confirmPasswordError}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-[#f6f7f5] p-4 rounded-[8px]">
                <p className="text-[14px] text-[#676b5f] mb-2">
                  Password must contain:
                </p>
                <ul className="text-[14px] text-[#676b5f] space-y-1 list-disc list-inside">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special character (!@#$%^&*)</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={status === "resetting"}
                className="bg-[#8129d9] text-white rounded-[64px] w-full py-3 tracking-[-0.32px] hover:bg-[#7020c0] transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "resetting"
                  ? "Resetting password..."
                  : "Reset password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
