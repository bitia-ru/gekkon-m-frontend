import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Button from '@/v1/components/Button/Button';
import RouteDataEditableTable from '@/v2/components/RouteDataEditableTable/RouteDataEditableTable';
import RouteView from '@/v1/components/RouteView/RouteView';
import RouteEditor from '@/v1/components/RouteEditor/RouteEditor';
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import ButtonHandler from '@/v1/components/ButtonHandler/ButtonHandler';
import { DEFAULT_CATEGORY } from '@/v1/Constants/Categories';
import { NUM_OF_DAYS } from '@/v1/Constants/Route';
import RoutePhotoCropper from '@/v1/components/RoutePhotoCropper/RoutePhotoCropper';
import ScrollToTopOnMount from '@/v1/components/ScrollToTopOnMount';
import ShowSchemeButton from '@/v1/components/ShowSchemeButton/ShowSchemeButton';
import SchemeModal from '@/v1/components/SchemeModal/SchemeModal';
import RouteContext from '@/v1/contexts/RouteContext';
import NewRoute from '@/v1/Constants/NewRoute';
import { avail } from '@/v1/utils';
import { loadRouteMarkColors } from '@/v1/stores/route_mark_colors/utils';
import { loadUsers } from '@/v1/stores/users/utils';
import { loadSector } from '@/v1/stores/sectors/utils';
import { addRoute, loadRoute, updateRoute } from '@/v2/redux/routes/actions';
import getArrayByIds from '@/v1/utils/getArrayByIds';
import { reloadSector as reloadSectorAction } from '@/v1/utils/reloadSector';
import { default as reloadRoutesAction } from '@/v2/utils/reloadRoutes';
import './RoutesEditModal.css';
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
        content: null, file: null, crop: null, rotate: null,
      },
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
      () => history.push(R.replace('/edit', '', `${match.url}`)),
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
        history.push(
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
      route, photo, currentPointers, currentPointersOld,
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
    if (route.photo !== (routeProp.photo ? routeProp.photo.url : null)) {
      formData.append('route[photo]', route.photoFile);
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
    const onFileRead = () => {
      const { photo } = this.state;
      photo.content = this.fileReader.result;
      this.setState({ showCropper: true, photo });
    };

    // TODO: There is a time gap between file had been chosen and had been read. Fill this gap with
    //       sort of spinner.

    this.fileReader = new FileReader();
    this.fileReader.onloadend = onFileRead;
    this.fileReader.readAsDataURL(file);
    const { photo } = this.state;
    photo.file = file;
    this.setState({ photo });
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
    route.photo = src;
    route.photoFile = photo.file;
    const photoCopy = R.clone(photo);
    if (this.noCrop(crop, image)) {
      photoCopy.crop = null;
      photoCopy.rotate = (rotate === 0 ? null : rotate);
      this.setState({ route, showCropper: false, photo: photoCopy });
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
      this.setState({ route, showCropper: false, photo: photoCopy });
    }
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
          avail(route) && <>
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
                    src={photo.content}
                    close={() => this.setState({ showCropper: false })}
                    save={this.saveCropped}
                  />
                )
                : (
                  <div className={css(styles.routeM)}>
                    <div className="route-m__container">
                      <div className="route-m__block">
                        <div className="route-m__close">
                          <CloseButton onClick={() => onClose()} />
                        </div>
                      </div>
                      <h1 className="route-m__title" style={{ marginTop: '0px' }}>
                        №
                        {' '}
                        <input
                          type="text"
                          onChange={event => this.onRouteParamChange(event.target.value, 'number')}
                          className="route-m__title-input route-m__title-input_dark"
                          value={route.number === null ? '' : route.number}
                        />
                        <span className="route-m__title-place-wrapper">
                          <span className="route-m__title-place-edit">(“</span>
                          <input
                            type="text"
                            onChange={event => this.onRouteParamChange(event.target.value, 'name')}
                            className="route-m__title-input"
                            value={route.name === null ? '' : route.name}
                          />
                          <span className="route-m__title-place-edit">”)</span>
                        </span>
                      </h1>
                    </div>
                    <div className="route-m__route-block">
                      <div className="route-m__route">
                        {
                          (!route.photo || !routeImageLoading) && (
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
                      <div className="route-m__route-footer">
                        <div className="route-m__route-footer-container">
                          <div className="route-m__route-footer-toggles">
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
                          <div className="route-m__route-footer-toggles">
                            <input
                              type="file"
                              hidden
                              ref={(ref) => {
                                this.fileInput = ref;
                              }}
                              onChange={event => this.onNewPhotoFileSelected(event.target.files[0])}
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
                                      onClick={() => this.onRouteParamChange(null, 'photo')}
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
                    <div className="route-m__container">
                      <RouteDataEditableTable
                        onRouteParamChange={this.onRouteParamChange}
                        routeMarkColors={routeMarkColors}
                        users={users}
                      />
                    </div>
                    <div className="route-m__item">
                      <div className="collapsable-block-m">
                        <button type="button" className="collapsable-block-m__header">
                          Описание
                        </button>
                        <textarea
                          className="route-m__descr-edit"
                          onChange={
                            event => this.onRouteParamChange(event.target.value, 'description')
                          }
                          value={route.description ? route.description : ''}
                        />
                      </div>
                    </div>
                    <div className="route-m__route-controls">
                      <div className="route-m__btn-delete">
                        <Button
                          size="big"
                          buttonStyle="gray"
                          title="Отмена"
                          smallFont
                          onClick={cancel}
                        />
                      </div>
                      <div className="track-m__btn-save">
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
          </>
        }
      </RouteContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  routeM: {
    height: '100%',
    overflowY: 'auto',
    backgroundColor: '#FFFFFF',
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
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutesEditModal));
