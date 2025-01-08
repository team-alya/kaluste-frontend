import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { TextLoop } from "@/components/ui/text-loop";
import { motion, useAnimation } from "motion/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
        className="min-h-[90vh] bg-background/80 flex items-center py-12 sm:py-16 lg:py-20 relative z-20 overflow-hidden"
      >
        {/* Koristeelliset elementit */}
        <motion.div
          className="absolute inset-0 pointer-events-none hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Vasen yläkulma */}
          <motion.img
            src="/hero/circle.svg"
            className="absolute top-12 left-12 w-24 h-12"
            initial={{ scale: 0.9, opacity: 0.35 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          {/* Oikea alakulma */}
          <motion.img
            src="/hero/half-circle.svg"
            className="absolute  bottom-[-10px] -right-10 w-32 h-20 z-10"
            initial={{ x: 15, opacity: 0.3 }}
            animate={{ x: 0, opacity: 0.4 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          {/* Oikea yläkulma */}
          <motion.img
            src="/hero/circle.svg"
            className="fixed top-[5%] left-[85%] w-12 h-12"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          {/* Pallo keskellä about */}
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-green-light/10 rounded-full -z-10"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1.1 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center ">
            <div className="grid gap-12 ">
              {/* Header and Introduction */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: -0.25, y: 40 }}
                animate={controls}
                variants={{
                  showContent: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.8,
                      ease: "easeOut",
                    },
                  },
                }}
              >
                <h1 className="text-green-light text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  KalusteArvio.
                </h1>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground/50 font-medium uppercase tracking-wide">
                    Vastuullista huonekalujen kierrätystä
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-[630px] leading-normal font-light">
                    Olen{" "}
                    <span className="text-green-light">KalusteArvioBotti.</span>{" "}
                    Autan sinua{" "}
                    <TextLoop
                      interval={3.7}
                      className="text-green-light inline-block w-32 md:w-44  text-start mt-0.5"
                    >
                      <span className="block">arviomainaan</span>
                      <span className="block">kierrättämään</span>
                      <span className="block">uudistamaan</span>
                    </TextLoop>
                    käytetyn kalusteen.
                  </p>
                </div>
              </motion.div>

              {/* Mobile Image */}
              <motion.div
                className="block lg:hidden"
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
                <div className="relative w-full max-w-[300px] sm:max-w-[400px] aspect-square mx-auto">
                  <img
                    src="/hero/iphone.png"
                    alt="Alya Logo"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                  />
                  <div className="absolute inset-0 bg-primary/5 rounded-full shadow-lg"></div>
                </div>
              </motion.div>

              {/* Instructions */}
              <motion.div
                className="space-y-4 sm:space-y-6"
                initial={{ opacity: -0.25, y: 40 }}
                animate={controls}
                variants={{
                  showContent: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.8,
                      ease: "easeOut",
                    },
                  },
                }}
              >
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
                  className="z-20 mt-6 sm:mt-8 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-semibold md:w-56 w-full 
                    hover:scale-[1.02] hover:shadow-md transition-all duration-200"
                >
                  ALOITA
                </Button>
              </motion.div>
            </div>

            {/* Desktop Image */}
            <motion.div
              className="hidden lg:flex justify-end"
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
              <div className="relative w-full max-w-[600px] aspect-square">
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
