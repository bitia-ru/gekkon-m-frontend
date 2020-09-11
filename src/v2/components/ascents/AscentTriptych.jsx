import React from 'react';
import * as R from 'ramda';
import AscentTriptychLayout from './AscentTriptychLayout/AscentTriptychLayout';


class AscentTriptych extends React.PureComponent {
  constructor(props) {
    super(props);

    const { initialWithFlash } = this.props;

    this.state = {
      newAscents: [],
      withFlash: initialWithFlash,
      currentResult: initialWithFlash ? null : 'success',
      ascentCounts: {
        success: 0,
        attempt: 0,
      },
    };
  }

  componentWillUnmount() {
    if (this.timeout) {
      this?.props?.onAddAscents(this.state.newAscents);
      clearTimeout(this.timeout);
    }
  }

  onAscentButtonClicked = (rawResult) => {
    const { onAddAscents, initialWithFlash, instantMode } = this.props;
    const { withFlash, ascentCounts } = this.state;
    let { newAscents } = this.state;

    const resultType = {
      flash: 'success',
      success: 'success',
      attempt: 'attempt',
      red_point: 'success',
      ascentSerieComposingIsInProgress: false,
    }[rawResult];
    let result;
    if (instantMode) {
      result = resultType;
    } else {
      result = {
        flash: 'flash',
        attempt: 'unsuccessful',
        red_point: 'red_point',
        success: 'red_point',
        ascentSerieComposingIsInProgress: false,
      }[rawResult];
    }

    if (withFlash) {
      this.setState({ withFlash: false });
    }

    const lastAscent = newAscents.length > 0 ? newAscents[newAscents.length - 1] : null;

    if (lastAscent && lastAscent.result === result) {
      newAscents = [
        ...R.slice(0, -1)(newAscents),
        {
          ...lastAscent,
          count: lastAscent.count + 1,
        },
      ];
    } else {
      newAscents = [
        ...newAscents,
        {
          result,
          count: 1,
        },
      ];
    }

    this.setState({
      newAscents,
      ascentCounts: {
        ...ascentCounts,
        [resultType]: ascentCounts[resultType] + 1,
      },
    });

    const restartComposing = () => {
      this.setState(
        {
          ascentSerieComposingIsInProgress: true,
        },
        () => {
          this.timeout = setTimeout(
            () => {
              this.timeout = null;
              onAddAscents && onAddAscents(
                this.state.newAscents,
                () => {
                  this.setState({
                    newAscents: [],
                    withFlash: initialWithFlash,
                    ascentSerieComposingIsInProgress: false,
                    ascentCounts: {
                      success: 0,
                      attempt: 0,
                    },
                  });
                },
              );
            },
            instantMode ? 0 : 1500,
          );
        },
      );
    };

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.setState(
        {
          ascentSerieComposingIsInProgress: false,
        },
        () => {
          setTimeout(restartComposing, 0);
        },
      );
    } else {
      restartComposing();
    }
  };

  render() {
    const { withFlash, ascentSerieComposingIsInProgress, ascentCounts } = this.state;

    return (
      <AscentTriptychLayout
        loading={{ active: ascentSerieComposingIsInProgress }}
        ascentCounts={ascentCounts}
        withFlash={withFlash}
        onClick={this.onAscentButtonClicked}
      />
    );
  }
}


export default AscentTriptych;
