const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://lms-backend-38al.onrender.com/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const username = email.split('@')[0]; // Short, clean username
        const role = 'student'; // All OAuth users are "student"

        // Check if user already exists
        const existingUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

        let user = existingUser.rows[0];

        if (!user) {
            // If not found, create new user
            const newUser = await pool.query(`
                INSERT INTO users (name, email, username, password, role)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `, [name, email, username, '', role]);

            user = newUser.rows[0];

            // Insert into students table too
        }

        return done(null, user);
    } catch (err) {
        console.error("❌ Error in Google Strategy:", err);
        return done(err, null);
    }
}));

// Configure Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "https://lms-backend-38al.onrender.com/api/auth/facebook/callback",
    profileFields: ["id", "displayName", "emails"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`; // Fallback if no email
        const name = profile.displayName;
        const username = email.split('@')[0];
        const role = 'student';

        const existingUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

        let user = existingUser.rows[0];

        if (!user) {
            const newUser = await pool.query(`
                INSERT INTO users (name, email, username, password, role)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `, [name, email, username, '', role]);

            user = newUser.rows[0];

            
        }

        return done(null, user);
    } catch (err) {
        console.error("❌ Error in Facebook Strategy:", err);
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const res = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
        done(null, res.rows[0]);
    } catch (err) {
        done(err, null);
    }
});
