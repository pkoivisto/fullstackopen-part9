import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();

app.use(express.json());

app.get("/hello", (_, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { weight, height } = req.query;
  const parsedWeight = Number(weight);
  const parsedHeight = Number(height);
  if (isNaN(parsedWeight) || isNaN(parsedHeight)) {
    res.status(400).send({ error: "malformatted parameters" });
  } else {
    res.status(200).send({
      weight: parsedWeight,
      height: parsedHeight,
      bmi: calculateBmi(parsedHeight, parsedWeight),
    });
  }
});

app.post("/exercises", (req, res) => {
  if (
    !req.body.hasOwnProperty("daily_exercises") ||
    !req.body.hasOwnProperty("target")
  ) {
    res.status(400).send({ error: "parameters missing" });
  } else {
    const { daily_exercises, target } = req.body;
    if (isNaN(target)) {
      res.status(400).send({ error: "malformatted parameters" });
    } else if (
      !Array.isArray(daily_exercises) ||
      daily_exercises.some((v) => isNaN(v))
    ) {
      res.status(400).send({ error: "malformatted parameters" });
    } else {
      res.status(200).send(calculateExercises(daily_exercises, target));
    }
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
