import React, { Component } from "react";
import reactMixin from "react-mixin";
import Message from "./Message";
import Header from "./Header";
import Modal from "./Modal";
import Input from "./Input";
import Spinner from "./Spinner";
import Intro from "./Intro";
var firebase = require("firebase");
import ReactFireMixin from "reactfire";

const config = require("./config.json");
firebase.initializeApp(config);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.closeChat = this.closeChat.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
    this.initializeChat = this.initializeChat.bind(this);
    this.showSpinner = this.showSpinner.bind(this);
    this.offlineEvent = this.offlineEvent.bind(this);
    this.showIntroCallback = this.showIntroCallback.bind(this);
    this.hideIntroCallback = this.hideIntroCallback.bind(this);
    this.firebaseChatsRef = null;
    this.firebaseDB = firebase.database();
    this.addChat = null;
    this.isUserVisitedBefore = !localStorage.getItem("visited");
    /*eslint new-parens: 0*/
    this.userID = window.navigator.userAgent.replace(/\D+/g, "");
    this.state = {
      chats: [],
      userID: this.userID,
      chatURL: null,
      showIntro: this.isUserVisitedBefore,
      otherUserID: null,
      showCloseBtn: false,
      showModal: false,
      showSpinner: true
    };
  }

  componentWillMount() {
    var isVisitedBefore = this.checkForPreviousVisits();
    if (!isVisitedBefore) {
      this.offlineEvent();
      this.checkFirebaseConnection();
      this.initializeChat();
    }
  }

  checkFirebaseConnection() {
    this.firebaseConnection = this.firebaseDB.ref(".info/connected");
    this.firebaseConnection.on("value", (snap) => {
      if (snap.val() === true) {
        if (this.addChat) {
          this.addChat.onDisconnect().remove();
        }
        this.firebaseUserRef.update({
          status: "online"
        });
        this.firebaseUserRef.onDisconnect().remove();
      }
    });
  }

  offlineEvent() {
    window.addEventListener("offline", () => {
      this.setState({
        status: "no internet",
        spinnerText: "No internet connection"
      });
    });

    window.addEventListener("online", () => {
      this.setState({
        status: "connected",
        spinnerText: "Looking for anonymous.."
      });
    });
  }

  initializeChat() {
    const {userID} = this.state;
    this.setState({
      chatURL: "",
      status: "connecting...",
      spinnerText: "Looking for anonymous..",
      showCloseBtn: false,
      showModal: false,
      showSpinner: true
    });
    this.firebaseChatsRef = this.firebaseDB.ref("chats");
    this.firebaseUserRef = this.firebaseDB.ref("chats/user_" + userID);
    this.addToQueue();
  }

  checkForPreviousVisits() {
    const {showIntro} = this.state;
    if (showIntro) {
      localStorage.setItem("visited", true);
      return true;
    }
    else {
      return false;
    }
  }

  removeConnection() {
    const {chatURL, userID} = this.state;
    if (this.firebaseDB.ref("chats/user_" + userID)) {
      this.firebaseDB.ref("chats/user_" + userID).remove();
    }

    if (chatURL && this.firebaseDB.ref("chats/" + chatURL)) {
      this.firebaseDB.ref("chats/" + chatURL).remove();
    }
    this.initializeChat();
  }

  removeUserFromQueue(chatURL) {
    const {userID} = this.state;
    this.firebaseUserRef.update({
      id: userID,
      isQueued: false
    });
  }

  addChatConnection(chatURL) {
    this.addChat = this.firebaseDB.ref("chats/" + chatURL);
    this.addChat.update({
      connection: true
    });
    this.checkFirebaseConnection();
    this.listenToTyping();
  }

  checkForOpenConnection() {
    const {userID} = this.state;
    this.firebaseChatsRef.orderByChild("chat_").on("value", (snapshot) => {
      snapshot.forEach((userData) => {
        var user = userData.val();
        if (user.id !== userID && user.isQueued) {
          var otherUserID = user.id
          var chatURL = this.getChatHash(otherUserID, userID);
          var isChatExist = snapshot.child(chatURL).exists();
          if (!isChatExist || (isChatExist && user.isQueued)) {
            this.removeUserFromQueue(chatURL);
            this.addChatConnection(chatURL);
            this.checkUserDisconnection();
            this.setState({
              otherUserID: otherUserID,
              chatURL: chatURL,
              status: "online",
              showSpinner: false,
              showCloseBtn: true
            });
          }
        }
      });
    });
  }

  checkUserDisconnection() {
    const {chatURL} = this.state;
    this.firebaseDB.ref("chats").orderByChild("chat_").on("child_removed", (oldChildSnapshot) => {
      if (chatURL === oldChildSnapshot.key) {
        this.removeConnection();
      }
    });
  }

  getChatHash(otherUserID, userId) {
    if (otherUserID > userId) {
      return "chat_" + otherUserID + "_" + userId;
    }
    else {
      return "chat_" +  userId + "_" + otherUserID;
    }
  }

  showSpinner(show) {
    this.setState({
      showSpinner: show
    });
  }

  addToQueue() {
    const {userID} = this.state;
    this.firebaseUserRef.update({
      id: userID,
      isQueued: true
    });
    this.checkForOpenConnection();
  }

  hideModal() {
    this.setState({
      showModal: false
    });
  }

  closeChat() {
    this.setState({
      showModal: true
    });
  }

  listenToTyping() {
    const {chatURL, otherUserID} = this.state;
    this.firebaseDB.ref(`chats/${chatURL}/${otherUserID}`).on("value", (snapshot) => {
      var snapshotData = snapshot.val();
      if (snapshotData && snapshotData.typing) {
        this.setState({
          status: 'typing...'
        });
      }
      else {
        this.setState({
          status: 'online'
        });
      }
    });
  }

  showIntroCallback() {
    this.setState({
      showIntro: true
    })
  }

  hideIntroCallback() {
    this.setState({
      showIntro: false
    })
  }

  render() {
    const {chatURL, showIntro, otherUserID, status, showCloseBtn, showModal, showSpinner, spinnerText, userID} = this.state;
    return (
      <div className="app__layout">
        <Header
          closeCallback={this.closeChat}
          showIntroCallback={this.showIntroCallback}
          showCloseBtn={showCloseBtn}
          status={status}
        />

        <Modal
          chatURL={chatURL}
          otherUserID={otherUserID}
          showModal={showModal}
          hideModal={this.hideModal}
        />

        <Spinner showSpinner={showSpinner} spinnerText={spinnerText}/>

        <Intro show={showIntro} hideIntroCallback={this.hideIntroCallback}/>

        <div className="app__content">
          <Message
            chatURL={chatURL}
            otherUserID={otherUserID}
          />
        </div>

        <div className="app__input-container">
          <Input
            userID={userID}
            chatURL={chatURL}
            otherUserID={otherUserID}
            status={status}
          />
        </div>
      </div>
    );
  }
}

reactMixin(App.prototype, ReactFireMixin)
