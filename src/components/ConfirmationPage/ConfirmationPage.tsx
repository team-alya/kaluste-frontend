import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import "./ConfirmationPage.css";
import { useLocation, useNavigate } from "react-router-dom";

function FurniConfirmPage() {
  const location = useLocation();
  const { furnitureResult, imageBlob } = location.state || { furnitureResult: null, imageBlob: null };

  // Initialize furnitureDetails state object
  const [furnitureDetails, setFurnitureDetails] = useState({
    merkki: furnitureResult?.merkki || "",
    kunto: furnitureResult?.kunto || "",
    malli: furnitureResult?.malli || "",
    mitat: {
      pituus: furnitureResult?.mitat?.pituus || "",
      korkeus: furnitureResult?.mitat?.korkeus || "",
      leveys: furnitureResult?.mitat?.leveys || "",
    },
    materiaalit: furnitureResult?.materiaalit?.join(", ") || "",
    väri: furnitureResult?.väri || ""
  });

  const navigate = useNavigate();

  // Generic change handler for input fields
  const handleInputChange = (field, value) => {
    setFurnitureDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  // Change handler for nested mitat fields
  const handleMitatChange = (dimension, value) => {
    setFurnitureDetails((prevDetails) => ({
      ...prevDetails,
      mitat: {
        ...prevDetails.mitat,
        [dimension]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
  
      // Convert furnitureDetails to JSON and add to formData
      const furnitureDetailsPayload = {
        ...furnitureDetails,
        mitat: {
          pituus: Number(furnitureDetails.mitat.pituus),
          korkeus: Number(furnitureDetails.mitat.korkeus),
          leveys: Number(furnitureDetails.mitat.leveys)
        },
        materiaalit: furnitureDetails.materiaalit.split(",").map((material) => material.trim()),
      };
      formData.append("furnitureDetails", JSON.stringify(furnitureDetailsPayload));
  
      if (imageBlob) {
        formData.append("image", imageBlob);
      }
  
      console.log("furnitureDetails:", formData.get("furnitureDetails"));
      console.log("image:", formData.get("image"));
  
      // First API Call: Price Estimate
      const priceResponse = await fetch("http://localhost:3000/api/price", {
        method: "POST",
        body: formData,
      });
  
      let priceData;
      if (priceResponse.ok) {
        priceData = await priceResponse.json();
        console.log("Price analysis:", priceData);
      } else {
        console.error("Failed to fetch price analysis. Status:", priceResponse.status);
      }
  
      // Second API Call: Repair Estimate
      const repairResponse = await fetch("http://localhost:3000/api/repair", {
        method: "POST",
        body: formData,
      });
  
      let repairData;
      if (repairResponse.ok) {
        repairData = await repairResponse.json();
        console.log("Repair analysis:", repairData);
      } else {
        console.error("Failed to fetch repair analysis. Status:", repairResponse.status);
      }
  
      // Navigate with the results if both calls are successful
      if (priceData && repairData) {
        navigate("/chatbotpage", { state: { furnitureResult, priceAnalysis: priceData, repairAnalysis: repairData } });
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <Box className="mainBox" component="form" onSubmit={handleSubmit}>
      <Box className="headingBox">
        <Typography variant="h5">Tietojen tarkistus</Typography>
      </Box>

      <Box className="instructionBox">
        <Typography variant="body1">
          Kalusteen tunnistaminen onnistui.
          <br />
          Tarkista, korjaa ja hyväksy tiedot.
        </Typography>
      </Box>

      {/* Form Fields */}
      <Box className="inputBox">
        <FormControl>
          <Typography align="left" variant="body1">
            Kalusteen merkki
          </Typography>
          <TextField
            name="furnitureModel"
            value={furnitureDetails.merkki}
            onChange={(e) => handleInputChange("merkki", e.target.value)}
            margin="normal"
            size="small"
            className="inputTextField"
          />
        </FormControl>
      </Box>

      <Box className="inputBox">
        <FormControl>
          <Typography align="left" variant="body1">
            Kalusteen malli
          </Typography>
          <TextField
            name="furnitureModel"
            value={furnitureDetails.malli}
            onChange={(e) => handleInputChange("malli", e.target.value)}
            margin="normal"
            size="small"
            className="inputTextField"
          />
        </FormControl>
      </Box>

      <Box className="inputBox">
        <FormControl>
          <Typography align="left" variant="body1">
            Valitse kunto
          </Typography>
          <Select
            labelId="condition-label"
            value={furnitureDetails.kunto}
            onChange={(e) => handleInputChange("kunto", e.target.value)}
            size="small"
            className="inputTextField"
          >
            <MenuItem value="" disabled>
              Valitse kunto
            </MenuItem>
            <MenuItem value="Erinomainen">Erinomainen</MenuItem>
            <MenuItem value="Hyvä">Hyvä</MenuItem>
            <MenuItem value="Kohtalainen">Kohtalainen</MenuItem>
            <MenuItem value="Huono">Huono</MenuItem>
            <MenuItem value="Tuntematon">Tuntematon</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box className="inputBox">
        <FormControl>
          <Typography align="left" variant="body1">
            Mitat (LxKxS)
          </Typography>
          <TextField
            name="pituus"
            placeholder="Pituus"
            value={furnitureDetails.mitat.pituus}
            onChange={(e) => handleMitatChange("pituus", e.target.value)}
            margin="normal"
            size="small"
            className="inputTextField"
          />
          <TextField
            name="korkeus"
            placeholder="Korkeus"
            value={furnitureDetails.mitat.korkeus}
            onChange={(e) => handleMitatChange("korkeus", e.target.value)}
            margin="normal"
            size="small"
            className="inputTextField"
          />
          <TextField
            name="leveys"
            placeholder="Leveys"
            value={furnitureDetails.mitat.leveys}
            onChange={(e) => handleMitatChange("leveys", e.target.value)}
            margin="normal"
            size="small"
            className="inputTextField"
          />
        </FormControl>
      </Box>

      <Box className="inputBox">
        <FormControl>
          <Typography align="left" variant="body1">
            Materiaalit
          </Typography>
          <TextField
            name="materials"
            value={furnitureDetails.materiaalit}
            onChange={(e) => handleInputChange("materiaalit", e.target.value)}
            margin="normal"
            size="small"
            className="inputTextField"
          />
        </FormControl>
      </Box>

      <Box className="inputBox">
        <FormControl>
          <Typography align="left" variant="body1">
            Väri
          </Typography>
          <TextField
            name="color"
            value={furnitureDetails.väri}
            onChange={(e) => handleInputChange("väri", e.target.value)}
            margin="normal"
            size="small"
            className="inputTextField"
          />
        </FormControl>
      </Box>

      <Box className="inputBox">
        <FormControl>
          <Typography align="left" variant="body1">
            Kuvaile vikoja
          </Typography>
          <TextField
            name="description"
            value={furnitureDetails.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            margin="normal"
            size="small"
            className="inputTextField"
          />
        </FormControl>
      </Box>

      <Button type="submit" variant="contained" className="submitRetryButton">
        Hyväksy
      </Button>
    </Box>
  );
}

export default FurniConfirmPage;
