//generateReadableId creates a readableId from the name of a metric.
//It takes a param, otherNames, to ensure that there are no duplicates

export default function generateRandomReadableId(existing=[]) {
  let attempt = readableIdAttempt(name)
  if (!isDuplicate(attempt, existing)) {
    return attempt
  } else {
    while (isDuplicate(attempt, existing)){
      attempt = readableIdAttempt(name)
    }
    return attempt
  }
}

const useFirstChars = (s) => (s.split(' ').length > 2)
const limitAndFormat = (s) => s.slice(0, 4).toUpperCase()
const firstCharsOfWords = (s) => s.split(' ').map(e => e[0]).join('')

const readableIdAttempt = (name) => {
  return `${randomString(2)}`
}

const isDuplicate = (item, list) => (list.indexOf(item) !== -1)


const randomString = (len) => {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomString = '';
    for (let i = 0; i < len; i++) {
    	const randomPoz = Math.floor(Math.random() * charSet.length);
    	randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}
