import { Route, Routes } from "react-router-dom";
import ChatbotPage from "./components/ChatbotPage/ChatbotPage";
import FurniConfirmPage from "./components/ConfirmationPage/ConfirmationPage";
import ImageUploadPage from "./components/ImageUploadPage/ImageUploadPage";
import WelcomePage from "./components/WelcomePage/WelcomePage";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c1e1c1] via-[#72b77b] to-[#75a46e] text-foreground">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/upload" element={<ImageUploadPage />} />
        <Route path="/confirmation" element={<FurniConfirmPage />} />
        <Route path="/chatbotpage" element={<ChatbotPage />} />
      </Routes>
    </div>
  );
}

export default App;
