require("dotenv").config();
const passport = require("passport");
const express = require("express");
const cors = require("cors");
require("./src/middlewares/authOAuth"); // Import OAuth Strategies


const app = express();

// Middleware (to parse JSON and enable CORS)
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));



// Routes (API endpoints)
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/protected", require("./src/routes/protectedRoutes")); // Ensure this line is present


// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
