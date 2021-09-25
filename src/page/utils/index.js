/**
 * 固定数字长度
 * @param {Number} num
 * @returns {String}
 */
// eslint-disable-next-line import/prefer-default-export
export function fixedNum(num, len = 4) {
  return (+num).toFixed(len || 3);
}
