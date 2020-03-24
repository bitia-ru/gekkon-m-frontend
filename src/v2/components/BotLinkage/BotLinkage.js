import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { currentUser as currentUserObtainer } from '@/v2/redux/user_session/utils';
import { updateUser as updateUserAction } from '@/v2/redux/users/actions';
import showToastr from '@/v2/utils/showToastr';

class BotLinkage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    const {
      user, updateUser, history,
    } = this.props;
    const url = new URL(window.location.href);
    const telegramId = url.searchParams.get('chat_id');
    if (user) {
      updateUser(
        user.id,
        {
          data: {
            ...user.data,
            telegram_id: telegramId,
          },
        },
        () => {
          showToastr(
            'Бот подключен',
            {
              type: 'success',
              after: () => {
                window.location.href = '/';
              },
            },
          );
        },
        () => {
          showToastr('Ошибка подключения бота', { type: 'error' });
        },
      );
    } else {
      history.push('/#signin', { prevUrl: window.location.href });
    }
  }

  render() {
    return (
      <>Загрузка...</>
    );
  }
}

const mapStateToProps = state => ({
  user: currentUserObtainer(state),
});

const mapDispatchToProps = dispatch => ({
  updateUser: (id, params, afterSuccess, afterFail) => dispatch(
    updateUserAction(id, params, afterSuccess, afterFail),
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BotLinkage));
