import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import LikeButton from '@/v1/components/LikeButton/LikeButton';
import Button from '@/v1/components/Button/Button';
import CommentBlock from '@/v1/components/CommentBlock/CommentBlock';
import RouteStatus from '@/v1/components/RouteStatus/RouteStatus';
import CommentForm from '@/v1/components/CommentForm/CommentForm';
import Counter from '@/v1/components/Counter/Counter';
import RouteDataTable from '@/v2/components/RouteDataTable/RouteDataTable';
import RouteView from '@/v2/components/RouteView/RouteView';
import RouteEditor from '@/v2/components/RouteEditor/RouteEditor';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import ScrollToTopOnMount from '@/v1/components/ScrollToTopOnMount';
import ShowSchemeButton from '@/v1/components/ShowSchemeButton/ShowSchemeButton';
import SchemeModal from '@/v2/components/SchemeModal/SchemeModal';
import NoticeButton from '@/v1/components/NoticeButton/NoticeButton';
import NoticeForm from '@/v1/components/NoticeForm/NoticeForm';
import Tooltip from '@/v1/components/Tooltip/Tooltip';
import { avail, notAvail } from '@/v1/utils';
import RouteContext from '@/v1/contexts/RouteContext';
import getArrayFromObject from '@/v1/utils/getArrayFromObject';
import {
  loadRoute,
  removeComment,
  addComment,
  removeLike,
  addLike,
  addAscent,
  updateAscent,
  removeRoute,
} from '@/v2/redux/routes/actions';
import getFilters from '@/v1/utils/getFilters';
import reloadRoutesAction from '@/v2/utils/reloadRoutes';
import { reloadSector as reloadSectorAction } from '@/v1/utils/reloadSector';
import { loadSpot as loadSpotAction } from '@/v2/redux/spots/actions';
import { setSelectedPage } from '@/v1/actions';
import showToastr from '@/v2/utils/showToastr';
import withModals, { ModalContainerContext } from '@/v2/modules/modalable';
import RouteAscents from '../../forms/RouteAscents/RouteAscents';
import { StyleSheet, css } from '../../aphrodite';

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
    loadRouteProp(this.getRouteId());
  }

  modals() {
    return {
      ascents: {
        hashRoute: true,
        body: <RouteAscents />,
      },
    };
  }

  getRouteId = () => {
    const { match } = this.props;
    return (
      match.params.route_id
        ? parseInt(match.params.route_id, 10)
        : null
    );
  };

  getSectorId = () => {
    const { match } = this.props;
    return (
      match.params.sector_id
        ? parseInt(match.params.sector_id, 10)
        : null
    );
  };

  getSpotId = () => {
    const { match } = this.props;
    return (
      match.params.id
        ? parseInt(match.params.id, 10)
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
    const {
      routes,
      user,
      addComment: addCommentProp,
    } = this.props;
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
    addCommentProp(
      params,
      () => {
        self.removeQuoteComment();
        self.onCommentContentChange('');
      },
    );
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

  removeRoute = () => {
    const {
      removeRoute: removeRouteProp,
      routes,
      history,
      match,
      sectors,
      setSelectedPage: setSelectedPageProp,
    } = this.props;
    const routeId = this.getRouteId();
    const sectorId = routes[routeId].sector_id;
    const spotId = sectors[sectorId].spot_id;
    if (window.confirm('Удалить трассу?')) {
      removeRouteProp(
        routeId,
        () => {
          if (R.contains('sectors', match.url)) {
            this.props.reloadSector(sectorId);
            this.props.reloadRoutes(spotId, sectorId);
            setSelectedPageProp(spotId, sectorId, 1);
          } else {
            this.props.loadSpot(spotId);
            this.props.reloadRoutes(spotId, 0);
            setSelectedPageProp(spotId, 0, 1);
          }
          history.push(R.replace(/\/routes\/[0-9]*/, '', match.url));
        },
      );
    }
  };

  submitNoticeForm = (msg) => {
    const { user, selectedFilters, } = this.props;
    const routeId = this.getRouteId();
    const sectorId = this.getSectorId();
    const spotId = this.getSpotId();
    Sentry.withScope((scope) => {
      scope.setExtra('user_id', user.id);
      scope.setExtra('route_id', routeId);
      scope.setExtra(
        'filters',
        getFilters(selectedFilters, spotId, sectorId),
      );
      scope.setExtra('url', window.location.href);
      if (user.login) {
        scope.setExtra('user_login', user.login);
      } else if (user.email) {
        scope.setExtra('user_email', user.email);
      } else {
        scope.setExtra('user_phone', user.phone);
      }
      Sentry.captureException(msg);
      showToastr('Сообщение успешно отправлено', { type: 'success' });
    });
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

  removeComment = (routeId, comment) => {
    const { removeComment: removeCommentProp } = this.props;
    if (!window.confirm('Удалить комментарий?')) {
      return;
    }
    removeCommentProp(comment.id);
  };

  onLikeChange = (routeId, afterChange) => {
    const {
      user,
      routes,
      removeLike: removeLikeProp,
      addLike: addLikeProp,
    } = this.props;
    const route = routes[routeId];
    const like = R.find(R.propEq('user_id', user.id))(getArrayFromObject(route.likes));
    if (like) {
      removeLikeProp(like.id, afterChange);
    } else {
      const params = { like: { user_id: user.id, route_id: routeId } };
      addLikeProp(params, afterChange);
    }
  };

  changeAscentResult = () => this.props.history.push('#ascents');

  render() {
    const {
      onClose,
      routes,
      user,
      openEdit,
      history,
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

    const currentUserHasRedpoints = () => (
      user && R.find(R.propEq('user_id', user.id))(redpoints)
    );

    const currentUserHasFlashes = () => (
      user && R.find(R.propEq('user_id', user.id))(flashes)
    );
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
            <ModalContainerContext.Consumer>
              {
                ({ isModalShown }) => (
                  <div
                    className={
                      css(styles.routeM, isModalShown ? styles.unscrollable : styles.scrollable)
                    }
                  >
                    <div className={css(styles.routeMContainer)}>
                      <div className={css(styles.routeMBlock)}>
                        <div className={css(styles.routeMClose)}>
                          <CloseButton onClick={() => onClose()} />
                        </div>
                      </div>
                      {
                        user && (
                          <RouteStatus
                            changeAscentResult={() => this.changeAscentResult(routeId)}
                          />
                        )
                      }
                      <h1
                        className={css(styles.routeMTitle)}
                        style={user ? {} : { marginTop: '0px' }}
                      >
                        <span className={css(styles.routeMTitleNumber)}>
                          {this.getRouteNumber(route)}
                        </span>
                        {
                          route.name && (
                            <span className={css(styles.routeMTitlePlaceWrapper)}>
                              <span className={css(styles.routeMTitlePlace)}>
                                <span className={css(styles.routeMTitlePlace)}>
                                  {`(“${route.name}”)`}
                                </span>
                              </span>
                            </span>
                          )
                        }
                      </h1>
                    </div>
                    <div>
                      <div className={css(styles.routeMRoute)}>
                        {
                          showLoadPhotoMsg && (
                            <div className={css(styles.routeMRouteDescr)}>
                              <div className={css(styles.routeMRoutePhotoPlaceholder)} />
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
                      <div className={css(styles.routeMRouteFooter)}>
                        <div className={css(styles.routeMRouteInformation)}>
                          <div className={css(styles.routeMRouteCount)}>
                            <LikeButton
                              numOfLikes={numOfLikes}
                              isLiked={like !== undefined}
                              onChange={
                                !user
                                  ? null
                                  : afterChange => this.onLikeChange(
                                    routeId, afterChange,
                                  )
                              }
                            />
                          </div>
                          <div className={css(styles.routeMRouteCount)}>
                            <Counter
                              number={numOfRedpoints}
                              text="redpoints"
                              type={currentUserHasRedpoints() && 'redpoints'}
                            />
                          </div>
                          <div className={css(styles.routeMRouteCount)}>
                            <Counter
                              number={numOfFlash}
                              text="flash"
                              type={currentUserHasFlashes() && 'flashes'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={css(styles.routeMContainer)}>
                      {
                        (user && avail(user)) && <div className={css(styles.trackMNotice)}>
                          <NoticeButton onClick={this.showNoticeForm} />
                          <div className={css(styles.trackMNoticeTooltip)}>
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
                        <div className={css(styles.routeMItem)}>
                          <div>
                            <button type="button" className={css(styles.collapsableBlockMHeader)}>
                              Описание
                            </button>
                            <div className={css(styles.collapsableBlockMContent)}>
                              {route.description}
                            </div>
                          </div>
                        </div>
                      )
                    }
                    {
                      (user && this.canEditRoute(user, route)) && (
                        <div className={css(styles.routeMRouteControls)}>
                          <div className={css(styles.routeMBtnDelete)}>
                            <Button
                              size="big"
                              buttonStyle="gray"
                              title="Удалить"
                              smallFont
                              onClick={this.removeRoute}
                            />
                          </div>
                          <div className={css(styles.routeMBtnSave)}>
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
                    <div className={css(styles.routeMItem)}>
                      <CommentBlock
                        startAnswer={this.startAnswer}
                        user={user}
                        removeComment={comment => this.removeComment(routeId, comment)}
                        comments={route.comments || []}
                      />
                    </div>
                    <div className={css(styles.routeMEnterComment)}>
                      <CommentForm
                        quoteComment={quoteComment}
                        setTextareaRef={this.setTextareaRef}
                        goToProfile={() => history.push('#profile')}
                        user={user}
                        content={commentContent}
                        saveComment={this.saveComment}
                        onContentChange={this.onCommentContentChange}
                        removeQuoteComment={this.removeQuoteComment}
                      />
                    </div>
                  </div>
                )
              }
            </ModalContainerContext.Consumer>
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

const styles = StyleSheet.create({
  routeM: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  routeMContainer: {
    paddingLeft: '24px',
    paddingRight: '24px',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
  },
  routeMBlock: {
    paddingTop: '20px',
    paddingBottom: '20px',
    display: 'flex',
  },
  routeMClose: {
    width: '16px',
    height: '16px',
    marginLeft: 'auto',
  },
  routeMTitle: {
    color: '#1f1f1f',
    fontSize: '28px',
    fontFamily: 'GilroyBold, sans-serif',
    marginBottom: '26px',
    marginTop: '36px',
  },
  routeMTitleNumber: { lineHeight: '35px' },
  routeMTitlePlaceWrapper: {
    display: 'block',
    marginTop: '4px',
    overflow: 'hidden',
  },
  routeMTitlePlace: {
    color: '#797979',
    whiteSpace: 'nowrap',
    width: 'auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '35px',
    lineHeight: '34px',
    display: 'block',
  },
  routeMRoute: {
    width: '100%',
    height: 'calc(100vh * 0.7)',
    backgroundColor: '#E2E2E2',
    position: 'relative',
    overflow: 'hidden',
  },
  routeMRouteDescr: {
    position: 'absolute',
    content: '\'\'',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 1,
  },
  routeMRouteFooter: {
    padding: '16px 24px',
    backgroundColor: '#F8F8F8',
  },
  routeMRouteInformation: { display: 'flex' },
  routeMRouteCount: {
    ':not(:last-child)': {
      marginRight: '34px',
      minWidth: '40px',
    },
  },
  routeMItem: {
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #E2E2E2',
  },
  routeMRouteControls: {
    padding: '12px 24px',
    display: 'flex',
    borderTop: '1px solid #E2E2E2',
  },
  routeMBtnDelete: {
    maxWidth: 'calc(40% - 12px)',
    width: '100%',
    marginRight: '12px',
  },
  routeMBtnSave: {
    maxWidth: '60%',
    width: '100%',
  },
  routeMEnterComment: {
    padding: '12px 24px',
    paddingBottom: 0,
    boxSizing: 'border-box',
    width: '100%',
    position: 'relative',
    backgroundColor: '#ffffff',
    alignSelf: 'flex-end',
    borderTop: '1px solid #E2E2E2',
  },
  scrollable: { overflowY: 'auto' },
  unscrollable: { overflowY: 'hidden' },
  collapsableBlockMHeader: {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    outline: 'none',
    padding: 0,
    width: '100%',
    textAlign: 'left',
    position: 'relative',
    paddingRight: '15px',
    paddingBottom: '16px',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#1f1f1f',
    fontFamily: 'GilroyBold',
    lineHeight: '1.3em',
  },
  collapsableBlockMContent: {
    color: '#1f1f1f',
    fontSize: '16px',
    lineHeight: '1.3em',
    marginBottom: '18px',
  },
  trackMNotice: {
    width: '16px',
    height: '16px',
    position: 'absolute',
    right: '14px',
    top: '14px',
  },
  trackMNoticeTooltip: {
    position: 'absolute',
    content: '\'\'',
    right: 'calc(100% + 12px)',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  routeMRoutePhotoPlaceholder: {
    width: '118px',
    height: '118px',
    position: 'relative',
    backgroundImage: 'url(./photo-placeholder.svg)',
    backgroundSize: 'contain',
  },
});

RoutesShowModal.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  sectors: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  openEdit: PropTypes.func.isRequired,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  selectedFilters: state.selectedFilters,
  routes: state.routesStoreV2.routes,
  sectors: state.sectorsStore.sectors,
  user: state.usersStore.users[state.usersStore.currentUserId],
});

const mapDispatchToProps = dispatch => ({
  loadSpot: spotId => dispatch(loadSpotAction(spotId)),
  reloadSector: sectorId => dispatch(reloadSectorAction(sectorId)),
  reloadRoutes: (spotId, sectorId) => dispatch(reloadRoutesAction(spotId, sectorId)),
  loadRoute: (url, afterLoad) => dispatch(loadRoute(url, afterLoad)),
  removeComment: url => dispatch(removeComment(url)),
  addComment: (params, afterSuccess) => dispatch(addComment(params, afterSuccess)),
  removeLike: (url, afterAll) => dispatch(removeLike(url, afterAll)),
  addLike: (params, afterAll) => dispatch(addLike(params, afterAll)),
  addAscent: params => dispatch(addAscent(params)),
  updateAscent: (url, params) => dispatch(updateAscent(url, params)),
  removeRoute: (url, afterSuccess) => dispatch(removeRoute(url, afterSuccess)),
  setSelectedPage: (spotId, sectorId, page) => dispatch(setSelectedPage(spotId, sectorId, page)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withModals(RoutesShowModal)),
);
