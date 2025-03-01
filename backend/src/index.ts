import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Determine frontend URL based on environment
const FRONTEND_URL = process.env.NODE_ENV === 'production' 
  ? process.env.FRONTEND_URL_PROD 
  : process.env.FRONTEND_URL_DEV;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL_DEV || 'http://localhost:3000',
    process.env.FRONTEND_URL_PROD || 'https://splendid-platypus-db110e.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  proxy: process.env.NODE_ENV === 'production' // Trust proxy in production
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  done(null, user);
});

// Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CLIENT_ID!,
    consumerSecret: process.env.TWITTER_CLIENT_SECRET!,
    callbackURL: process.env.TWITTER_CALLBACK_URL,
    includeEmail: true
  },
  async (token: string, tokenSecret: string, profile: any, done: any) => {
    try {
      // Here you would typically:
      // 1. Check if user exists in your database
      // 2. Create new user if they don't exist
      // 3. Update user's access token
      
      const user = {
        id: profile.id,
        name: profile.displayName,
        username: profile.username,
        token,
        tokenSecret
      };
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'healthy' });
});

// Auth Routes
app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { 
    failureRedirect: `${FRONTEND_URL}/login` 
  }),
  (req: express.Request, res: express.Response) => {
    res.redirect(`${FRONTEND_URL}/dashboard`);
  }
);

// Check auth status
app.get('/api/auth/status', (req: express.Request, res: express.Response) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Logout route
app.post('/api/auth/logout', (req: express.Request, res: express.Response) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 