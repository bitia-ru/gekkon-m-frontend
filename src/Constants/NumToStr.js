const numToStr = (n, textForms) => {
  const remnant100 = Math.abs(n) % 100;
  const remnant10 = n % 10;
  if (remnant100 > 10 && remnant100 < 20) { return textForms[2]; }
  if (remnant10 > 1 && remnant10 < 5) { return textForms[1]; }
  if (remnant10 === 1) { return textForms[0]; }
  return textForms[2];
};
export { numToStr as default };
