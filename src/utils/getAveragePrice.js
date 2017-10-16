export default (previousPrice, previousAmount, nextPrice, nextAmount) => {
  const calculateValue = (price, amount) => price * amount;
  const previousValue = calculateValue(previousPrice, previousAmount);
  const nextValue = calculateValue(nextPrice, nextAmount);
  const averageValue =
  ((previousValue * previousAmount) + (nextValue, nextAmount)) / (previousAmount + nextAmount);
  return averageValue;
};
