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
    this.state = {
      show: false
    }
  }

  leaveChat() {
    const {otherUserId, chatUrl} = this.props;
    if (chatUrl) {
      firebase.database().ref("chats/chat_" + chatUrl).remove();
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

  render() {
    const {show} = this.state;
    return(
      <div>
      {
        show && (<div className="modal-dialog">
        <div className="modal-dialog-overlay" onClick={this.hideModal}></div>
        <div className="modal-dialog-content">
          <h4>Leave chat</h4>
          <p>Are you sure, you want to leave this chat ?</p>

          <div className="modal-dialog-actions">
            <button type="button" className="mdl-button" onClick={this.hideModal}>Cancel</button>
            <button type="button" className="mdl-button close-chat" onClick={this.leaveChat}>Leave</button>
          </div>
        </div>
      </div>)
      }
      </div>
    );
  }
}
