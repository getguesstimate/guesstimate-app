import { mutableCopy } from "gEngine/utils";

const DIGIT_REGEX = /^\d+$/;
const readableIdPartFromWord = (word) =>
  DIGIT_REGEX.test(word) ? word : word[0];
const DISALLOWED_WORDS = ["my", "your", "her", "their", "our", "his"];
const BAD_ENDING_WORDS = [
  "of",
  "in",
  "on",
  "per",
  "for",
  "and",
  "but",
  "or",
  "each",
];

function prepareName(rawName) {
  const name = rawName
    .trim()
    .toLowerCase()
    .replace(/[^\w\d]/g, " ");
  const firstNonDigit = name.search(/[^\d\s]/);
  if (firstNonDigit === -1) {
    return "";
  }
  return name.slice(firstNonDigit).trim().replace(/\s/g, "_");
}

function processWord(rawWord) {
  let word = mutableCopy(rawWord);
  if (word.length >= 9) {
    const strippedWord = word.replace(/a|e|i|o|u/g, "");
    if (strippedWord.length > 3) {
      word = strippedWord;
    }
  } else if (DISALLOWED_WORDS.includes(word)) {
    word = "";
  }
  return word;
}

function getDirectVariableNameFromName(
  rawName,
  maxOneWordLength,
  maxSplitWordLength,
  cutOffLength,
  makeAcronym
) {
  const name = prepareName(rawName);

  const words = name
    .split(/[\_]/)
    .map(processWord)
    .filter((s) => !_.isEmpty(s));

  if (words.length === 1 && name.length < maxOneWordLength) {
    return _.trimEnd(name, "_");
  } else if (words.length < maxSplitWordLength) {
    return _.trimEnd(name.slice(0, cutOffLength), "_");
  } else {
    if (makeAcronym) {
      return _.trimEnd(
        words.map(readableIdPartFromWord).slice(0, cutOffLength).join(""),
        "_"
      );
    } else {
      let numberOfWordsUsed = 0;
      let totalLength = 0;
      for (; numberOfWordsUsed < words.length; numberOfWordsUsed++) {
        totalLength += words[numberOfWordsUsed].length + 1; // One extra plus one for the underscores in between.
        if (totalLength >= cutOffLength) {
          break;
        }
      }

      for (; numberOfWordsUsed > 1; numberOfWordsUsed--) {
        const lastWord = words[numberOfWordsUsed];
        if (!BAD_ENDING_WORDS.includes(lastWord)) {
          break;
        }
      }

      return _.trimEnd(words.slice(0, numberOfWordsUsed + 1).join("_"), "_");
    }
  }
}

export function getVariableNameFromName(
  rawName,
  existingVariableNames = [],
  maxOneWordLength,
  maxSplitWordLength,
  totalMaxLength,
  allowUnderscores,
  makeAcronym
) {
  let directName = getDirectVariableNameFromName(
    rawName,
    maxOneWordLength,
    maxSplitWordLength,
    totalMaxLength,
    makeAcronym
  );
  if (!allowUnderscores) {
    directName = directName.replace(/\_/g, "");
  }

  const nameRegex = new RegExp(`${directName}(?:_?(\\d+))?$`, "i");

  const matchingNames = existingVariableNames.filter((v) => nameRegex.test(v));
  if (_.isEmpty(matchingNames)) {
    return directName;
  }

  const suffixes = matchingNames.map((v) =>
    parseInt(v.match(nameRegex)[1] || "0")
  );
  if (!suffixes.includes(0)) {
    return directName;
  }

  const currentMaxSuffix = Math.max(...suffixes);
  return `${directName}${allowUnderscores ? "_" : ""}${currentMaxSuffix + 1}`;
}

export const shouldTransformName = (name) =>
  !(_.isEmpty(name) || _.isEmpty(name.replace(/[^a-zA-Z]/g, "").trim()));
