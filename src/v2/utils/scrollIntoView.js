const easeInOutQuad = (time, startPos, endPos, duration) => {
  time /= duration / 2;
  if (time < 1) return (endPos / 2) * time * time + startPos;
  time--;
  return (-endPos / 2) * (time * (time - 2) - 1) + startPos;
};

const scrollTo = (element, to, duration) => {
  const start = element.scrollTop;
  let currentTime = 0;
  const increment = 20;

  const animateScroll = () => {
    currentTime += increment;

    const val = easeInOutQuad(currentTime, start, to, duration);
    element.scrollTop = val;

    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };

  animateScroll();
};

const scrollIntoView = (parent, child) => {
  const parentBounding = parent.getBoundingClientRect();
  const clientBounding = child.getBoundingClientRect();

  const parentBottom = parentBounding.bottom;
  const parentTop = parentBounding.top;
  const clientBottom = clientBounding.bottom;
  const clientTop = clientBounding.top;

  if (parentTop >= clientTop) {
    scrollTo(parent, -(parentTop - clientTop), 300);
  } else if (clientBottom > parentBottom) {
    scrollTo(parent, clientBottom - parentBottom, 300);
  }
};

export default scrollIntoView;
