import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import skyimage from "./sky.png";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/upload");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            KalusteArvio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <img src={skyimage} alt="Logo" className="w-32 h-32 mx-auto" />
          <p className="text-center">
            Hei! Olen KalusteArvioBotti. Autan sinua arvioimaan mitä sinun
            kannattaa tehdä tarpeettomalle tai huonokuntoiselle kalusteelle.
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Lataa kuva kalusteesta.</li>
            <li>Tarkista tekoälyn tunnistamat kalusteen tiedot.</li>
            <li>
              Tekoäly auttaa sinua arvioimaan mitä kalusteelle kannattaa tehdä.
            </li>
          </ol>
          <Button onClick={handleStartClick} className="w-full">
            ALOITA
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomePage;
