/**
 * 
 * @param {Number} num
 * @returns {String}
 */
export function fixedNum(num, len = 4) {
    return (+num).toFixed(len || 3)
}