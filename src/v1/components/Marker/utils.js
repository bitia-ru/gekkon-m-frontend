export const getPointerType = (editable, index, marker) => {
  if (editable) { return ([0,1].includes(index) ? 'start' : 'regular'); }
  return 'regular';
};
