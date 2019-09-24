import moment from 'moment/moment';

const NEWS = [
  {
    id: 1,
    user: {
      name: 'User 1',
      avatar: {
        url: '/public/img/user-icon/avatar.jpg',
      },
    },
    message: 'Message about User 1',
    title: 'Short text',
    routes: [
      {
        id: 1,
        category: '5a',
        holds_color: {
          id: 1,
          color: '#ff0000',
          photo: null,
        },
      },
      {
        id: 2,
        category: '5a',
        holds_color: {
          id: 1,
          color: '#ff0000',
          photo: null,
        },
      },
      {
        id: 3,
        category: '6a',
        holds_color: {
          id: 2,
          color: '#00ff00',
          photo: null,
        },
      },
    ],
    time: moment().format(),
  },
  {
    id: 2,
    user: {
      name: 'User 2',
    },
    message: 'Message about User 2',
    title: 'Short text',
    routes: [
      {
        id: 1,
        category: '5a',
        holds_color: {
          id: 1,
          color: '#ff0000',
          photo: null,
        },
      },
    ],
    time: moment().subtract(1, 'minutes').format(),
  },
  {
    id: 3,
    user: {
      name: 'User 3',
    },
    message: 'Message about User 3',
    title: 'Long long long long long text',
    routes: [
      {
        id: 1,
        category: '7a',
        holds_color: {
          id: 1,
          color: '#00ff00',
          photo: null,
        },
      },
    ],
    time: moment().subtract(10, 'minutes').format(),
  },
  {
    id: 4,
    user: {
      name: 'User 4',
    },
    message: 'Message about User 4',
    title: 'Very long story with many letters and word that are trying to tell smth',
    routes: [
      {
        id: 1,
        category: '5a',
        holds_color: {
          id: 1,
          color: '#ff0000',
          photo: null,
        },
      },
    ],
    time: moment().subtract(1, 'hours').format(),
  },
];

export { NEWS as default };
