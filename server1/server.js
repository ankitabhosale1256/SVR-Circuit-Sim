import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { connectDB, getDB } from './db.js';

const app = express();
app.use(cors({ origin: 'http://localhost:5501', credentials: true }));
app.use(bodyParser.json());
app.use(express.json());

connectDB().then(() => {
  const db = getDB();
  const collection = db.collection("circuitsim");

  app.get("/data", async (req, res) => {
    try {
      const data = await collection.find({}).toArray();
      res.json(data);
    } catch (err) {
      res.status(500).send("Error fetching data");
    }
  });

  app.post("/data", async (req, res) => {
    try {
      const result = await collection.insertOne(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).send("Error inserting data");
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    const { name, surname, age, mobile, email, password } = req.body;

    try {
      const existingUser = await collection.findOne({ email });
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
        createdAt: new Date()
      };

      await collection.insertOne(newUser);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await collection.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      res.status(200).json({
        message: 'Login successful',
        name: user.name,
        age: user.age
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/user/:email', async (req, res) => {
    try {
      const user = await collection.findOne({ email: req.params.email });
      if (!user) return res.status(404).json({ error: 'User not found' });

      res.json({
        name: user.name,
        age: user.age,
        email: user.email,
        mobile: user.mobile
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// ✅ Add this at the end of server.js
app.listen(3000, () => {
  console.log("✅ Server is listening on port 3000");
});
