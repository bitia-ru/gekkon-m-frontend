import React from 'react';
import TryptichButtons from '../../common/TriptychButtons/TriptychButtons';


const AscentTriptychLayout = ({
  withFlash,
  ascentCounts,
  loading,
  onClick: onButtonClick,
}) => (
  <TryptichButtons
    loading={loading}
    buttons={
      withFlash ? [
        {
          name: <img src={require('./assets/red_point-black.svg').default} />,
          description: 'Red point',
          onClick() {
            onButtonClick && onButtonClick('red_point');
          },
        },
        {
          default: true,
          name: <img src={require('./assets/flash-white.svg').default} />,
          description: 'Flash',
          onClick() {
            onButtonClick && onButtonClick('flash');
          },
        },
        {
          name: <img src={require('./assets/attempt-black.svg').default} />,
          description: 'Попытка',
          onClick() {
            onButtonClick && onButtonClick('attempt');
          },
        },
      ] : [
        {
          default: true,
          name: (ascentCounts && ascentCounts['success'] !== undefined) ? (
            ascentCounts['success']
          ) : (
            <img src={require('./assets/success-white.svg').default} />
          ),
          description: '+1 пролaз',
          onClick() {
            onButtonClick && onButtonClick('success');
          },
        },
        {
          name: (ascentCounts && ascentCounts['attempt'] !== undefined) ? (
            ascentCounts['attempt']
          ) : (
            <img src={require('./assets/attempt-black.svg').default} />
          ),
          description: '+1 попытка',
          onClick() {
            onButtonClick && onButtonClick('attempt');
          },
        },
      ]
    }
  />
);


export default AscentTriptychLayout;
