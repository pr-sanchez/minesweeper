function randomBoolean(probability) {
  const difficulty = probability / 10;

  return Math.random() < difficulty;
}
export default randomBoolean;
