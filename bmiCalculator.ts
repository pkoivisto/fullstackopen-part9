import { parseArgsAsNumbers } from "./utils";

export const calculateBmi = (height: number, weight: number) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  // According to the tabulated basic categories of BMI at https://en.wikipedia.org/wiki/Body_mass_index
  // Note: rounding is applied to calculated BMI value, so the cutoff points
  // for categories differs slightly from the tabulated ones.
  if (bmi < 15.95) {
    return "Underweight (Severe thinness)";
  } else if (bmi < 16.95) {
    return "Underweight (Moderate thinness)";
  } else if (bmi < 18.45) {
    return "Underweight (Mild thinness)";
  } else if (bmi < 24.95) {
    return "Normal (healthy weight)";
  } else if (bmi < 29.95) {
    return "Overweight (Pre-obese)";
  } else if (bmi < 34.95) {
    return "Obese (Class I)";
  } else if (bmi < 39.95) {
    return "Obese (Class II)";
  } else {
    return "Obese (Class III)";
  }
};

try {
  const [height, weight] = parseArgsAsNumbers(process.argv, 2, 2);
  console.log(calculateBmi(height, weight));
} catch (e: unknown) {
  console.error(e);
}
