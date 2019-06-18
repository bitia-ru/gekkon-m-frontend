import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Comment from '../Comment/Comment';
import './CommentBlock.css';

const CommentBlock = ({
  user, comments, startAnswer, removeComment,
}) => (
  <div className="comment-block">
    <div className="comment-block__header">
                    Коментарии
    </div>
    <div className="comment-block__list">
      {R.map(comment => (
        <React.Fragment key={comment.id}>
          <Comment
            startAnswer={startAnswer}
            removeComment={removeComment}
            user={user}
            comment={comment}
          />
          {
            R.map(innerComment => (
              <div key={innerComment.id} className="comment-block__inner">
                <Comment
                  startAnswer={startAnswer}
                  removeComment={removeComment}
                  user={user}
                  comment={innerComment}
                />
              </div>
            ), comment.route_comments)}
        </React.Fragment>
      ), comments)}
    </div>
  </div>
);


CommentBlock.propTypes = {
  user: PropTypes.object,
  startAnswer: PropTypes.func.isRequired,
  removeComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
};

CommentBlock.defaultProps = {
  user: null,
};

export default CommentBlock;
