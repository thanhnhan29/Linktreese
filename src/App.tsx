import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  applyActionCode,
} from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  createUser as createUserDoc,
  createBioPage,
} from "./lib/firestoreSchemas";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";
import { userRepository } from "@/infrastructure/repositories";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import Dashboard from "./components/Dashboard";
import CreateUsername from "./components/CreateUsername";
import { Toaster } from "./components/ui/sonner";

type Page =
  | "login"
  | "signup"
  | "dashboard"
  | "forgot-password"
  | "reset-password"
  | "create-username";

interface AppUser {
  email: string;
  uid: string;
}

// Global flag to prevent auth state changes during signup
// Using a module-level variable because React state/ref won't work with the closure in onAuthStateChanged
let isSignupInProgress = false;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [user, setUser] = useState<AppUser | null>(null);
  const [currentBioPage, setCurrentBioPage] = useState<string>("");
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  // Clear app-specific localStorage keys to avoid stale local state persisting across runs.
  const clearAppLocalStorage = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        if (
          k === "currentUser" ||
          k.startsWith("bioPages_") ||
          k.startsWith("currentBioPage_") ||
          k.startsWith("user_")
        ) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (err) {
      // ignore in environments without localStorage
    }
  };

  // useEffect(() => {
  //   // Check if user is logged in
  //   const savedUser = localStorage.getItem('currentUser');
  //   if (savedUser) {
  //     const userData = JSON.parse(savedUser);
  //     setUser(userData);

  //     // Check if user has bio pages
  //     const bioPages = JSON.parse(localStorage.getItem(`bioPages_${userData.email}`) || '[]');

  //     if (bioPages.length === 0) {
  //       // First time user - need to create username
  //       setCurrentPage('create-username');
  //       setIsFirstTimeUser(true);
  //     } else {
  //       // Get current active bio page
  //       const activeBioPage = localStorage.getItem(`currentBioPage_${userData.email}`);
  //       setCurrentBioPage(activeBioPage || bioPages[0].username);
  //       setCurrentPage('dashboard');
  //     }
  //   }
  // }, []);
  useEffect(() => {
    // Check URL path first
    const path = window.location.pathname;
    if (path === "/forgot-password") {
      setCurrentPage("forgot-password");
      return;
    } else if (path === "/reset-password") {
      // Will be handled by oobCode check below if coming from email
      // Otherwise just show the page
      setCurrentPage("reset-password");
    }

    // Check if URL contains oobCode parameter for email verification or password reset
    const urlParams = new URLSearchParams(window.location.search);
    const oobCode = urlParams.get("oobCode");
    const mode = urlParams.get("mode");

    // Handle email verification
    if (oobCode && mode === "verifyEmail") {
      const verifyEmail = async () => {
        try {
          await applyActionCode(auth, oobCode);

          // Clean URL and show login
          window.history.replaceState({}, document.title, "/");
          alert("Email verified successfully! Please sign in.");
          setCurrentPage("login");
        } catch (error: any) {
          console.error("Verification error:", error);
          window.history.replaceState({}, document.title, "/");
          alert(
            "Verification failed: " +
              (error.message || "Please try again or request a new link.")
          );
          setCurrentPage("login");
        }
      };

      verifyEmail();
      return; // Don't run the rest of the effect
    }

    // Handle password reset
    if (oobCode && mode === "resetPassword") {
      setCurrentPage("reset-password");
      return; // Don't run the rest of the effect
    }

    let unsubscribeFn: (() => void) | null = null;

    const initAuth = async () => {
      // Clear localStorage cũ nếu muốn (tùy chọn)
      clearAppLocalStorage();

      unsubscribeFn = onAuthStateChanged(auth, async (firebaseUser) => {
        console.log("=== onAuthStateChanged fired ===");
        console.log("isSignupInProgress:", isSignupInProgress);
        console.log("firebaseUser:", firebaseUser?.email || "null");

        // Skip auto-redirect if user is pending email verification
        if (isSignupInProgress) {
          console.log("SKIPPING - signup in progress");
          return;
        }

        if (firebaseUser && firebaseUser.email) {
          // If the user's email is not verified yet, do not auto-redirect them to create-username.
          // This prevents newly-created-but-unverified accounts from being treated as fully active.
          if (!firebaseUser.emailVerified) {
            console.log(
              "Auth state: user signed in but email not verified yet. Skipping redirect."
            );
            return;
          }
          // Lưu thông tin user bao gồm cả UID
          const userData: AppUser = {
            email: firebaseUser.email,
            uid: firebaseUser.uid,
          };
          setUser(userData);

          // --- LOGIC MỚI: KIỂM TRA FIRESTORE ---
          try {
            // Tìm xem user này đã có Bio Page nào chưa
            const q = query(
              collection(db, "bio_pages"),
              where("userId", "==", firebaseUser.uid)
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
              // Nếu đã có trang -> Vào thẳng Dashboard
              const data = snapshot.docs[0].data();
              setCurrentBioPage(data.username);
              setCurrentPage("dashboard");
            } else {
              // Nếu chưa có -> Chuyển sang trang tạo Username
              setCurrentPage("create-username");
              setIsFirstTimeUser(true);
            }
          } catch (err) {
            console.error("Lỗi khi tải dữ liệu từ Firestore:", err);
          }
        } else {
          setUser(null);
          setCurrentPage("login");
        }
      });
    };

    initAuth();

    return () => {
      if (unsubscribeFn) unsubscribeFn();
    };
  }, []);

  // const handleLogin = (identifier: string, password: string) => {
  //   // Demo user - can login with username or email
  //   const DEMO_USERNAME = 'NTK_Harry';
  //   const DEMO_EMAIL = 'abc@gmail.com';
  //   const DEMO_PASSWORD = 'Hihi34@';

  //   if ((identifier === DEMO_USERNAME || identifier === DEMO_EMAIL) && password === DEMO_PASSWORD) {
  //     const user: User = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
  //     setUser(user);
  //     localStorage.setItem('currentUser', JSON.stringify(user));

  //     // Check if demo user has bio pages
  //     const bioPages = JSON.parse(localStorage.getItem(`bioPages_${DEMO_EMAIL}`) || '[]');

  //     if (bioPages.length === 0) {
  //       // Create demo bio page for NTK_Harry
  //       const demoBioPage: BioPage = {
  //         username: DEMO_USERNAME,
  //         profileImage: '',
  //         bio: '',
  //         displayName: DEMO_USERNAME
  //       };
  //       localStorage.setItem(`bioPages_${DEMO_EMAIL}`, JSON.stringify([demoBioPage]));
  //       localStorage.setItem(`currentBioPage_${DEMO_EMAIL}`, DEMO_USERNAME);
  //       setCurrentBioPage(DEMO_USERNAME);
  //     } else {
  //       const activeBioPage = localStorage.getItem(`currentBioPage_${DEMO_EMAIL}`);
  //       setCurrentBioPage(activeBioPage || bioPages[0].username);
  //     }

  //     setCurrentPage('dashboard');
  //     return true;
  //   }

  //   // Check for other registered users
  //   const userKey = `user_${identifier}`;
  //   const savedUserData = localStorage.getItem(userKey);

  //   if (savedUserData) {
  //     const userData = JSON.parse(savedUserData);
  //     if (userData.password === password) {
  //       const user: User = { email: userData.email, password: userData.password };
  //       setUser(user);
  //       localStorage.setItem('currentUser', JSON.stringify(user));

  //       // Get bio pages
  //       const bioPages = JSON.parse(localStorage.getItem(`bioPages_${userData.email}`) || '[]');

  //       if (bioPages.length === 0) {
  //         setCurrentPage('create-username');
  //         setIsFirstTimeUser(true);
  //       } else {
  //         const activeBioPage = localStorage.getItem(`currentBioPage_${userData.email}`);
  //         setCurrentBioPage(activeBioPage || bioPages[0].username);
  //         setCurrentPage('dashboard');
  //       }

  //       return true;
  //     }
  //   }

  //   return false;
  // };
  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Sync emailVerified status from Firebase Auth to Firestore
      if (firebaseUser.emailVerified) {
        try {
          await userRepository.update(firebaseUser.uid, {
            emailVerified: true,
          });
          console.log("Updated Firestore emailVerified to true");
        } catch (err) {
          console.error("Failed to update emailVerified in Firestore:", err);
        }
      }

      // Firebase listener in useEffect will handle the state updates
      return true;
    } catch (error) {
      console.error("Login failed", error);
      throw error; // Throw error so LoginPage can display it
    }
  };

  // const handleSignup = (email: string, password: string) => {
  //   // Check if email already exists
  //   const existingUser = localStorage.getItem(`user_${email}`);
  //   if (existingUser) {
  //     return false;
  //   }

  //   const newUser: User = { email, password };

  //   // Save user credentials
  //   localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
  //   localStorage.setItem('currentUser', JSON.stringify(newUser));

  //   // Initialize empty bio pages array
  //   localStorage.setItem(`bioPages_${email}`, JSON.stringify([]));

  //   setUser(newUser);
  //   setIsFirstTimeUser(true);
  //   setCurrentPage('create-username');
  // };
  const handleSignup = async (
    email: string,
    password: string
  ): Promise<{ emailSent: boolean }> => {
    // Set flag FIRST to prevent onAuthStateChanged from redirecting
    console.log("=== handleSignup called ===");
    console.log("Setting isSignupInProgress to true");
    isSignupInProgress = true;

    try {
      console.log("Calling createUserWithEmailAndPassword...");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User created, uid:", userCredential.user?.uid);
      const uid = userCredential.user?.uid;
      const firebaseUser = userCredential.user;

      // Initialize empty bio pages array for this email
      localStorage.setItem(`bioPages_${email}`, JSON.stringify([]));

      // Also create a Firestore `users/{uid}` document so the user shows up in Firestore.
      if (uid) {
        await createUserDoc(uid, { email });

        // Update Firestore with emailVerified status
        await userRepository.update(uid, { emailVerified: false });
      }

      // Send verification email - use current origin so it works on any port
      const currentOrigin = window.location.origin; // e.g., http://localhost:3001
      const actionCodeSettings = {
        url: currentOrigin,
        handleCodeInApp: true,
      };
      console.log("Sending verification email with URL:", currentOrigin);
      await sendEmailVerification(firebaseUser, actionCodeSettings);

      // Sign out so user can't proceed until verified
      await signOut(auth);
      console.log("User signed out after signup");

      // isSignupInProgress stays true so the page stays on signup with "check email" message
      return { emailSent: true };
    } catch (error) {
      console.error("Signup failed", error);
      isSignupInProgress = false; // Reset on error so they can try again
      throw error;
    }
  };

  const handleCreateUsername = async (username: string) => {
    if (!user) return;

    try {
      // Gọi hàm từ firestoreSchemas.ts để tạo document thật trên Firebase
      await createBioPage({
        userId: user.uid,
        username: username,
        bioDescription: "",
        published: true,
      });

      // Cập nhật state ứng dụng
      setCurrentBioPage(username);
      setIsFirstTimeUser(false);
      setCurrentPage("dashboard");
    } catch (error) {
      console.error("Failed to create bio page:", error);
      // Bạn có thể thêm toast thông báo lỗi ở đây
    }
  };

  const handleSwitchBioPage = (username: string) => {
    if (!user) return;

    localStorage.setItem(`currentBioPage_${user.email}`, username);
    setCurrentBioPage(username);
  };

  // const handleLogout = () => {
  //   localStorage.removeItem('currentUser');
  //   setUser(null);
  //   setCurrentBioPage('');
  //   setCurrentPage('login');
  // };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setCurrentBioPage("");
    setCurrentPage("login");
  };

  if (currentPage === "login") {
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          onSwitchToSignup={() => setCurrentPage("signup")}
          onSwitchToForgotPassword={() => {
            window.history.pushState({}, "", "/forgot-password");
            setCurrentPage("forgot-password");
          }}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "signup") {
    return (
      <>
        <SignupPage
          onSignup={handleSignup}
          onSwitchToLogin={() => {
            isSignupInProgress = false; // Clear flag when switching to login
            setCurrentPage("login");
          }}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "create-username" && user) {
    return (
      <>
        <CreateUsername
          userEmail={user.email}
          onCreateUsername={handleCreateUsername}
          isFirstTime={isFirstTimeUser}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "dashboard" && user && currentBioPage) {
    return (
      <>
        <Dashboard
          userEmail={user.email}
          userId={user.uid}
          currentBioPageUsername={currentBioPage}
          onSwitchBioPage={handleSwitchBioPage}
          onCreateNewBioPage={() => {
            setIsFirstTimeUser(false);
            setCurrentPage("create-username");
          }}
          onLogout={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "forgot-password") {
    return (
      <>
        <ForgotPasswordPage
          onSwitchToLogin={() => {
            isSignupInProgress = false; // Clear flag when switching to login
            window.history.pushState({}, "", "/");
            setCurrentPage("login");
          }}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "reset-password") {
    return (
      <>
        <ResetPasswordPage
          onResetSuccess={() => {
            window.history.pushState({}, "", "/");
            setCurrentPage("login");
          }}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Toaster />
    </>
  );
}
