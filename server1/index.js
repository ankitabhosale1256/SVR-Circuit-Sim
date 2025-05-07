import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv'; // ✅ only once
import client from './db.js';
import { ObjectId } from 'mongodb';


dotenv.config(); // ✅ only once
console.log('✅ GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID); // debug check


const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connect
client.connect().then(() => {
  const db = client.db('login');
  console.log('Connected to MongoDB ✅');

  // Passport Google Strategy
  passport.use(new GoogleStrategy({
    clientID: "737917099179-frhf167a1mamsj7cvqe636v1knetassk.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    const name = profile.displayName;
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = {
      name,
      email,
      googleId: profile.id,
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);
    return done(null, newUser);
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await db.collection('users').findOne({ _id: new client.bson.ObjectId(id) });

    done(null, user);
  });

  // 👇 ROUTES

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  // Register
  app.post('/api/auth/register', async (req, res) => {
    const { name, surname, age, mobile, email, password } = req.body;
    try {
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        name,
        surname,
        age: parseInt(age),
        mobile,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      };

      await db.collection('users').insertOne(newUser);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Login
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await db.collection('users').findOne({ email });
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Save data
  app.post('/api/save', async (req, res) => {
    const data = req.body;
    try {
      const result = await db.collection('list').insertOne(data);
      res.status(201).json({ message: 'Data saved successfully', data });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // 🔐 Google OAuth Routes
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
    (req, res) => {
      const user = req.user;
      const query = encodeURIComponent(JSON.stringify(user));
      res.redirect(`http://localhost:5173/dashboard?user=${query}`);
    });

  // Start Server
  app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
  });

}).catch(err => {
  console.error('❌ MongoDB connection failed:', err);
});