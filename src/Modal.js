import React, { Component } from 'react';

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

  componentWillMount() {
    const chatData = JSON.parse(localStorage.getItem("chat"));
    this.firebaseRef = firebase.database().ref("chat" + chatData.chatName);
  }

  leaveChat() {
    this.props.updateStatusCallback("disconnected");
    this.firebaseRef.remove();
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
