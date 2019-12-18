import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import * as R from 'ramda';
import Button from '../Button/Button';
import RouteDataEditableTable from '../RouteDataEditableTable/RouteDataEditableTable';
import RouteView from '../RouteView/RouteView';
import RouteEditor from '../RouteEditor/RouteEditor';
import CloseButton from '../CloseButton/CloseButton';
import ButtonHandler from '../ButtonHandler/ButtonHandler';
import CategorySlider from '../CategorySlider/CategorySlider';
import DropDownList from '../DropDownList/DropDownList';
import DropDownPersonList from '../DropDownPersonList/DropDownPersonList';
import { DEFAULT_CATEGORY } from '../../Constants/Categories';
import { ROUTE_KINDS } from '../../Constants/Route';
import RoutePhotoCropper from '../RoutePhotoCropper/RoutePhotoCropper';
import RouteColorPicker from '../RouteColorPicker/RouteColorPicker';
import DatePicker from '../DatePicker/DatePicker';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import ShowSchemeButton from '../ShowSchemeButton/ShowSchemeButton';
import SchemeModal from '../SchemeModal/SchemeModal';
import RouteContext from '../../contexts/RouteContext';
import NewRoute from '../../Constants/NewRoute';
import { avail } from '../../utils';
import { loadRouteMarkColors } from '../../stores/route_mark_colors/utils';
import { loadUsers } from '../../stores/users/utils';
import { loadSector } from '../../stores/sectors/utils';
import { loadRoute } from '../../stores/routes/utils';
import getArrayByIds from '../../utils/getArrayByIds';
import { NUM_OF_DAYS } from '../../Constants/Route';
import { ApiUrl } from '../../Environ';
import './RoutesEditModal.css';

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
      showSlider: false,
      showKindSelect: false,
      showAuthorSelect: false,
      showRouteHoldsColorPicker: false,
      showRouteMarksColorPicker: false,
      showInstalledAtSelect: false,
      showInstalledUntilSelect: false,
      showRouteMark: false,
      routeImageLoading: true,
      schemeModalVisible: false,
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
        `${ApiUrl}/v1/sectors/${sectorId}`,
        params,
        (response) => {
          this.afterSectorIsLoaded(response.data.payload);
        },
      );
    }
    if (routeId === null && sectors[sectorId]) {
      this.afterSectorIsLoaded(sectors[sectorId]);
    }
    if (routeId) {
      loadRouteProp(
        `${ApiUrl}/v1/routes/${this.getRouteId()}`,
        (response) => {
          const route = response.data.payload;
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

  changed = (newValue, oldValue) => JSON.stringify(newValue) !== JSON.stringify(oldValue);

  save = () => {
    const {
      route, photo, currentPointers, currentPointersOld,
    } = this.state;
    const {
      routes, sectors, user, updateRoute, createRoute,
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
      updateRoute(routeId, formData);
    } else {
      createRoute(formData);
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

  saveKind = (id) => {
    this.onRouteParamChange(R.find(R.propEq('id', id), ROUTE_KINDS).title, 'kind');
    this.setState({ showKindSelect: false });
  };

  saveAuthor = (author) => {
    this.onRouteParamChange(author, 'author');
    this.setState({ showAuthorSelect: false });
  };

  onHoldsColorSelect = (holdsColor) => {
    this.onRouteParamChange(holdsColor, 'holds_color');
    this.setState({ showRouteHoldsColorPicker: false });
  };

  onMarksColorSelect = (marksColor) => {
    this.onRouteParamChange(marksColor, 'marks_color');
    this.setState({ showRouteMarksColorPicker: false });
  };

  render() {
    const {
      onClose,
      user,
      users,
      routeMarkColors,
      cancel,
      isWaiting,
    } = this.props;
    const {
      photo,
      route,
      currentPointers,
      fieldsOld,
      currentPointersOld,
      showCropper,
      showSlider,
      showKindSelect,
      showAuthorSelect,
      showRouteHoldsColorPicker,
      showRouteMarksColorPicker,
      showInstalledAtSelect,
      showInstalledUntilSelect,
      showRouteMark,
      routeImageLoading,
      schemeModalVisible,
    } = this.state;
    const routeChanged = JSON.stringify(route) !== JSON.stringify(fieldsOld);
    const pointersChanged = JSON.stringify(currentPointers) !== JSON.stringify(currentPointersOld);
    const saveDisabled = (!routeChanged && !pointersChanged);
    const btnHandlerImage = require('../../../../img/btn-handler/btn-handler-sprite.svg');
    const routeId = this.getRouteId();
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
                  <div className="route-m">
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
                        user={user}
                        showKindSelect={() => this.setState({ showKindSelect: true })}
                        showCategorySlider={() => this.setState({ showSlider: true })}
                        showAuthorSelect={() => this.setState({ showAuthorSelect: true })}
                        showRouteHoldsColorPicker={
                          () => this.setState({ showRouteHoldsColorPicker: true })
                        }
                        showRouteMarksColorPicker={
                          () => this.setState({ showRouteMarksColorPicker: true })
                        }
                        showInstalledAtSelect={
                          () => this.setState({ showInstalledAtSelect: true })
                        }
                        showInstalledUntilSelect={
                          () => this.setState({ showInstalledUntilSelect: true })
                        }
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
                          onClick={() => cancel(routeId)}
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
              showSlider && (
                <CategorySlider
                  category={route.category}
                  hide={() => this.setState({ showSlider: false })}
                  changeCategory={category => this.onRouteParamChange(category, 'category')}
                />
              )
            }
            {
              showKindSelect && (
                <DropDownList
                  hide={() => this.setState({ showKindSelect: false })}
                  onClick={this.saveKind}
                  items={ROUTE_KINDS}
                  textFieldName="text"
                />
              )
            }
            {
              showAuthorSelect && (
                <DropDownPersonList
                  hide={() => this.setState({ showAuthorSelect: false })}
                  onClick={this.saveAuthor}
                  users={users}
                />
              )
            }
            {
              showRouteHoldsColorPicker && (
                <RouteColorPicker
                  hide={() => this.setState({ showRouteHoldsColorPicker: false })}
                  routeMarkColors={routeMarkColors}
                  onClick={this.onHoldsColorSelect}
                />
              )
            }
            {
              showRouteMarksColorPicker && (
                <RouteColorPicker
                  hide={() => this.setState({ showRouteMarksColorPicker: false })}
                  routeMarkColors={routeMarkColors}
                  onClick={this.onMarksColorSelect}
                />
              )
            }
            {
              showInstalledAtSelect && (
                <DatePicker
                  hide={() => this.setState({ showInstalledAtSelect: false })}
                  date={route.installed_at ? moment(route.installed_at) : null}
                  onSelect={
                    date => this.onRouteParamChange(date ? date.format() : null, 'installed_at')
                  }
                />
              )
            }
            {
              showInstalledUntilSelect && (
                <DatePicker
                  hide={() => this.setState({ showInstalledUntilSelect: false })}
                  date={route.installed_until ? moment(route.installed_until) : null}
                  onSelect={
                    date => this.onRouteParamChange(date ? date.format() : null, 'installed_until')
                  }
                />
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

RoutesEditModal.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  sectors: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  createRoute: PropTypes.func.isRequired,
  updateRoute: PropTypes.func.isRequired,
  isWaiting: PropTypes.bool.isRequired,
  routeMarkColors: PropTypes.array,
};

const mapStateToProps = state => ({
  sectors: state.sectorsStore.sectors,
  routes: state.routesStore.routes,
  user: state.usersStore.users[state.usersStore.currentUserId],
  users: getArrayByIds(state.usersStore.sortedUserIds, state.usersStore.users),
  routeMarkColors: state.routeMarkColorsStore.routeMarkColors,
});

const mapDispatchToProps = dispatch => ({
  loadRouteMarkColors: () => dispatch(loadRouteMarkColors()),
  loadUsers: () => dispatch(loadUsers()),
  loadSector: (url, params, afterLoad) => dispatch(loadSector(url, params, afterLoad)),
  loadRoute: (url, afterLoad) => dispatch(loadRoute(url, afterLoad)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutesEditModal));
