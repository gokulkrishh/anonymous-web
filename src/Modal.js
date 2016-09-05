import React, { Component } from "react";
import firebase from "firebase";

export default class Modal extends Component {
  static defaultProps = {
    showModal: false
  }

  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.leaveChat = this.leaveChat.bind(this);
    this.firebaseRef = null;
  }

  leaveChat() {
    const {chatURL, otherUserId} = this.props;
    this.firebaseRef = firebase.database();
    if (chatURL) {
      this.firebaseRef.ref("chats/" + chatURL).remove();
    }
    if (otherUserId) {
      this.firebaseRef.ref("chats/user_" + otherUserId).remove();
    }
    this.close();
  }

  close() {
    this.props.hideModal();
  }

  render() {
    const {showModal} = this.props;
    return(
      <div className="modal__container">
      {
        showModal && (<div className="modal__dialog">
        <div className="modal__dialog-overlay" onClick={this.close}></div>
        <div className="modal__dialog-content">
          <h4 className="mdl-dialog__title">Leave chat</h4>
          <p>Are you sure, you want to leave this chat ?</p>
          <div className="modal__dialog-actions">
            <button type="button" onClick={this.leaveChat}>Leave</button>
            <button type="button" onClick={this.close}>Cancel</button>
          </div>
        </div>
      </div>)
      }
      </div>
    );
  }
}
