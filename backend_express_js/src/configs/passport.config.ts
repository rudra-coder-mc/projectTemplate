import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.models'; // assuming you have a user model
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      callbackURL: 'http://localhost:8000/api/v1/users/google/callback', // Your callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (profile.emails && profile.emails.length > 0) {
          // Look for an existing user in your database

          const existingUser = await User.findOne({
            googleId: profile.id,
          });

          if (existingUser) {
            // If user exists, log them in
            return done(null, existingUser);
          }

          // If user doesn't exist, create a new user
          const newUser = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos ? profile.photos[0].value : '',
            role: 'user', // Set default role or allow via Google profile
          });

          await newUser.save();
          return done(null, newUser);
        } else {
          // Handle the case where profile.emails is undefined or empty
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Serialize and deserialize the user
passport.serializeUser((user, done) => {
  console.log('serializeUser', user);

  done(null, (user as { _id: string })._id);
});

passport.deserializeUser(async (id, done) => {
  console.log('deserializeUser', id);

  try {
    const user = await User.findById(id).select('-password -refreshToken');
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
