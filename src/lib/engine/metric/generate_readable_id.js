//generateReadableId creates a readableId from the name of a metric.
//It takes a param, otherNames, to ensure that there are no duplicates

export function generateReadableId(name, existing=[]) {
  const attempt = readableIdAttempt(name)
  if (!isDuplicate(attempt, existing)) {
    return attempt
  } else {
    let i = 1
    while (isDuplicate(`${attempt}${i}`, existing)){
      i += 1
    }
    return `${attempt}${i}`
  }
}

const useFirstChars = (s) => (s.split(' ').length > 2)
const limitAndFormat = (s) => s.slice(0, 4).toUpperCase()
const firstCharsOfWords = (s) => s.split(' ').map(e => e[0]).join('')

const readableIdAttempt = (name) => {
  return limitAndFormat( useFirstChars(name) ? firstCharsOfWords(name) : name)
}

const isDuplicate = (item, list) => (list.indexOf(item) !== -1)
