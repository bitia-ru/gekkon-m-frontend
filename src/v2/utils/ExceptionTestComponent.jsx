import React from 'react';


class ExceptionTestComponent extends React.Component {
  componentDidMount() {
    throw new Error('Exception');
  }

  render() {
    return <></>;
  }
}

export default ExceptionTestComponent;
