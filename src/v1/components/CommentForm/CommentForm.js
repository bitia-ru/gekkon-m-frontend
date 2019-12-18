import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AvatarRound from '../AvatarRound/AvatarRound';
import Button from '../Button/Button';
import './CommentForm.css';

export default class CommentForm extends Component {
    cancel = () => {
      const { removeQuoteComment, onContentChange } = this.props;
      removeQuoteComment();
      onContentChange('');
    };

    setTextAreaRef = (ref) => {
      const { setTextareaRef } = this.props;
      setTextareaRef(ref);
    };

    render() {
      const {
        user, content, quoteComment, removeQuoteComment, goToProfile, onContentChange, saveComment,
      } = this.props;
      return (
        <div className="comment-form">
          {
            quoteComment
              ? (
                <div className="comment-form__answer">
                  <div className="comment-form__answer-content">
                    <div className="comment-form__answer-author">
                      {quoteComment.author.name}
                    </div>
                    <div className="comment-form__answer-text">
                      {quoteComment.content}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="comment-form__answer-close"
                    onClick={removeQuoteComment}
                  />
                </div>
              )
              : ''
          }
          <div className="comment-form__inner-wrap">
            <AvatarRound user={user} />
            {
              (user && !user.login && !user.name)
                ? (
                  <a
                    role="link"
                    tabIndex="0"
                    style={{ outline: 'none' }}
                    className="comment-form__input comment-form__link"
                    onClick={goToProfile}
                  >
                    Для комментирования задайте имя или логин
                  </a>
                )
                : (
                  <textarea
                    className={`comment-form__input${
                      content === ''
                        ? ''
                        : ' comment-form__input_active'
                    }`}
                    ref={this.setTextAreaRef}
                    disabled={!(user && (user.login || user.name))}
                    placeholder={
                      user
                        ? 'Комментировать...'
                        : 'Залогиньтесь, чтобы написать комментарий'
                    }
                    value={content}
                    onChange={event => onContentChange(event.target.value)}
                  />
                )
            }
          </div>
          {
            content === ''
              ? ''
              : (
                <div className="comment-form__btn-wrap">
                  <Button
                    customClass="btn-m btn-m_transparent comment-form__btn-cancel"
                    title="Отмена"
                    onClick={this.cancel}
                  />
                  <Button
                    customClass="btn-m comment-form__btn-send"
                    title="Отправить"
                    onClick={() => saveComment(quoteComment ? quoteComment.id : null)}
                  />
                </div>
              )
          }
        </div>
      );
    }
}

CommentForm.propTypes = {
  user: PropTypes.object,
  quoteComment: PropTypes.object,
  content: PropTypes.string.isRequired,
  saveComment: PropTypes.func.isRequired,
  onContentChange: PropTypes.func.isRequired,
  goToProfile: PropTypes.func.isRequired,
  setTextareaRef: PropTypes.func.isRequired,
  removeQuoteComment: PropTypes.func.isRequired,
};

CommentForm.defaultProps = {
  quoteComment: null,
};
