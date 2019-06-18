import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import AvatarRound from '../AvatarRound/AvatarRound';
import timeFromNow from '../Constants/DateTimeFormatter';
import './Comment.css';

const Comment = ({
  user, comment, startAnswer, removeComment,
}) => {
  const createdAt = new Date(comment.created_at);
  return (
    <div className="comment">
      <AvatarRound user={comment.author} />
      <div className="comment__content">
        <a className="comment__name">
          {
            comment.author.name
              ? comment.author.name
              : comment.author.login
          }
        </a>
        <div className="comment__text">{comment.content}</div>
        <div className="comment__footer">
          <div className="comment__date">
            {timeFromNow(moment(createdAt))}
          </div>
          {
            (user && (user.name || user.login))
              ? (
                <React.Fragment>
                  <a
                    role="link"
                    tabIndex="0"
                    style={{ outline: 'none' }}
                    className="comment__answer"
                    onClick={() => startAnswer(comment)}
                  >
                                      Ответить
                  </a>
&nbsp;
                </React.Fragment>
              )
              : ''
          }
          {
            (user && (user.id === comment.author_id || user.role === 'admin'))
              ? (
                <a
                  role="link"
                  tabIndex="0"
                  style={{ outline: 'none' }}
                  className="comment__answer"
                  onClick={() => removeComment(comment)}
                >
                                  Удалить
                </a>
              )
              : ''
          }
        </div>

      </div>
    </div>
  );
};

Comment.propTypes = {
  user: PropTypes.object,
  startAnswer: PropTypes.func.isRequired,
  removeComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
};

Comment.defaultProps = {
  user: null,
};

export default Comment;
