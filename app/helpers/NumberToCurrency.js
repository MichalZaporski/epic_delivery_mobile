export default function numberToCurrency(price) {
  const priceFixed = Number(price).toFixed(2);
  return `${priceFixed} zł`;
}
