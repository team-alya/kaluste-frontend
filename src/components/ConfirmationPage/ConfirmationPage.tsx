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
import { useLocation } from "react-router-dom";

function FurniConfirmPage() {
  const location = useLocation();
  const {furnitureResult} = location.state || {furnitureResult: null};

  const [furnitureModel, setFurnitureModel] = useState(furnitureResult?.model || "");
  const [condition, setCondition] = useState(furnitureResult?.condition || "");
  const [measures, setMeasures] = useState(`${furnitureResult?.dimensions?.length}x${furnitureResult?.dimensions?.height}x${furnitureResult?.dimensions?.width}` || "");
  const [materials, setMaterials] = useState(furnitureResult?.type || "");
  const [color, setColor] = useState(furnitureResult?.color || "");
  const [description, setDescription] = useState("");

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form submission logic implementation here
    console.log({
      furnitureModel,
      condition,
      measures,
      materials,
      color,
      description,
    });
  };

  return (
    // Main Box for the page
    <Box className="mainBox" component="form" onSubmit={handleSubmit}>
      <Box className="headingBox">
        {/* Heading */}
        <Typography variant="h5">Tietojen tarkistus</Typography>
      </Box>

      <Box className="instructionBox">
        {/* Confirmation message with instructions. */}
        <Typography variant="body1">
          Kalusteen tunnistaminen onnistui.
          <br />
          Tarkista, korjaa ja hyväksy tiedot.
        </Typography>
      </Box>

      {/* First Input Box: Model */}
      <Box className="inputBox">
        <FormControl>
          {/* Model Title */}
          <Typography align="left" variant="body1">
            Kalusteen merkki/malli
          </Typography>
          {/* Model Input */}
          <TextField
            name="furnitureModel"
            value={furnitureModel}
            onChange={(e) => setFurnitureModel(e.target.value)}
            margin="normal"
            size="small"
            className="inputTextFiels"
          />
        </FormControl>
      </Box>

      {/* Second Input Box: Condition */}
      <Box className="inputBox">
        <FormControl>
          {/* Condition Title */}
          <Typography align="left" variant="body1">
            Valitse kunto
          </Typography>
          {/* Condition Selection */}
          <Select
            labelId="condition-label"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            size="small"
            className="inputTextFiels"
          >
            {/* Condition Label Text */}
            <MenuItem value="" disabled>
              Valitse kunto
            </MenuItem>
            {/* Condtion Selection Variations */}
            <MenuItem value="excellent">Erinomainen</MenuItem>
            <MenuItem value="good">Hyvä</MenuItem>
            <MenuItem value="fair">Kohtalainen</MenuItem>
            <MenuItem value="poor">Huono</MenuItem>
            <MenuItem value="unknown">Tuntematon</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Third Input Box: Measures */}
      <Box className="inputBox">
        <FormControl>
          {/* Measures Title */}
          <Typography align="left" variant="body1">
            Mitat (LxKxS)
          </Typography>
          {/* Measures Input */}
          <TextField
            name="measures"
            value={measures}
            onChange={(e) => setMeasures(e.target.value)}
            margin="normal"
            size="small"
            className="inputTextFiels"
          />
        </FormControl>
      </Box>

      {/* Fourth Input Box: Materials */}
      <Box className="inputBox">
        <FormControl>
          {/* Materials Title */}
          <Typography align="left" variant="body1">
            Materiaalit
          </Typography>
          {/* Materials Input */}
          <TextField
            name="materials"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            margin="normal"
            size="small"
            className="inputTextFiels"
          />
        </FormControl>
      </Box>

      {/* Fifth Input Box: Color */}
      <Box className="inputBox">
        <FormControl>
          {/* Color Title */}
          <Typography align="left" variant="body1">
            Väri
          </Typography>
          {/* Color Input */}
          <TextField
            name="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            margin="normal"
            size="small"
            className="inputTextFiels"
          />
        </FormControl>
      </Box>

      {/* Sixth Input Box: Description */}
      <Box className="inputBox">
        <FormControl>
          {/* Description Title */}
          <Typography align="left" variant="body1">
            Kuvaile vikoja
          </Typography>
          {/* Description Input */}
          <TextField
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            size="small"
            className="inputTextFiels"
          />
        </FormControl>
      </Box>

      {/* Submit Button Box */}
      <Box className="submitButtonBox">
        <Button type="submit" variant="contained" className="submitButton">
          Hyväksy
        </Button>
      </Box>
    </Box>
  );
}

export default FurniConfirmPage;
