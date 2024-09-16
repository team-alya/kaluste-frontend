import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

function FurniConfirmPage() {
  const [furnitureModel, setFurnitureModel] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [measures, setMeasures] = useState<string>("");
  const [materials, setMaterials] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [description, setDescription] = useState<string>("");

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
    <Box component="form" onSubmit={handleSubmit}>
      <Box margin="30px">
        {/* Heading */}
        <Typography variant="h5">Tietojejn tarkistus</Typography>
      </Box>

      <Box margin="30px">
        {/* Confirmation message with instructions. */}
        <Typography variant="body1">
          Kalusteen tunnistaminen onnistui.
          <br />
          Tarkista, korjaa ja hyväksy tiedot.
        </Typography>
      </Box>

      {/* First Input Box: Model */}
      <Box>
        <FormControl>
          {/* Model Title */}
          <Typography align="left" variant="body1">
            Kalusteen merkki/malli
          </Typography>
          {/* Model Input */}
          <TextField
            name="furnitureModel"
            onChange={(e) => setFurnitureModel(e.target.value)}
            margin="normal"
            size="small"
            style={{ width: "300px" }}
          />
        </FormControl>
      </Box>

      {/* Second Input Box: Condition */}
      <Box margin="10px">
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
            style={{ width: "300px" }}
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
      <Box margin="10px">
        <FormControl>
          {/* Measures Title */}
          <Typography align="left" variant="body1">
            Mitat (LxKxS)
          </Typography>
          {/* Measures Input */}
          <TextField
            name="measures"
            onChange={(e) => setMeasures(e.target.value)}
            margin="normal"
            size="small"
            style={{ width: "300px" }}
          />
        </FormControl>
      </Box>

      {/* Fourth Input Box: Materials */}
      <Box margin="10px">
        <FormControl>
          {/* Materials Title */}
          <Typography align="left" variant="body1">
            Materiaalit
          </Typography>
          {/* Materials Input */}
          <TextField
            name="materials"
            onChange={(e) => setMaterials(e.target.value)}
            margin="normal"
            size="small"
            style={{ width: "300px" }}
          />
        </FormControl>
      </Box>

      {/* Fifth Input Box: Color */}
      <Box margin="10px">
        <FormControl>
          {/* Color Title */}
          <Typography align="left" variant="body1">
            Väri
          </Typography>
          {/* Color Input */}
          <TextField
            name="color"
            onChange={(e) => setColor(e.target.value)}
            margin="normal"
            size="small"
            style={{ width: "300px" }}
          />
        </FormControl>
      </Box>

      {/* Sixth Input Box: Description */}
      <Box margin="10px">
        <FormControl>
          {/* Description Title */}
          <Typography align="left" variant="body1">
            Kuvaile vikoja
          </Typography>
          {/* Description Input */}
          <TextField
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            size="small"
            style={{ width: "300px" }}
          />
        </FormControl>
      </Box>

      {/* Submit Button Box */}
      <Box margin="30px">
        <Button type="submit" variant="contained" style={{ width: "150px" }}>
          Hyväksy
        </Button>
      </Box>
    </Box>
  );
}

export default FurniConfirmPage;
