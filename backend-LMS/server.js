require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware (to parse JSON and enable CORS)
app.use(cors());
app.use(express.json());

// Routes (API endpoints)
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/protected", require("./src/routes/protectedRoutes")); // Ensure this line is present


// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
