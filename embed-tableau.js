import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3001;
import { configDotenv } from 'dotenv';
configDotenv();
const { CLIENT_ID, CLIENT_SECRET, USER, SITE } = process.env

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: '*',
  methods: 'GET,POST',
  credentials: true,
}));
/**
 * Generates JWT for authenticating tableau dashboard
 * By doing so, we can avoid explicit signon before viewing dashboard
 */
app.get('/api/token', (_, res) => {
  const secretKey = "hQwAWB6RDvLb0uIRLEBUpYCSX5BWGoAau4RMqI6yfk0=";

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const payload = {
    jti: Date.now().toString(),
    iss: "f6f8bb31-1a84-4541-be18-10d6e9529ba9",
    aud: "tableau",
    sub: "btimberlake@jmxi.io",
    scp: ["tableau:views:embed", "tableau:metrics:embed"],
    exp: currentTimestamp + 300
  };

  const token = jwt.sign(payload, secretKey, {
    algorithm: "HS256",
    header: {
      typ: 'JWT',
      kid: "d4f8883c-85ca-49c8-b143-264173edfadc"
    }
  });

  res.send({ token });
});


// Add this line just before app.listen()
app.get('/dashboard', (_, res) => {
  res.sendFile(path.join(__dirname, 'embed-tableau-dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`Embedded tableau dashboard app running at http://localhost:${PORT}`);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
