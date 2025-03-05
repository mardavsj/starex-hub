import Navbar from "./components/Navbar";
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from "./pages/ChatPage";
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import GamesPage from "./pages/GamesPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from './store/useThemeStore';

import { useEffect } from "react";
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast";

import { useLocation } from "react-router-dom";

const App = () => {

  const location = useLocation();
  const excludeFooterPages = ["/login", "/signup", "/settings", "/chat", "/profile", "/forgot-password", "/reset-password/:token"];

  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore()
  const {theme} = useThemeStore()

  console.log({onlineUsers})

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log({authUser})

  if(isCheckingAuth && !authUser) 
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    )

  return (
    <div data-theme={theme}>
      <Navbar/>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/chat"/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/chat"/>}/>
        <Route path="/chat" element={authUser ? <ChatPage/> : <Navigate to="/"/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/"/>}/>
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/forgot-password" element={<ForgotPassword /> } />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>

      {!excludeFooterPages.includes(location.pathname) && <Footer />}

      <Toaster/>

    </div>
  )
}

export default App