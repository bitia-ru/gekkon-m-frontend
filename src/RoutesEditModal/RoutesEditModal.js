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
import { CATEGORIES } from '../Constants/Categories';
import { ROUTE_KINDS } from '../Constants/Route';
import RoutePhotoCropper from '../RoutePhotoCropper/RoutePhotoCropper';
import RouteColorPicker from '../RouteColorPicker/RouteColorPicker';
import DatePicker from '../DatePicker/DatePicker';
import btnHandlerImage from '../../img/btn-handler/btn-handler-sprite.svg';
import pointImage from '../../img/route-img/point.svg';
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
    };
  }

  componentDidMount() {
    const { route } = this.state;
    const routeCurr = R.clone(route);
    if (route.photo) {
      routeCurr.photo = routeCurr.photo.url;
    }
    if (route.category === null) {
      routeCurr.category = CATEGORIES[6];
    }
    this.setState({ fieldsOld: routeCurr, route: R.clone(routeCurr) });
    this.loadPointers();
  }

  changed = (newValue, oldValue) => JSON.stringify(newValue) !== JSON.stringify(oldValue);

  save = () => {
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
    const pointersChanged = this.changed(this.state.currentPointers, this.state.currentPointersOld);
    const holdsColorsChanged = this.changed(this.props.route.holds_color, this.state.route.holds_color);
    const marksColorsChanged = this.changed(this.props.route.marks_color, this.state.route.marks_color);
    if (pointersChanged || holdsColorsChanged || marksColorsChanged) {
      const x = R.map(pointer => pointer.x, this.state.currentPointers);
      const y = R.map(pointer => pointer.y, this.state.currentPointers);
      const angle = R.map(pointer => pointer.angle, this.state.currentPointers);
      if (this.state.route.holds_color) {
        formData.append('route[mark][colors][holds]', this.state.route.holds_color.id);
      }
      if (this.state.route.marks_color) {
        formData.append('route[mark][colors][marks]', this.state.route.marks_color.id);
      }
      for (const i in x) {
        formData.append('route[mark][pointers][x][]', x[i]);
        formData.append('route[mark][pointers][y][]', y[i]);
        formData.append('route[mark][pointers][angle][]', angle[i]);
      }
    }
    for (const i in paramList) {
      if (this.props.route[paramList[i]] !== this.state.route[paramList[i]]) {
        formData.append(`route[${paramList[i]}]`, this.state.route[paramList[i]]);
      }
    }
    if (this.state.route.id === null) {
      formData.append('route[sector_id]', this.state.route.sector_id);
      if (this.props.sector.kind !== 'mixed') {
        formData.append('route[kind]', this.state.route.kind);
      }
    }
    if (this.state.route.photo !== (this.props.route.photo ? this.props.route.photo.url : null)) {
      formData.append('route[photo]', this.state.route.photoFile);
    }
    if (this.state.photo.crop !== null) {
      formData.append('data[photo][cropping][x]', Math.round(this.state.photo.crop.x));
      formData.append('data[photo][cropping][y]', Math.round(this.state.photo.crop.y));
      formData.append('data[photo][cropping][width]', Math.round(this.state.photo.crop.width));
      formData.append('data[photo][cropping][height]', Math.round(this.state.photo.crop.height));
    }
    if (this.state.photo.rotate !== null) {
      formData.append('data[photo][rotation]', this.state.photo.rotate);
    }
    if (this.props.route.data.personal || this.props.user.id === this.state.route.author_id) {
      formData.append('data[personal]', true);
    }
    if (this.props.route.id !== null) {
      this.props.updateRoute(formData);
    } else {
      this.props.createRoute(formData);
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
    const photo = R.clone(this.state.photo);
    photo.content = this.fileReader.result;
    this.setState({ showCropper: true, photo });
  };

  onFileChosen = (file) => {
    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.onFileRead;
    this.fileReader.readAsDataURL(file);
    const photo = R.clone(this.state.photo);
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
    } = this.state;
    const saveDisabled = (JSON.stringify(route) === JSON.stringify(fieldsOld) && JSON.stringify(currentPointers) === JSON.stringify(currentPointersOld));
    return (
      <React.Fragment>
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
                    <div className="route-m__route-descr">
                      <div className="route-m__route-descr-picture" />
                      <div className="route-m__route-descr-text">
                        Загрузите фото трассы
                      </div>
                    </div>
                    {
                      route.photo
                        ? (
                          <RouteView
                            route={route}
                            routePhoto={
                              typeof (route.photo) === 'string'
                                ? route.photo
                                : route.photo.url
                            }
                            pointers={currentPointers}
                          />
                        )
                        : ''
                    }
                  </div>
                  <div className="route-m__route-footer">
                    <div className="route-m__route-footer-container">
                      <div className="route-m__route-footer-toggles">
                        {
                          route.photo
                            ? (
                              <ButtonHandler
                                onClick={() => this.setState({ showRouteMark: true })}
                                title="Просмотр трассы"
                                xlinkHref={`${pointImage}#point`}
                              />
                            )
                            : ''
                        }
                      </div>
                      <div className="route-m__route-footer-toggles">
                        <input
                          type="file"
                          hidden
                          ref={(ref) => { this.fileInput = ref; return true; }}
                          onChange={event => this.onFileChosen(event.target.files[0])}
                        />
                        {
                          route.photo
                            ? (
                              <React.Fragment>
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
                              </React.Fragment>
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
          showSlider
            ? (
              <CategorySlider
                category={route.category}
                hide={() => this.setState({ showSlider: false })}
                changeCategory={category => this.onRouteParamChange(category, 'category')}
              />
            )
            : ''
        }
        {
          showKindSelect
            ? (
              <DropDownList
                hide={() => this.setState({ showKindSelect: false })}
                onClick={this.saveKind}
                items={ROUTE_KINDS}
                textFieldName="text"
              />
            )
            : ''
        }
        {
          showAuthorSelect
            ? (
              <DropDownPersonList
                hide={() => this.setState({ showAuthorSelect: false })}
                onClick={this.saveAuthor}
                users={users}
              />
            )
            : ''
        }
        {
          showRouteHoldsColorPicker
            ? (
              <RouteColorPicker
                hide={() => this.setState({ showRouteHoldsColorPicker: false })}
                routeMarkColors={routeMarkColors}
                onClick={this.onHoldsColorSelect}
              />
            )
            : ''
        }
        {
          showRouteMarksColorPicker
            ? (
              <RouteColorPicker
                hide={() => this.setState({ showRouteMarksColorPicker: false })}
                routeMarkColors={routeMarkColors}
                onClick={this.onMarksColorSelect}
              />
            )
            : ''
        }
        {
          showInstalledAtSelect
            ? (
              <DatePicker
                hide={() => this.setState({ showInstalledAtSelect: false })}
                date={route.installed_at ? moment(route.installed_at) : null}
                onSelect={
                  date => this.onRouteParamChange(date ? date.format() : null, 'installed_at')
                }
              />
            )
            : ''
        }
        {
          showInstalledUntilSelect
            ? (
              <DatePicker
                hide={() => this.setState({ showInstalledUntilSelect: false })}
                date={route.installed_until ? moment(route.installed_until) : null}
                onSelect={
                  date => this.onRouteParamChange(date ? date.format() : null, 'installed_until')
                }
              />
            )
            : ''
        }
      </React.Fragment>
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

RoutesEditModal.defaultProps = {
  user: null,
};
