export default function numberToCurrency(price) {
  price = Number(price).toFixed(2);
  return `${price} zł`;
}
