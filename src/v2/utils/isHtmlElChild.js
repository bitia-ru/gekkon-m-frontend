import * as R from 'ramda';

const isHtmlElChild = (child, parent) => (
  R.contains(child, parent.getElementsByTagName('*'))
);

export default isHtmlElChild;
