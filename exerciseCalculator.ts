import { parseArgsAsNumbers } from './utils';

type Rating = 1 | 2 | 3;

const rateResult = (average: number, target: number): Rating => {
  if (average < 0.7 * target) {
    return 1;
  } else if (average < 1.3 * target) {
    return 2;
  } else {
    return 3;
  }
};

const describeRating = (rating: Rating) => {
  switch (rating) {
    case 1:
      return "Try harder!";
    case 2:
      return "A solid one!";
    case 3:
      return "Good job!";
  }
};

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (hourCounts: Array<number>, target: number): Result => {
  const sum = hourCounts.reduce((acc, val) => acc + val, 0);
  const periodLength = hourCounts.length;
  const trainingDays = hourCounts.filter((hours) => hours > 0).length;
  const average = periodLength > 0 ? sum / periodLength : 0;
  const rating = rateResult(average, target);

  return {
    periodLength,
    trainingDays,
    success: average < target ? false : true,
    rating,
    ratingDescription: describeRating(rating),
    target,
    average
  };
};

try {
  const [target, ...hours] = parseArgsAsNumbers(process.argv, 2);
  console.log(calculateExercises(hours, target));
} catch (e: unknown) {
  console.error(e);
}
