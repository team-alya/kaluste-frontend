import { Button } from "@/components/ui/button";
import { motion, useAnimation } from "motion/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../PageWrapper";

const HeroSection = () => {
  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await controls.start("showContent");
      await controls.start("showImage");
    };

    sequence();
  }, [controls]);

  const handleStartClick = () => {
    navigate("/upload");
  };

  return (
    <PageWrapper>
      <motion.section
        exit={{
          opacity: 0,
          transition: { duration: 0.3 },
        }}
        className="min-h-[90vh] bg-background/80 flex items-center py-12 sm:py-16 lg:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 40 }}
              animate={controls}
              variants={{
                showContent: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7 },
                },
              }}
            >
              <h1 className="text-green-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                KalusteArvio
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-[600px] leading-relaxed">
                Olen{" "}
                <span className="text-green-light">KalusteArvioBotti.</span>{" "}
                Autan sinua arvioimaan mitä sinun kannattaa tehdä tarpeettomalle
                tai huonokuntoiselle kalusteelle.
              </p>

              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                  Näin käytät sovellusta:
                </h2>
                <ol className="space-y-4 sm:space-y-5 text-muted-foreground text-sm sm:text-base">
                  {[
                    "Lataa kuva kalusteesta.",
                    "Tarkista tekoälyn tunnistamat kalusteen tiedot.",
                    "Tekoäly auttaa sinua arvioimaan mitä kalusteelle kannattaa tehdä.",
                  ].map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mr-3">
                        {index + 1}
                      </span>
                      <span className="mt-1 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
                <Button
                  onClick={handleStartClick}
                  size="lg"
                  className="mt-6 sm:mt-8 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-semibold md:w-56 w-full 
  hover:scale-[1.02] hover:shadow-md transition-all duration-200"
                >
                  ALOITA
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="relative flex justify-center lg:justify-end mt-8 lg:mt-0"
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                showImage: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    delay: 0.3,
                    type: "spring",
                    stiffness: 50,
                    damping: 15,
                  },
                },
              }}
            >
              <div className="relative w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[600px] aspect-square">
                <img
                  src="/hero/iphone.png"
                  alt="Alya Logo"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                />
                <div className="absolute inset-0 bg-primary/5 rounded-full shadow-lg"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </PageWrapper>
  );
};

export default HeroSection;
