import express from "express";
import cors from "cors";
import { getDiagnoses } from "./services/diagnoses";
import {
  getPatient,
  getPatients,
  createPatient,
  createPatientEntry,
} from "./services/patients";

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

app.get("/api/patient/:id", (req, res) => {
  const { id } = req.params;
  const patient = getPatient(id);
  if (patient) {
    res.send(patient);
  } else {
    res.status(404);
  }
});

app.post("/api/patients", (req, res) => {
  const patient = createPatient(req.body);

  res.status(201).send(patient);
});

app.post("/api/patients/:id/entries", (req, res) => {
  const { id } = req.params;
  const patient = getPatient(id);
  if (patient) {
    const patientWithEntry = createPatientEntry(patient, req.body);
    res.send(patientWithEntry);
  } else {
    res.status(404);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
