import express from "express";
import { calculateBmi } from "./bmiCalculator";

const app = express();

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
    res
      .status(200)
      .send({
        weight: parsedWeight,
        height: parsedHeight,
        bmi: calculateBmi(parsedHeight, parsedWeight),
      });
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});