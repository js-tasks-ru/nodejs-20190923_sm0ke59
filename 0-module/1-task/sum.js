function sum(a, b) {
   return isNumber(a) && isNumber(b)
  ? sumAB(a, b)
  : throwError()
}

const isNumber = (n) => typeof n === 'number' && !isNaN(n) && isFinite(n)
const sumAB = (a, b) => a + b
const throwError = () => { throw new TypeError() }

module.exports = sum;
