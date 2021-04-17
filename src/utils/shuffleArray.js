function shuffleArray(array) {
  let shuffledArray = array;

  if (array.length > 1) {
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledArray[i];
      shuffledArray[i] = shuffledArray[j];
      shuffledArray[j] = temp;
    }

    return shuffledArray;
  }

  return shuffledArray;
}

export default shuffleArray;
