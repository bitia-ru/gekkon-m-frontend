import React from 'react';
import SpotIconLayout from '@/v3/components/spots/SpotIcon/SpotIconLayout';


class SpotIcon extends React.PureComponent {
  render() {
    const { spot } = this.props;

    return (
      <SpotIconLayout spot={spot} />
    );
  }
}

export default SpotIcon;
