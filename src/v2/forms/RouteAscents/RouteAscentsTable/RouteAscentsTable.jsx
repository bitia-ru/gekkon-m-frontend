import React from 'react';
import * as R from 'ramda';
import RouteAscentsTableLayout from './RouteAscentsTableLayout';


class RouteAscentsTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dateChangingAscentId: null,
    };
  }

  ascentsForLayout = () => {
    const { ascents, mergeLastRow } = this.props;
    const res = [];
    R.forEach(
      (ascent) => {
        const fields = ['success', 'accomplished_at'];
        if (res.length > 0 && R.equals(R.pick(fields, R.last(res)), R.pick(fields, ascent))) {
          res[res.length - 1].count += 1;
          res[res.length - 1].id = ascent.id;
        } else {
          res.push(
            {
              ...ascent,
              count: 1,
              id: ascent.id,
            },
          );
        }
      },
      ascents,
    );

    const last = R.last(res);
    if (!mergeLastRow && last.count > 1) {
      return R.concat(
        R.slice(0, -1, res),
        [
          {
            ...last,
            count: last.count - 1,
            id: ascents[ascents.length - 2].id,
          },
          {
            ...last,
            count: 1,
          },
        ],
      );
    }
    return res;
  };

  render() {
    const { onRemoveAscent, onAscentDateChanged } = this.props;

    return (
      <RouteAscentsTableLayout
        onRemoveClicked={(ascentId) => { onRemoveAscent && onRemoveAscent(ascentId); }}
        onDateClicked={(ascentId) => { this.setState({ dateChangingAscentId: ascentId }); }}
        onDateSelected={
          (ascentId, newDate) => {
            onAscentDateChanged && onAscentDateChanged(ascentId, newDate);
            this.setState({ dateChangingAscentId: null });
          }
        }
        ascents={this.ascentsForLayout()}
        dateChangingAscentId={this.state.dateChangingAscentId}
      />
    );
  }
}

export default RouteAscentsTable;
