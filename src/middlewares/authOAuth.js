const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const jwt = require("jsonwebtoken");

// Temporary storage for OAuth users
const users = [];

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    let user = users.find(u => u.id === profile.id);
    if (!user) {
        user = { id: profile.id, name: profile.displayName, provider: "google" };
        users.push(user);
    }
    return done(null, user);
}));

// Configure Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ["id", "displayName", "emails"]
}, (accessToken, refreshToken, profile, done) => {
    let user = users.find(u => u.id === profile.id);
    if (!user) {
        user = { id: profile.id, name: profile.displayName, provider: "facebook" };
        users.push(user);
    }
    return done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});
