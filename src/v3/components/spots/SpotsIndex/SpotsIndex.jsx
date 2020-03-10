import React from 'react';
import { connect } from 'react-redux';
import SpotsIndexLayout from '@/v3/components/spots/SpotsIndex/SpotsIndexLayout';
import { loadSpots as loadSpotsAction } from '@/v3/redux/spots/actions';


class SpotsIndex extends React.PureComponent {
  componentDidMount() {
    this.props.loadSpots();
  }

  render() {
    const { spots } = this.props;

    return (
      spots && (
        <SpotsIndexLayout spots={spots} />
      )
    );
  }
}

const mapStateToProps = state => ({
  spots: state.spotsStoreV3,
});

const mapDispatchToProps = dispatch => ({
  loadSpots: () => dispatch(loadSpotsAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpotsIndex);
