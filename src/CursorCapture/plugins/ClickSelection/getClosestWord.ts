export const getClosestWord = (str: string, pos: number) => {
// Search for the word's beginning and end.
const startIndex = str.slice(0, pos + 1).search(/(\S+| +)$/)
if (startIndex === -1) return null

const endSearch = str.slice(pos).search(/\s/);
const endIndex = endSearch + pos

// Get the word, using the located bounds to extract it from the string.
const word = endSearch < 0?
// The last word in the string is a special case.
str.slice(startIndex) : str.slice(startIndex, endIndex)

return { startIndex, endIndex, word };
}
