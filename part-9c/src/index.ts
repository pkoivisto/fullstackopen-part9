import express from "express";
import cors from "cors";
import { getDiagnoses } from "./services/diagnoses";
import { getPatients } from "./services/patients";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

app.get("/api/ping", (_, res) => {
  res.send("pong");
});

app.get("/api/diagnoses", (_, res) => {
  res.send(getDiagnoses());
});

app.get("/api/patients", (_, res) => {
  res.send(getPatients());
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
