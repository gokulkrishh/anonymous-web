import React, { Component } from 'react';
import firebase from 'firebase';

export default class Modal extends Component {
  static defaultProps = {
    showModal: false
  }

  constructor(props) {
    super(props);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.leaveChat = this.leaveChat.bind(this);
    this.firebaseRef = null;
    this.state = {
      show: false
    }
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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showModal) {
      this.showModal();
    }
    else {
      this.hideModal();
    }
  }

  hideModal() {
    this.setState({
      show: false
    });
  }

  showModal() {
    this.setState({
      show: true
    });
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  render() {
    const {show} = this.state;
    return(
      <div>
      {
        show && (<div className="modal-dialog">
        <div className="modal-dialog-overlay" onClick={this.hideModal}></div>
        <div className="modal-dialog-content">
          <h4 className="mdl-dialog__title">Leave chat</h4>
          <p>Are you sure, you want to leave this chat ?</p>
          <div className="modal-dialog-actions">
            <button type="button" className="mdl-button close-chat" onClick={this.leaveChat}>Leave</button>
            <button type="button" className="mdl-button" onClick={this.hideModal}>Cancel</button>
          </div>
        </div>
      </div>)
      }
      </div>
    );
  }
}
