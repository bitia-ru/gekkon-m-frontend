import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import News from '../News/News';
import { DEFAULT_SHOWN } from '../Constants/News';
import './NewsBlock.css';

export default class NewsBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAll: false,
    };
  }

  render() {
    const { data } = this.props;
    const { showAll } = this.state;
    return (
      <div className="section-news-m">
        <div className="section-news-m__container">
          <div className="section-news-m__container-inner">
            <div className="news-card-m__col-xs-12 news-card-m__col-sm-6">
              <h1 className="section-news-m__header">Лента новостей</h1>
              {
                R.map(
                  news => <News key={news.id} data={news} />,
                  showAll ? data : R.slice(0, DEFAULT_SHOWN, data),
                )
              }
              {
                !showAll && <button
                  type="button"
                  onClick={() => this.setState({ showAll: true })}
                  className="btn-m"
                >
                  Все новости
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewsBlock.propTypes = {
  data: PropTypes.array.isRequired,
};
