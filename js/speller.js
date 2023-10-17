export default {
  check,
  lookup,
};

var elements;
let symbols = {};

await loadPeriodicTable();

// ****************************

async function loadPeriodicTable() {
  elements = await (await fetch("periodic-table.json")).json();
  for (let element of elements) {
    symbols[element.symbol.toLowerCase()] = element;
  }
}

function findCandidates(inputWord) {
  // we are using arrays not sets because sets are not ordered and they are expensive to
  var oneLetterCandidates = [];
  var twoLetterCandidates = [];

  for (let i = 0; i < inputWord.length; i++) {
    if (
      inputWord[i] in symbols &&
      !oneLetterCandidates.includes(inputWord[i])
    ) {
      oneLetterCandidates.push(inputWord[i]);
    }

    if (i <= inputWord.length - 2) {
      // it does not count the last part
      var two = inputWord.slice(i, i + 2);

      if (two in symbols && !twoLetterCandidates.includes(two)) {
        twoLetterCandidates.push(two);
      }
    }
  }

  return [...twoLetterCandidates, ...oneLetterCandidates];
}

function check(inputWord) {
  // TODO: determine if `inputWord` can be spelled
  // with periodic table symbols; return array with
  // them if so (empty array otherwise)

  var candidates = findCandidates(inputWord);

  console.log(candidates);

  return spellWord(candidates, inputWord);
}

function spellWord(candidates, charsLeft) {
  //   for (let candidate of candidates) {
  //     if (candidate.length <= inputWord.length) {
  //       // we have a match
  //       if (inputWord.slice(0, candidate.length) === candidate) {
  //         // if there is more words in input word
  //         if (inputWord.length > candidate.length) {
  //           let res = spellWord(candidates, inputWord.slice(candidate.length));

  //           // if more results are found
  //           if (res.length > 0) {
  //             return [candidate, ...res];
  //           }
  //         } else {
  //           return [candidate];
  //         }
  //       }
  //     }
  //   }

  //   return [];

  if (charsLeft.length === 0) {
    return [];
  } else {
    // check for two letters
    if (charsLeft.length >= 2) {
      let two = charsLeft.slice(0, 2);
      let rest = charsLeft.slice(2);

      if (candidates.includes(two)) {
        if (rest.length > 0) {
          let result = [two, ...spellWord(candidates, rest)];

          if (result.join("") === charsLeft) {
            return result;
          }
        } else {
          return [two];
        }
      }
    }

    if (charsLeft.length >= 1) {
      let one = charsLeft.slice(0, 1);
      let rest = charsLeft.slice(1);

      if (candidates.includes(one)) {
        if (rest.length > 0) {
          let result = [one, ...spellWord(candidates, rest)];

          if (result.join("") === charsLeft) {
            return result;
          }
        } else {
          return [one];
        }
      }
    }

    return [];
  }
}

function lookup(elementSymbol) {
  // TODO: return the element entry based on specified
  // symbol (case-insensitive)

  return symbols[elementSymbol];
}
