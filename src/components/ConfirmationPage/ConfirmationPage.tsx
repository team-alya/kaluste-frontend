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
  const { furnitureResult, imageBlob } = location.state || {
    furnitureResult: null,
    imageBlob: null,
  };

  // Initialize furnitureDetails state object
  const [furnitureDetails, setFurnitureDetails] = useState({
    requestId: furnitureResult?.requestId || "",
    merkki: furnitureResult?.merkki || "",
    malli: furnitureResult?.malli || "",
    väri: furnitureResult?.väri || "",
    mitat: {
      pituus: furnitureResult?.mitat?.pituus || "",
      korkeus: furnitureResult?.mitat?.korkeus || "",
      leveys: furnitureResult?.mitat?.leveys || "",
    },
    materiaalit: furnitureResult?.materiaalit?.join(", ") || "",
    kunto: furnitureResult?.kunto || "",
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
      // Create furnitureDetails payload in the expected format
      const furnitureDetailsPayload = {
        requestId: furnitureDetails.requestId,
        merkki: furnitureDetails.merkki,
        malli: furnitureDetails.malli,
        väri: furnitureDetails.väri,
        mitat: {
          pituus: Number(furnitureDetails.mitat.pituus),
          leveys: Number(furnitureDetails.mitat.leveys),
          korkeus: Number(furnitureDetails.mitat.korkeus),
        },
        materiaalit: furnitureDetails.materiaalit
          .split(",")
          .map((material) => material.trim()),
        kunto: furnitureDetails.kunto,
      };

      // Make POST request with JSON body
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const priceResponse = await fetch(`${apiUrl}/api/price`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ furnitureDetails: furnitureDetailsPayload }),
      });

      if (priceResponse.ok) {
        const priceData = await priceResponse.json();
        console.log("Price analysis:", priceData);
        navigate("/chatbotpage", {
          state: { furnitureResult, priceAnalysis: priceData },
        });
      } else {
        console.error(
          "Failed to fetch price analysis. Status:",
          priceResponse.status
        );
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
            className="inputTextFiels"
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
            className="inputTextFiels"
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
            className="inputTextFiels"
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
            className="inputTextFiels"
          />
          <TextField
            name="korkeus"
            placeholder="Korkeus"
            value={furnitureDetails.mitat.korkeus}
            onChange={(e) => handleMitatChange("korkeus", e.target.value)}
            margin="normal"
            size="small"
            className="inputTextFiels"
          />
          <TextField
            name="leveys"
            placeholder="Leveys"
            value={furnitureDetails.mitat.leveys}
            onChange={(e) => handleMitatChange("leveys", e.target.value)}
            margin="normal"
            size="small"
            className="inputTextFiels"
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
            className="inputTextFiels"
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
            className="inputTextFiels"
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
            className="inputTextFiels"
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
