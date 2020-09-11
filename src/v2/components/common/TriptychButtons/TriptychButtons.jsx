import React from 'react';
import * as R from 'ramda';
import theme from '../../../theme';
import { StyleSheet, css } from '../../../aphrodite';


const TryptichButtons = ({ buttons, loading }) => (
  <div className={css(style.container)}>
    <div className={css(style.buttonsRow)}>
      {
        R.addIndex(R.map)(
          (button, i) => (
            <div
              key={button.key || i}
              className={css(style.button, button.default && style.defaultButton)}
              onClick={() => { if (typeof button.onClick === 'function') button.onClick(); }}
            >
              <div>
                <div>{button.name}</div>
                <div>{button.description}</div>
              </div>
            </div>
          ),
        )(buttons)
      }
    </div>
    {
      loading && (
        <div className={css(style.loadingRow)}>
          <div className={css(style.loading, loading.active && style.loadingActive)} />
        </div>
      )
    }
  </div>
);

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexFlow: 'column',
    width: '100%',
    alignItems: 'center',
  },
  buttonsRow: {
    display: 'flex',
    flexFlow: 'row',
    width: '100%',
    alignItems: 'center',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '120px',
    backgroundColor: theme.controls.buttons.notDefault.background,
    color: theme.controls.buttons.notDefault.foreground,
    fontFamily: 'GilroyBold',
    '> div': {
      userSelect: 'none',
      '> div': {
        textAlign: 'center',
      },
      '> div:first-child': {
        fontSize: '24px',
      },
    },
    ':hover': {
      backgroundColor: theme.controls.buttons.notDefault.hovered.background,
      color: theme.controls.buttons.notDefault.hovered.foreground,
    },
    ':active': {
      backgroundColor: theme.controls.buttons.notDefault.pressed.background,
      color: theme.controls.buttons.notDefault.pressed.foreground,
    },
    cursor: 'pointer',
  },
  defaultButton: {
    height: '128px',
    paddingLeft: '10px',
    paddingRight: '10px',
    backgroundColor: theme.controls.buttons.default.background,
    color: theme.controls.buttons.default.foreground,
    boxShadow: '0px 6px 6px rgba(0, 34, 74, 0.12)',
    ':hover': {
      backgroundColor: theme.controls.buttons.default.hovered.background,
      color: theme.controls.buttons.default.hovered.foreground,
    },
    ':active': {
      backgroundColor: theme.controls.buttons.default.pressed.background,
      color: theme.controls.buttons.default.pressed.foreground,
    },
  },
  loadingRow: {
    width: '100%',
    marginTop: '2px',
  },
  loading: {
    height: '4px',
    width: '0%',
    backgroundColor: '#d1d1d1',
    transition: 'width 0s',
    opacity: 0,
  },
  loadingActive: {
    width: '100%',
    opacity: 1,
    transition: 'width 1.5s',
  },
});


export default TryptichButtons;
