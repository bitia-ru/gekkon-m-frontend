import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Button from '@/v1/components/Button/Button';
import RouteDataEditableTable from '@/v2/components/RouteDataEditableTable/RouteDataEditableTable';
import RouteView from '@/v2/components/RouteView/RouteView';
import RouteEditor from '@/v2/components/RouteEditor/RouteEditor';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import ButtonHandler from '@/v2/components/ButtonHandler/ButtonHandler';
import { DEFAULT_CATEGORY } from '@/v1/Constants/Categories';
import { NUM_OF_DAYS } from '@/v1/Constants/Route';
import RoutePhotoCropper from '@/v2/components/RoutePhotoCropper/RoutePhotoCropper';
import ScrollToTopOnMount from '@/v1/components/ScrollToTopOnMount';
import ShowSchemeButton from '@/v1/components/ShowSchemeButton/ShowSchemeButton';
import SchemeModal from '@/v2/components/SchemeModal/SchemeModal';
import RouteContext from '@/v1/contexts/RouteContext';
import NewRoute from '@/v1/Constants/NewRoute';
import { avail } from '@/v1/utils';
import { loadRouteMarkColors } from '@/v1/stores/route_mark_colors/utils';
import { loadUsers } from '@/v1/stores/users/utils';
import { loadSector } from '@/v1/stores/sectors/utils';
import { addWallPhoto as addWallPhotoAction } from '../../redux/wall_photos/actions';
import { addRoute, loadRoute, updateRoute } from '@/v2/redux/routes/actions';
import getArrayByIds from '@/v1/utils/getArrayByIds';
import { reloadSector as reloadSectorAction } from '@/v1/utils/reloadSector';
import { default as reloadRoutesAction } from '@/v2/utils/reloadRoutes';
import { css, StyleSheet } from '../../aphrodite';

class RoutesEditModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPointers: [],
      currentPointersOld: [],
      route: undefined,
      fieldsOld: {},
      showCropper: false,
      photo: {
        crop: null, rotate: null,
      },
      wallPhotoId: null,
      showRouteMark: false,
      routeImageLoading: true,
      schemeModalVisible: false,
      isWaiting: false,
    };
  }

  componentDidMount() {
    const {
      sectors,
      match,
      loadUsers: loadUsersProp,
      routeMarkColors,
      loadRoute: loadRouteProp,
      loadSector: loadSectorProp,
      loadRouteMarkColors: loadRouteMarkColorsProp,
    } = this.props;
    const sectorId = match.params.sector_id ? parseInt(match.params.sector_id, 10) : null;
    const routeId = this.getRouteId();
    if (routeId === null && !sectors[sectorId]) {
      const params = {};
      params.numOfDays = NUM_OF_DAYS;
      loadSectorProp(
        sectorId,
        params,
        (payload) => {
          this.afterSectorIsLoaded(payload);
        },
      );
    }
    if (routeId === null && sectors[sectorId]) {
      this.afterSectorIsLoaded(sectors[sectorId]);
    }
    if (routeId) {
      loadRouteProp(
        this.getRouteId(),
        (payload) => {
          const route = payload;
          const routeCopy = R.clone(route);
          if (route.photo) {
            routeCopy.photo = routeCopy.photo.url;
          }
          if (route.category === null) {
            routeCopy.category = DEFAULT_CATEGORY;
          }
          this.setState({ fieldsOld: routeCopy, route: R.clone(routeCopy) });
          this.loadPointers(route);
        },
      );
    }
    loadUsersProp();
    if (routeMarkColors.length === 0) {
      loadRouteMarkColorsProp();
    }
  }

  afterSectorIsLoaded = (sector) => {
    const {
      user,
    } = this.props;
    this.newRoute = R.clone(NewRoute);
    this.newRoute.sector_id = sector.id;
    if (sector.kind !== 'mixed') {
      this.newRoute.kind = sector.kind;
    }
    this.newRoute.category = DEFAULT_CATEGORY;
    if (user.role === 'user') this.newRoute.data.personal = true;
    this.setState({ route: R.clone(this.newRoute) });
  };

  getRouteId = () => {
    const { match } = this.props;
    return (
      match.params.route_id
        ? parseInt(match.params.route_id, 10)
        : null
    );
  };

  updateRoute = (params) => {
    const {
      history,
      match,
      updateRoute: updateRouteProp,
    } = this.props;
    const routeId = this.getRouteId();
    this.setState({ isWaiting: true });
    updateRouteProp(
      routeId,
      params,
      () => history.replace(R.replace('/edit', '', `${match.url}`)),
      () => this.setState({ isWaiting: false }),
    );
  };

  createRoute = (params) => {
    const {
      history,
      match,
      sectors,
      addRoute: addRouteProp,
    } = this.props;
    this.setState({ isWaiting: true });
    addRouteProp(
      params,
      (payload) => {
        history.replace(
          R.replace('new', payload.id, `${match.url}`),
        );
        this.props.reloadSector(payload.sector_id);
        this.props.reloadRoutes(
          sectors[payload.sector_id].spot_id, payload.sector_id,
        );
      },
      () => this.setState({ isWaiting: false }),
    );
  };

  changed = (newValue, oldValue) => JSON.stringify(newValue) !== JSON.stringify(oldValue);

  save = () => {
    const {
      route, photo, currentPointers, currentPointersOld, wallPhotoId,
    } = this.state;
    const {
      routes, sectors, user,
    } = this.props;
    const sector = sectors[route.sector_id];
    const routeId = this.getRouteId();
    const routeProp = routeId ? routes[routeId] : this.newRoute;
    const paramList = [
      'number',
      'name',
      'author_id',
      'category',
      'kind',
      'installed_at',
      'installed_until',
      'description',
    ];
    const formData = new FormData();
    const pointersChanged = this.changed(currentPointers, currentPointersOld);
    const holdsColorsChanged = this.changed(routeProp.holds_color, route.holds_color);
    const marksColorsChanged = this.changed(routeProp.marks_color, route.marks_color);
    if (pointersChanged || holdsColorsChanged || marksColorsChanged) {
      const x = R.map(pointer => pointer.x, currentPointers);
      const y = R.map(pointer => pointer.y, currentPointers);
      const angle = R.map(pointer => pointer.angle, currentPointers);
      if (route.holds_color) {
        formData.append('route[mark][colors][holds]', route.holds_color.id);
      }
      if (route.marks_color) {
        formData.append('route[mark][colors][marks]', route.marks_color.id);
      }
      R.forEach(e => formData.append('route[mark][pointers][x][]', e), x);
      R.forEach(e => formData.append('route[mark][pointers][y][]', e), y);
      R.forEach(e => formData.append('route[mark][pointers][angle][]', e), angle);
    }
    R.forEach(
      (param) => {
        if (routeProp[param] !== route[param]) {
          formData.append(`route[${param}]`, route[param]);
        }
      },
      paramList,
    );
    if (route.id === null) {
      formData.append('route[sector_id]', route.sector_id);
      if (sector.kind !== 'mixed') {
        formData.append('route[kind]', route.kind);
      }
      formData.append('route[category]', route.category);
    }
    if (wallPhotoId || (routeProp.photo?.url && route.photo === null)) {
      formData.append('route[wall_photo_id]', wallPhotoId);
    }
    if (photo.crop !== null) {
      formData.append('data[photo][cropping][x]', Math.round(photo.crop.x));
      formData.append('data[photo][cropping][y]', Math.round(photo.crop.y));
      formData.append('data[photo][cropping][width]', Math.round(photo.crop.width));
      formData.append('data[photo][cropping][height]', Math.round(photo.crop.height));
    }
    if (photo.rotate !== null) {
      formData.append('data[photo][rotation]', photo.rotate);
    }
    if (routeProp.data.personal || user.id === route.author_id) {
      formData.append('data[personal]', true);
    }
    if (routeProp.id !== null) {
      this.updateRoute(formData);
    } else {
      this.createRoute(formData);
    }
  };

  loadPointers = (currentRoute) => {
    let route;
    if (currentRoute) {
      route = currentRoute;
    } else {
      const { routes } = this.props;
      const routeId = this.getRouteId();
      route = routeId ? routes[routeId] : this.newRoute;
    }
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
    this.setState({ currentPointers: pointers, currentPointersOld: pointers });
  };

  updatePointers = (pointers) => {
    this.setState({ currentPointers: pointers });
  };

  onRouteParamChange = (value, paramName) => {
    const { route } = this.state;
    const newRoute = R.clone(route);
    newRoute[paramName] = value;
    if (paramName === 'author') {
      newRoute.author_id = value ? value.id : null;
    }
    if (paramName === 'photo' && value === null) {
      newRoute.photoFile = null;
    }
    this.setState({ route: newRoute });
  };

  onNewPhotoFileSelected = (file) => {
    const { route } = this.state;
    this.setState({ isWaiting: true });
    const formData = new FormData();
    formData.append('wall_photo[sector_id]', route.sector_id);
    formData.append('wall_photo[photo]', file);
    this.props.addWallPhoto(
      formData,
      (payload) => {
        this.setState({
          showCropper: true,
          photo: { url: payload.photo.url },
          wallPhotoId: payload.id,
        });
      },
      () => this.setState({ isWaiting: false }),
    );
  };

  noCrop = (crop, image) => {
    if (crop.width === 0) {
      return true;
    }
    if (crop.height === 0) {
      return true;
    }
    if ((Math.abs(image.width - crop.width) < 1 && Math.abs(image.height - crop.height) < 1)) {
      return true;
    }
    return false;
  };

  saveCropped = (src, crop, rotate, image) => {
    const { route, photo } = this.state;
    const photoCopy = R.clone(photo);
    if (this.noCrop(crop, image)) {
      photoCopy.crop = null;
      photoCopy.rotate = (rotate === 0 ? null : rotate);
    } else {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      photoCopy.crop = {
        x: crop.x * scaleX,
        y: crop.y * scaleY,
        width: crop.width * scaleX,
        height: crop.height * scaleY,
      };
      photoCopy.rotate = (rotate === 0 ? null : rotate);
    }
    this.setState({ route: { ...route, photo: src }, showCropper: false, photo: photoCopy });
  };

  render() {
    const {
      onClose,
      users,
      routeMarkColors,
      cancel,
    } = this.props;
    const {
      photo,
      route,
      currentPointers,
      fieldsOld,
      currentPointersOld,
      showCropper,
      showRouteMark,
      routeImageLoading,
      schemeModalVisible,
      isWaiting,
    } = this.state;
    const routeChanged = JSON.stringify(route) !== JSON.stringify(fieldsOld);
    const pointersChanged = JSON.stringify(currentPointers) !== JSON.stringify(currentPointersOld);
    const saveDisabled = (!routeChanged && !pointersChanged);
    const btnHandlerImage = require('../../../../img/btn-handler/btn-handler-sprite.svg');
    return (
      <RouteContext.Provider value={{ route }}>
        {
          avail(route) && (
            <div className={css(styles.routeModalContainer)}>
              <ScrollToTopOnMount />
              {
                showRouteMark
                  ? (
                    <RouteEditor
                      routePhoto={
                        typeof (route.photo) === 'string'
                          ? route.photo
                          : route.photo.url
                      }
                      pointers={currentPointers}
                      editable
                      updatePointers={this.updatePointers}
                      hide={() => this.setState({ showRouteMark: false })}
                      routeImageLoading={routeImageLoading}
                      onImageLoad={() => this.setState({ routeImageLoading: false })}
                    />
                  )
                  : ''
              }
              {
                showCropper
                  ? (
                    <RoutePhotoCropper
                      src={photo.url}
                      close={() => this.setState({ showCropper: false })}
                      save={this.saveCropped}
                    />
                  )
                  : (
                    <div className={css(styles.routeM)}>
                      <div className={css(styles.routeMContainer)}>
                        <div className={css(styles.routeMBlock)}>
                          <div className={css(styles.routeMClose)}>
                            <CloseButton onClick={onClose} />
                          </div>
                        </div>
                        <h1 className={css(styles.routeMTitle)} style={{ marginTop: '0px' }}>
                          №
                          {' '}
                          <input
                            type="text"
                            onChange={
                              event => (
                                this.onRouteParamChange(event.target.value, 'number')
                              )
                            }
                            className={css(styles.routeMTitleInput, styles.routeMTitleInputDark)}
                            value={route.number === null ? '' : route.number}
                          />
                          <span className={css(styles.routeMTitlePlaceWrapper)}>
                            <span className={css(styles.routeMTitlePlaceEdit)}>(“</span>
                            <input
                              type="text"
                              onChange={
                                event => (
                                  this.onRouteParamChange(event.target.value, 'name')
                                )
                              }
                              className={css(styles.routeMTitleInput)}
                              value={route.name === null ? '' : route.name}
                            />
                            <span className={css(styles.routeMTitlePlaceEdit)}>”)</span>
                          </span>
                        </h1>
                      </div>
                      <div>
                        <div className={css(styles.routeMRoute)}>
                          {
                            (!route.photo || !routeImageLoading) && (
                              <div className={css(styles.routeMRouteDescr)}>
                                <div className={css(styles.routeMRouteDescrPicture)} />
                                <div className={css(styles.routeMRouteDescrText)}>
                                  Загрузите фото трассы
                                </div>
                              </div>
                            )
                          }
                          {
                            route.photo && (
                              <RouteView
                                route={route}
                                routePhoto={
                                  typeof (route.photo) === 'string'
                                    ? route.photo
                                    : route.photo.url
                                }
                                pointers={currentPointers}
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
                        <div className={css(styles.routeMRouteFooter)}>
                          <div className={css(styles.routeMRouteFooterContainer)}>
                            <div className={css(styles.routeMRouteFooterToggles)}>
                              {
                                route.photo && (
                                  <ButtonHandler
                                    onClick={() => this.setState({ showRouteMark: true })}
                                    title="Просмотр трассы"
                                    xlinkHref={`${require('./images/point.svg')}#point`}
                                  />
                                )
                              }
                            </div>
                            <div className={css(styles.routeMRouteFooterToggles)}>
                              <input
                                type="file"
                                hidden
                                ref={
                                  (ref) => { this.fileInput = ref; }
                                }
                                onChange={
                                  event => this.onNewPhotoFileSelected(event.target.files[0])
                                }
                              />
                              {
                                route.photo
                                  ? (
                                    <>
                                      <ButtonHandler
                                        onClick={() => this.fileInput.click()}
                                        title="Обновить фото"
                                        xlinkHref={`${btnHandlerImage}#icon-btn-reload`}
                                      />
                                      <ButtonHandler
                                        onClick={
                                          () => (
                                            this.onRouteParamChange(null, 'photo')
                                          )
                                        }
                                        title="Удалить фото"
                                        xlinkHref={`${btnHandlerImage}#icon-btn-close`}
                                      />
                                    </>
                                  )
                                  : (
                                    <ButtonHandler
                                      onClick={() => this.fileInput.click()}
                                      title="Загрузить фото"
                                      xlinkHref={`${btnHandlerImage}#icon-btn-download`}
                                    />
                                  )
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={css(styles.routeMContainer)}>
                        <RouteDataEditableTable
                          onRouteParamChange={this.onRouteParamChange}
                          routeMarkColors={routeMarkColors}
                          users={users}
                        />
                      </div>
                      <div className={css(styles.routeMItem)}>
                        <div>
                          <button type="button" className={css(styles.collapsableBlockMHeader)}>
                            Описание
                          </button>
                          <textarea
                            className={css(styles.routeMDescrEdit)}
                            onChange={
                              event => (
                                this.onRouteParamChange(event.target.value, 'description')
                              )
                            }
                            value={route.description ? route.description : ''}
                          />
                        </div>
                      </div>
                      <div className={css(styles.routeMRouteControls)}>
                        <div className={css(styles.routeMBtnDelete)}>
                          <Button
                            size="big"
                            buttonStyle="gray"
                            title="Отмена"
                            smallFont
                            onClick={() => cancel(route.id)}
                          />
                        </div>
                        <div className={css(styles.routeMBtnSave)}>
                          <Button
                            size="big"
                            buttonStyle="normal"
                            title="Сохранить"
                            smallFont
                            isWaiting={isWaiting}
                            disabled={saveDisabled}
                            onClick={this.save}
                          />
                        </div>
                      </div>
                    </div>
                  )
              }
              {
                schemeModalVisible && <SchemeModal
                  currentRoute={route}
                  close={() => this.setState({ schemeModalVisible: false })}
                />
              }
            </div>
          )
        }
      </RouteContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  routeModalContainer: {
    position: 'relative',
    zIndex: 20,
    height: '100%',
  },
  routeM: {
    height: '100%',
    overflowY: 'auto',
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
  routeMTitleInput: {
    border: 'none',
    fontSize: '30px',
    color: '#797979',
    fontFamily: 'GilroyBold, sans-serif',
    outline: 'none',
    maxWidth: 'calc(100% - 70px)',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    display: 'inline-block',
    lineHeight: '35px',
    height: '35px',
    padding: '1px 2px',
    boxSizing: 'border-box',
    ':hover': { borderBottom: '2px solid #E3E3E3' },
  },
  routeMTitleInputDark: {
    color: '#1f1f1f',
    marginLeft: '5px',
  },
  routeMTitlePlaceEdit: { color: '#797979' },
  routeMTitlePlaceWrapper: {
    display: 'block',
    marginTop: '4px',
    overflow: 'hidden',
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
  routeMRouteDescrPicture: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '4px solid #797979',
    position: 'relative',
    ':before': {
      position: 'absolute',
      content: '\'\'',
      width: '4px',
      height: '14px',
      left: '50%',
      top: '50%',
      backgroundColor: '#797979',
      transform: 'translate(-50%, -50%)',
    },
    ':after': {
      position: 'absolute',
      content: '\'\'',
      width: '4px',
      height: '14px',
      left: '50%',
      top: '50%',
      backgroundColor: '#797979',
      transform: 'translate(-50%, -50%) rotate(90deg)',
    },
  },
  routeMRouteDescrText: {
    fontFamily: 'GilroyBold, sans-serif',
    fontSize: '18px',
    color: '#797979',
    marginTop: '20px',
  },
  routeMRouteFooter: {
    padding: '16px 24px',
    backgroundColor: '#F8F8F8',
  },
  routeMRouteFooterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  routeMRouteFooterToggles: {
    display: 'flex',
    marginLeft: '-6px',
    marginRight: '-6px',
  },
  routeMItem: {
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #E2E2E2',
  },
  routeMDescrEdit: {
    width: '100%',
    height: '150px',
    border: '1px solid #DDE2EF',
    outline: 'none',
    transition: 'box-shadow .4s ease-out',
    resize: 'none',
    padding: '20px 20px',
    boxSizing: 'border-box',
    color: '#3F3F3F',
    fontSize: '16px',
    fontFamily: 'GilroyRegular, sans-serif',
    overflowX: 'hidden',
    marginBottom: '18px',
    ':focus': { boxShadow: '0px 0px 0px 2px rgba(0, 108, 235, 0.7)' },
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
});

RoutesEditModal.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  sectors: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  routeMarkColors: PropTypes.array,
};

const mapStateToProps = state => ({
  sectors: state.sectorsStore.sectors,
  routes: state.routesStoreV2.routes,
  user: state.usersStore.users[state.usersStore.currentUserId],
  users: getArrayByIds(state.usersStore.sortedUserIds, state.usersStore.users),
  routeMarkColors: state.routeMarkColorsStore.routeMarkColors,
});

const mapDispatchToProps = dispatch => ({
  reloadSector: sectorId => dispatch(reloadSectorAction(sectorId)),
  reloadRoutes: (spotId, sectorId) => dispatch(reloadRoutesAction(spotId, sectorId)),
  loadRouteMarkColors: () => dispatch(loadRouteMarkColors()),
  loadUsers: () => dispatch(loadUsers()),
  loadSector: (url, params, afterLoad) => dispatch(loadSector(url, params, afterLoad)),
  loadRoute: (url, afterLoad) => dispatch(loadRoute(url, afterLoad)),
  updateRoute: (url, params, afterSuccess, afterAll) => dispatch(
    updateRoute(url, params, afterSuccess, afterAll),
  ),
  addRoute: (params, afterSuccess, afterAll) => dispatch(addRoute(params, afterSuccess, afterAll)),
  addWallPhoto: (params, afterSuccess, afterAll) => dispatch(
    addWallPhotoAction(params, afterSuccess, afterAll),
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutesEditModal));
