import otpGenerator from 'otp-generator';

const orderIdGenerate = (title, orderId) => {
  "ORD-200901'lastOrderId+1'"
  const randomAlphabet = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  const date = new Date();
  const year = date.toLocaleString('en', { year: '2-digit' });
  const month = date.getMonth();
  const day = date.getDate();
  const dateString = `${year}${month}${day}`;
  const orderId = `${title}${dateString}${randomAlphabet}`;
  return orderId;
};
orderIdGenerate();
export default orderIdGenerate;
