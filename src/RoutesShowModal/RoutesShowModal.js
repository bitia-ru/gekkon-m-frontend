import React, { Component } from 'react';
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
import { avail } from '../Utils';
import './RoutesShowModal.css';

export default class RoutesShowModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quoteComment: null,
      commentContent: '',
      currentPointers: [],
      showRouteMark: false,
      routeImageLoading: true,
      schemeModalVisible: false,
      showNoticeForm: false,
      showTooltip: false,
    };
  }

  componentDidMount() {
    this.loadPointers();
  }

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
    const { route, user, saveComment } = this.props;
    const { commentContent } = this.state;
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
    saveComment(params, () => {
      self.removeQuoteComment();
      self.onCommentContentChange('');
    });
  };

  loadPointers = () => {
    const { route } = this.props;
    let pointers = (
      (route.mark && route.mark.pointers)
        ? route.mark.pointers
        : {
          x: [],
          y: [],
          angle: [],
        }
    );
    const mapIndexed = R.addIndex(R.map);
    pointers = mapIndexed((x, index) => ({
      x: parseFloat(x),
      y: parseFloat(pointers.y[index]),
      dx: 0,
      dy: 0,
      angle: parseInt(pointers.angle[index], 10),
    }), pointers.x);
    this.setState({ currentPointers: pointers });
  };

  updatePointers = (pointers) => {
    this.setState({ currentPointers: pointers });
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
    submitNoticeForm(msg);
    this.setState({ showTooltip: false, showNoticeForm: false });
  };

  render() {
    const {
      onClose,
      user,
      ascent,
      route,
      changeAscentResult,
      numOfLikes,
      isLiked,
      likeBtnIsBusy,
      onLikeChange,
      numOfRedpoints,
      numOfFlash,
      openEdit,
      removeRoute,
      removeComment,
      comments,
      goToProfile,
      diagram,
    } = this.props;
    const {
      currentPointers,
      quoteComment,
      commentContent,
      showRouteMark,
      routeImageLoading,
      schemeModalVisible,
      showNoticeForm,
      showTooltip,
    } = this.state;
    const showLoadPhotoMsg = (
      (!route.photo || !routeImageLoading) && user && this.canEditRoute(user, route)
    );
    return (
      <>
        <ScrollToTopOnMount />
        {
          showRouteMark && (
            <RouteEditor
              route={route}
              routePhoto={
                typeof (route.photo) === 'string'
                  ? route.photo
                  : route.photo.url
              }
              pointers={currentPointers}
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
                <CloseButton onClick={() => onClose()} />
              </div>
            </div>
            {
              user && (
                <RouteStatus
                  ascent={ascent}
                  changeAscentResult={changeAscentResult}
                />
              )
            }
            <h1 className="route-m__title" style={user ? {} : { marginTop: '0px' }}>
              <span className="route-m__title-number">
                {route.number ? `№ ${route.number}` : `# ${route.id}`}
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
                    <div className="route-m__route-descr-picture" />
                    <div className="route-m__route-descr-text">Загрузите фото трассы</div>
                  </div>
                )
              }
              {
                route.photo && (
                  <RouteView
                    route={route}
                    routePhoto={route.photo.url}
                    pointers={currentPointers}
                    onClick={() => this.setState({ showRouteMark: true })}
                    routeImageLoading={routeImageLoading}
                    onImageLoad={() => this.setState({ routeImageLoading: false })}
                  />
                )
              }
              <ShowSchemeButton
                disabled={route.data.position === undefined}
                onClick={() => this.setState({ schemeModalVisible: true })}
              />
            </div>
            <div className="route-m__route-footer">
              <div className="route-m__route-information">
                <div className="route-m__route-count">
                  <LikeButton
                    numOfLikes={numOfLikes}
                    isLiked={isLiked}
                    busy={likeBtnIsBusy}
                    onChange={!user ? null : onLikeChange}
                  />
                </div>
                <div className="route-m__route-count">
                  <Counter number={numOfRedpoints} text="redpoints" />
                </div>
                <div className="route-m__route-count">
                  <Counter number={numOfFlash} text="flash" />
                </div>
              </div>
            </div>
          </div>
          <div className="route-m__container">
            {
              (user && avail(user.id)) && <div className="track-m__notice">
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
                    onClick={removeRoute}
                  />
                </div>
                <div className="route-m__btn-save">
                  <Button
                    size="big"
                    buttonStyle="normal"
                    title="Редактировать"
                    smallFont
                    onClick={openEdit}
                  />
                </div>
              </div>
            )
          }
          <div className="route-m__item">
            <CommentBlock
              startAnswer={this.startAnswer}
              user={user}
              removeComment={removeComment}
              comments={comments}
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
            diagram={diagram}
            close={() => this.setState({ schemeModalVisible: false })}
          />
        }
        {
          showNoticeForm && <NoticeForm
            submit={this.submitNoticeForm}
            cancel={this.cancelNoticeForm}
          />
        }
      </>
    );
  }
}

RoutesShowModal.propTypes = {
  user: PropTypes.object,
  diagram: PropTypes.string,
  ascent: PropTypes.object,
  numOfRedpoints: PropTypes.number,
  numOfFlash: PropTypes.number,
  numOfLikes: PropTypes.number,
  route: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  openEdit: PropTypes.func.isRequired,
  removeRoute: PropTypes.func.isRequired,
  goToProfile: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  removeComment: PropTypes.func.isRequired,
  saveComment: PropTypes.func.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likeBtnIsBusy: PropTypes.bool.isRequired,
  onLikeChange: PropTypes.func.isRequired,
  changeAscentResult: PropTypes.func.isRequired,
  submitNoticeForm: PropTypes.func.isRequired,
};

RoutesShowModal.defaultProps = {
  ascent: null,
};
