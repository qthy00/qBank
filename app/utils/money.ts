/**
 * 将分转成元
 *
 * @param price 分，例如说 100 分
 * @returns {string} 元，例如说 1.00 元
 */
export function fen2yuan(price?: number) {
  if(!price) return '0.00'
  return (price / 100.0).toFixed(2)
}
