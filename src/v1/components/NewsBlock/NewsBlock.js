import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import News from '../News/News';
import { DEFAULT_DAYS_SHOWN, DAYS_STEP } from '../../Constants/News';
import './NewsBlock.css';
import { loadNews } from '@/v1/stores/news/utils';

class NewsBlock extends Component {
  constructor(props) {
    super(props);

    const dateTo = dayjs();
    const dateFrom = R.clone(dateTo).add(1 - DEFAULT_DAYS_SHOWN, 'day');
    this.state = {
      showAll: false,
      dateFrom,
      dateTo,
    };
  }

  componentDidMount() {
    const { dateFrom, dateTo } = this.state;
    this.loadNews(dateFrom, dateTo);
  }

  loadMoreNews = () => {
    const { dateFrom } = this.state;
    const dateFromNew = R.clone(dateFrom).add(-DAYS_STEP, 'day');
    const dateToNew = R.clone(dateFrom).add(-1, 'day');
    this.setState({ dateFrom: dateFromNew });
    this.loadNews(dateFromNew, dateToNew);
  };

  loadNews = (dateFrom, dateTo) => {
    const { loadNews: loadNewsProp } = this.props;
    const params = {
      group_by: 'day',
      filters: {
        date: [
          [dateFrom.startOf('day').format()],
          [dateTo.endOf('day').format()],
        ],
      },
    };
    loadNewsProp(params);
  };

  filteredNews = (dateFrom, dateTo) => {
    const { news: newsProp } = this.props;
    const filteredNews = R.pick(
      R.filter(
        (dateStr) => {
          const [day, month, year] = dateStr.split('.');
          const date = dayjs(`${year}-${month}-${day}`);
          return dateFrom.isBefore(date) && date.isBefore(dateTo);
        },
        R.keys(newsProp),
      ),
      newsProp,
    );
    return R.flatten(R.values(filteredNews));
  };

  showMoreNewsButton = () => {
    const { dateFrom } = this.state;
    const dateTo = R.clone(dateFrom).add(DAYS_STEP - 1, 'day');
    return this.filteredNews(dateFrom, dateTo).length > 0;
  };

  render() {
    const mapIndexed = R.addIndex(R.map);
    const { dateFrom, dateTo } = this.state;
    const filteredNews = this.filteredNews(dateFrom, dateTo);
    return (
      <>
        {
          filteredNews.length > 0 && <div className="section-news-m">
            <div className="section-news-m__container">
              <div className="section-news-m__container-inner">
                <div className="news-card-m__col-xs-12 news-card-m__col-sm-6">
                  <h1 className="section-news-m__header">Лента новостей</h1>
                  {
                    mapIndexed(
                      (news, index) => <News key={index} data={news} />,
                      this.filteredNews(dateFrom, dateTo),
                    )
                  }
                  {
                    this.showMoreNewsButton() && <button
                      type="button"
                      onClick={this.loadMoreNews}
                      className="btn-m"
                    >
                      Еще новости
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        }
      </>
    );
  }
}

NewsBlock.propTypes = {
  news: PropTypes.object,
};

const mapStateToProps = state => ({
  news: state.newsStore.news,
});

const mapDispatchToProps = dispatch => ({
  loadNews: params => dispatch(loadNews(params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewsBlock));
