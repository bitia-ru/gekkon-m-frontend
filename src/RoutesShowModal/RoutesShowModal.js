import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import LikeButton from '../LikeButton/LikeButton';
import Button from '../Button/Button';
import CommentBlock from '../CommentBlock/CommentBlock';
import RouteStatus from '../RouteStatus/RouteStatus';
import CommentForm from '../CommentForm/CommentForm';
import Counter from '../Counter/Counter';
import RouteDataTable from '../RouteDataTable/RouteDataTable';
import RouteView from '../RouteView/RouteView';
import RouteEditor from '../RouteEditor/RouteEditor';
import CloseButton from '../CloseButton/CloseButton';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import ShowSchemeButton from '../ShowSchemeButton/ShowSchemeButton';
import SchemeModal from '../SchemeModal/SchemeModal';
import NoticeButton from '../NoticeButton/NoticeButton';
import NoticeForm from '../NoticeForm/NoticeForm';
import Tooltip from '../Tooltip/Tooltip';
import { avail, notAvail } from '../Utils';
import RouteContext from '../contexts/RouteContext';
import getArrayFromObject from '../../v1/utils/getArrayFromObject';
import { loadRoute } from '../../v1/stores/routes/utils';
import { ApiUrl } from '../Environ';
import './RoutesShowModal.css';

class RoutesShowModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quoteComment: null,
      commentContent: '',
      showRouteMark: false,
      routeImageLoading: true,
      schemeModalVisible: false,
      showNoticeForm: false,
      showTooltip: false,
    };
  }

  componentDidMount() {
    const { loadRoute: loadRouteProp } = this.props;
    loadRouteProp(`${ApiUrl}/v1/routes/${this.getRouteId()}`);
  }

  getRouteId = () => {
    const { match } = this.props;
    return (
      match.params.route_id
        ? parseInt(match.params.route_id, 10)
        : null
    );
  };

  startAnswer = (quoteComment) => {
    this.setState({ quoteComment });
    this.textareaRef.focus();
  };

  removeQuoteComment = () => {
    this.setState({ quoteComment: null });
  };

  onCommentContentChange = (content) => {
    this.setState({ commentContent: content });
  };

  saveComment = (routeCommentId) => {
    const { routes, user, saveComment } = this.props;
    const { commentContent } = this.state;
    const route = routes[this.getRouteId()];
    const params = {
      route_comment: {
        route_id: route.id,
        author_id: user.id,
        content: commentContent,
      },
    };
    if (routeCommentId !== null) {
      params.route_comment.route_comment_id = routeCommentId;
    }
    const self = this;
    saveComment(this.getRouteId(), params, () => {
      self.removeQuoteComment();
      self.onCommentContentChange('');
    });
  };

  pointers = () => {
    const { routes } = this.props;
    const route = routes[this.getRouteId()];
    const pointers = (
      (route.mark && route.mark.pointers)
        ? route.mark.pointers
        : {
          x: [],
          y: [],
          angle: [],
        }
    );
    const mapIndexed = R.addIndex(R.map);
    return mapIndexed((x, index) => ({
      x: parseFloat(x),
      y: parseFloat(pointers.y[index]),
      dx: 0,
      dy: 0,
      angle: parseInt(pointers.angle[index], 10),
    }), pointers.x);
  };

  setTextareaRef = (ref) => {
    this.textareaRef = ref;
  };

  canEditRoute = (user, route) => {
    if (user.role === 'admin' || user.role === 'creator') return true;
    if (user.role === 'user' && route.author_id === user.id) return true;
    return false;
  };

  showNoticeForm = (event) => {
    event.stopPropagation();
    this.setState({ showTooltip: false, showNoticeForm: true });
  };

  cancelNoticeForm = (event) => {
    event.stopPropagation();
    this.setState({ showTooltip: false, showNoticeForm: false });
  };

  submitNoticeForm = (msg) => {
    const { submitNoticeForm } = this.props;
    submitNoticeForm(this.getRouteId(), msg);
    this.setState({ showTooltip: false, showNoticeForm: false });
  };

  getRouteNumber = (route) => {
    if (route.number) {
      return `№ ${route.number}`;
    }
    if (route.id) {
      return `# ${route.id}`;
    }
    return '';
  };

  render() {
    const {
      onClose,
      routes,
      user,
      changeAscentResult,
      onLikeChange,
      openEdit,
      removeRoute,
      removeComment,
      goToProfile,
    } = this.props;
    const {
      quoteComment,
      commentContent,
      showRouteMark,
      routeImageLoading,
      schemeModalVisible,
      showNoticeForm,
      showTooltip,
    } = this.state;
    const route = routes[this.getRouteId()];
    const showLoadPhotoMsg = (
      ((route && !route.photo) || !routeImageLoading) && user && this.canEditRoute(user, route)
    );
    const routeId = this.getRouteId();
    const likes = avail(route) && avail(route.likes) && getArrayFromObject(route.likes);
    const numOfLikes = (avail(likes) && likes.length);
    const like = (
      notAvail(user) || notAvail(likes)
        ? undefined
        : R.find(R.propEq('user_id', user.id))(likes)
    );
    const ascents = avail(route) && avail(route.ascents) && getArrayFromObject(route.ascents);
    const redpoints = avail(route) && avail(ascents) && R.filter(
      R.propEq('result', 'red_point'),
      ascents,
    );
    const numOfRedpoints = (avail(redpoints) && redpoints.length) || 0;
    const flashes = avail(route) && avail(ascents) && R.filter(
      R.propEq('result', 'flash'),
      ascents,
    );
    const numOfFlash = (avail(flashes) && flashes.length) || 0;
    return (
      <>
        {
          avail(route) && <RouteContext.Provider value={{ route }}>
            <ScrollToTopOnMount />
            {
              showRouteMark && (
                <RouteEditor
                  routePhoto={
                    typeof (route.photo) === 'string'
                      ? route.photo
                      : route.photo.url
                  }
                  pointers={this.pointers()}
                  editable={false}
                  hide={() => this.setState({ showRouteMark: false })}
                  routeImageLoading={routeImageLoading}
                  onImageLoad={() => this.setState({ routeImageLoading: false })}
                />
              )
            }
            <div className="route-m">
              <div className="route-m__container">
                <div className="route-m__block">
                  <div className="route-m__close">
                    <CloseButton onClick={() => onClose()}/>
                  </div>
                </div>
                {
                  user && (
                    <RouteStatus
                      changeAscentResult={() => changeAscentResult(routeId)}
                    />
                  )
                }
                <h1 className="route-m__title" style={user ? {} : { marginTop: '0px' }}>
                  <span className="route-m__title-number">
                    {this.getRouteNumber(route)}
                  </span>
                  {
                    route.name && (
                      <span className="route-m__title-place-wrapper">
                        <span className="route-m__title-place">
                          <span className="route-m__title-place">
                            {`(“${route.name}”)`}
                          </span>
                        </span>
                      </span>
                    )
                  }
                </h1>
              </div>
              <div className="route-m__route-block">
                <div className="route-m__route">
                  {
                    showLoadPhotoMsg && (
                      <div className="route-m__route-descr">
                        <div className="route-m__route-descr-picture"/>
                        <div className="route-m__route-descr-text">Загрузите фото трассы</div>
                      </div>
                    )
                  }
                  {
                    route.photo && (
                      <RouteView
                        route={route}
                        routePhoto={route.photo.url}
                        pointers={this.pointers()}
                        onClick={() => this.setState({ showRouteMark: true })}
                        routeImageLoading={routeImageLoading}
                        onImageLoad={() => this.setState({ routeImageLoading: false })}
                      />
                    )
                  }
                  <ShowSchemeButton
                    disabled={!route.data || route.data.position === undefined}
                    onClick={() => this.setState({ schemeModalVisible: true })}
                  />
                </div>
                <div className="route-m__route-footer">
                  <div className="route-m__route-information">
                    <div className="route-m__route-count">
                      <LikeButton
                        numOfLikes={numOfLikes}
                        isLiked={like !== undefined}
                        onChange={
                          !user
                            ? null
                            : afterChange => onLikeChange(
                              routeId, afterChange,
                            )
                        }
                      />
                    </div>
                    <div className="route-m__route-count">
                      <Counter number={numOfRedpoints} text="redpoints"/>
                    </div>
                    <div className="route-m__route-count">
                      <Counter number={numOfFlash} text="flash"/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="route-m__container">
                {
                  (user && avail(user)) && <div className="track-m__notice">
                    <NoticeButton onClick={this.showNoticeForm} />
                    <div className="track-m__notice-tooltip">
                      {
                        false && showTooltip && <Tooltip
                          text="Сообщить об ошибке"
                        />
                      }
                    </div>
                  </div>
                }
                <RouteDataTable route={route} user={user} />
              </div>
              {
                route.description && (
                  <div className="route-m__item">
                    <div className="collapsable-block-m">
                      <button type="button" className="collapsable-block-m__header">
                        Описание
                      </button>
                      <div className="collapsable-block-m__content">
                        {route.description}
                      </div>
                    </div>
                  </div>
                )
              }
              {
                (user && this.canEditRoute(user, route)) && (
                  <div className="route-m__route-controls">
                    <div className="route-m__btn-delete">
                      <Button
                        size="big"
                        buttonStyle="gray"
                        title="Удалить"
                        smallFont
                        onClick={() => removeRoute(routeId)}
                      />
                    </div>
                    <div className="route-m__btn-save">
                      <Button
                        size="big"
                        buttonStyle="normal"
                        title="Редактировать"
                        smallFont
                        onClick={() => openEdit(routeId)}
                      />
                    </div>
                  </div>
                )
              }
              <div className="route-m__item">
                <CommentBlock
                  startAnswer={this.startAnswer}
                  user={user}
                  removeComment={comment => removeComment(routeId, comment)}
                  comments={route.comments || []}
                />
              </div>
              <div className="route-m__enter-comment">
                <CommentForm
                  quoteComment={quoteComment}
                  setTextareaRef={this.setTextareaRef}
                  goToProfile={goToProfile}
                  user={user}
                  content={commentContent}
                  saveComment={this.saveComment}
                  onContentChange={this.onCommentContentChange}
                  removeQuoteComment={this.removeQuoteComment}
                />
              </div>
            </div>
            {
              schemeModalVisible && <SchemeModal
                currentRoute={route}
                close={() => this.setState({ schemeModalVisible: false })}
              />
            }
            {
              showNoticeForm && <NoticeForm
                submit={this.submitNoticeForm}
                cancel={this.cancelNoticeForm}
              />
            }
          </RouteContext.Provider>
        }
      </>
    );
  }
}

RoutesShowModal.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  openEdit: PropTypes.func.isRequired,
  removeRoute: PropTypes.func.isRequired,
  goToProfile: PropTypes.func.isRequired,
  removeComment: PropTypes.func.isRequired,
  saveComment: PropTypes.func.isRequired,
  onLikeChange: PropTypes.func.isRequired,
  changeAscentResult: PropTypes.func.isRequired,
  submitNoticeForm: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  routes: state.routesStore.routes,
  user: state.usersStore.users[state.usersStore.currentUserId],
});

const mapDispatchToProps = dispatch => ({
  loadRoute: (url, afterLoad) => dispatch(loadRoute(url, afterLoad)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutesShowModal));
