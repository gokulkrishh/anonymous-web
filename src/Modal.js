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
    const {chatUrl, otherUserId} = this.props;
    this.firebaseRef = firebase.database();
    if (chatUrl) {
      this.firebaseRef.ref("chats/chat_" + chatUrl).remove();
    }
    if (otherUserId) {
      this.firebaseRef.ref("chats/chat_" + otherUserId).remove();
    }
    localStorage.removeItem("chat");
    this.close(); 
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  close() {
    this.props.hideModal();
  }

  render() {
    const {showModal} = this.props;
    return(
      <div className="modal-container">
      {
        showModal && (<div className="modal-dialog">
        <div className="modal-dialog-overlay" onClick={this.close}></div>
        <div className="modal-dialog-content">
          <h4 className="mdl-dialog__title">Leave chat</h4>
          <p>Are you sure, you want to leave this chat ?</p>
          <div className="modal-dialog-actions">
            <button type="button" className="mdl-button" onClick={this.leaveChat}>Leave</button>
            <button type="button" className="mdl-button" onClick={this.close}>Cancel</button>
          </div>
        </div>
      </div>)
      }
      </div>
    );
  }
}
