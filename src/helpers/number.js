export const toAlphabet = (number, lowerCase = false) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  while (number > 0) {
    const mod = (number - 1) % 26;
    result = alphabet[mod] + result;
    number = Math.floor((number - 1) / 26);
  }

  return lowerCase ? result.toLowerCase() : result;
};
