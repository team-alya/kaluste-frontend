import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import ChatbotPage from "./components/ChatbotPage/ChatbotPage";
import FurniConfirmPage from "./components/ConfirmationPage/ConfirmationPage";
import ImageUploadPage from "./components/ImageUploadPage/ImageUploadPage";
import WelcomePage from "./components/WelcomePage/HeroSection";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c1e1c1] via-[#77b980] to-[#5a8055] text-foreground ">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/upload" element={<ImageUploadPage />} />
          <Route path="/confirmation" element={<FurniConfirmPage />} />
          <Route path="/chatbotpage" element={<ChatbotPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
