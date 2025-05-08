import loaderAnimation from "@/lib/lottie/loader-animation.json";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

interface LoaderAnimationProps {
  isLoading: boolean;
  text: string;
  loadingTexts?: string[];
  finalText?: string;
  longWaitText?: string;
}

function LoaderAnimation({
  isLoading,
  text,
  loadingTexts = [
    "Tarkistetaan tietoja...", 
    "Prosessoidaan...",
    "Analysoidaan tietoja tarkemmin...",
    "Tekoäly muodostaa kokonaiskuvaa..."
  ],
  finalText = "Pieni hetki vielä...",
  longWaitText = "Tekoäly miettii vielä...\nTämä näyttää vaativan tavallista enemmän pohdintaa! 🤔",
}: LoaderAnimationProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showLongWaitText, setShowLongWaitText] = useState(false);
  const allTexts = [text, ...loadingTexts, finalText];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let longWaitTimer: NodeJS.Timeout;

    if (isLoading && currentTextIndex < allTexts.length - 1) {
      timer = setTimeout(() => {
        setCurrentTextIndex((prev) => prev + 1);
      }, 5000);
    }

    if (isLoading && !showLongWaitText) {
      longWaitTimer = setTimeout(() => {
        setShowLongWaitText(true);
      }, 60000); // 60000ms = 1min
    }

    if (!isLoading) {
      setCurrentTextIndex(0);
      setShowLongWaitText(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (longWaitTimer) clearTimeout(longWaitTimer);
    };
  }, [isLoading, currentTextIndex, allTexts.length, showLongWaitText]);

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4">
            {/* Suurennettu animaation koko */}
            <div className="w-32 h-32 sm:w-40 sm:h-40">
              <Lottie
                animationData={loaderAnimation}
                loop={true}
                autoplay={true}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div className="min-h-[3rem] text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentTextIndex + (showLongWaitText ? "-long" : "")}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm font-medium text-gray-600"
                >
                  {showLongWaitText ? longWaitText : allTexts[currentTextIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoaderAnimation;
