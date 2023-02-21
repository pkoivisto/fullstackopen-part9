export const parseArgsAsNumbers = (
  args: Array<string>,
  minArgsCount?: number,
  maxArgsCount?: number
) => {
  // Expected args to correspond to process.argv, and thus args[0] and args[1] 
  // are ignored.
  const argsCount = args.length - 2;
  if (minArgsCount && argsCount < minArgsCount) {
    throw new Error("Expected at least " + minArgsCount + " arguments, yet was given " + argsCount);
  } else if (maxArgsCount && argsCount > maxArgsCount) {
    throw new Error("Expected at most " + maxArgsCount + " arguments, yet was given " + argsCount);
  }

  const nums = args.slice(2).map((val) => Number(val));

  if (nums.some((num) => isNaN(num))) {
    throw new Error("Provided values were not all numbers!");
  }

  return nums;
};
