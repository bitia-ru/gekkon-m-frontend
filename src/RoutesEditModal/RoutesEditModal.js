import React, { Component } from 'react';
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
import { DEFAULT_CATEGORY } from '../Constants/Categories';
import { ROUTE_KINDS } from '../Constants/Route';
import RoutePhotoCropper from '../RoutePhotoCropper/RoutePhotoCropper';
import RouteColorPicker from '../RouteColorPicker/RouteColorPicker';
import DatePicker from '../DatePicker/DatePicker';
import btnHandlerImage from '../../img/btn-handler/btn-handler-sprite.svg';
import pointImage from '../../img/route-img/point.svg';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import './RoutesEditModal.css';

export default class RoutesEditModal extends Component {
  constructor(props) {
    super(props);

    const { route } = this.props;
    this.state = {
      currentPointers: [],
      currentPointersOld: [],
      route: R.clone(route),
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
    };
  }

  componentDidMount() {
    const { route } = this.state;
    const routeCurr = R.clone(route);
    if (route.photo) {
      routeCurr.photo = routeCurr.photo.url;
    }
    if (route.category === null) {
      routeCurr.category = DEFAULT_CATEGORY;
    }
    this.setState({ fieldsOld: routeCurr, route: R.clone(routeCurr) });
    this.loadPointers();
  }

  changed = (newValue, oldValue) => JSON.stringify(newValue) !== JSON.stringify(oldValue);

  save = () => {
    const {
      route, photo, currentPointers, currentPointersOld,
    } = this.state;
    const {
      route: routeProp, sector, user, updateRoute, createRoute,
    } = this.props;
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
      updateRoute(formData);
    } else {
      createRoute(formData);
    }
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
    this.setState({ currentPointers: pointers, currentPointersOld: pointers });
  };

  updatePointers = (pointers) => {
    this.setState({ currentPointers: pointers });
  };

  onRouteParamChange = (value, paramName) => {
    const { route } = this.state;
    route[paramName] = value;
    if (paramName === 'author') {
      route.author_id = value ? value.id : null;
    }
    if (paramName === 'photo' && value === null) {
      route.photoFile = null;
    }
    this.setState({ route });
  };

  onFileRead = () => {
    const { photo } = this.state;
    photo.content = this.fileReader.result;
    this.setState({ showCropper: true, photo });
  };

  onFileChosen = (file) => {
    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.onFileRead;
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
    if (this.noCrop(crop, image)) {
      const photoCopy = R.clone(photo);
      photoCopy.crop = null;
      photoCopy.rotate = (rotate === 0 ? null : rotate);
      this.setState({ route, showCropper: false, photo: photoCopy });
    } else {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const photoCopy = R.clone(photo);
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
      sector,
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
    } = this.state;
    const routeChanged = JSON.stringify(route) !== JSON.stringify(fieldsOld);
    const pointersChanged = JSON.stringify(currentPointers) !== JSON.stringify(currentPointersOld);
    const saveDisabled = (!routeChanged && !pointersChanged);
    return (
      <>
        <ScrollToTopOnMount />
        {
          showRouteMark
            ? (
              <RouteEditor
                route={route}
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
                  </div>
                  <div className="route-m__route-footer">
                    <div className="route-m__route-footer-container">
                      <div className="route-m__route-footer-toggles">
                        {
                          route.photo && (
                            <ButtonHandler
                              onClick={() => this.setState({ showRouteMark: true })}
                              title="Просмотр трассы"
                              xlinkHref={`${pointImage}#point`}
                            />
                          )
                        }
                      </div>
                      <div className="route-m__route-footer-toggles">
                        <input
                          type="file"
                          hidden
                          ref={(ref) => { this.fileInput = ref; }}
                          onChange={event => this.onFileChosen(event.target.files[0])}
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
                    route={route}
                    sector={sector}
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
                    showInstalledAtSelect={() => this.setState({ showInstalledAtSelect: true })}
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
                      onChange={event => this.onRouteParamChange(event.target.value, 'description')}
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
      </>
    );
  }
}

RoutesEditModal.propTypes = {
  user: PropTypes.object,
  route: PropTypes.object.isRequired,
  sector: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  createRoute: PropTypes.func.isRequired,
  updateRoute: PropTypes.func.isRequired,
  isWaiting: PropTypes.bool.isRequired,
  routeMarkColors: PropTypes.array.isRequired,
};
