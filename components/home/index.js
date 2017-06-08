import style from "./style";
import { h, Component } from "preact";
import autoBind from "react-autobind";
import database from "firebase/database";
import utility from "../../utility";
import Header from "../header";
import Spinner from "../spinner";
import Input from "../input";
import Intro from "../intro";
import Messages from "../messages";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatURL: null,
      otherUserId: null,
      showCloseBtn: false,
      showIntroScreen: utility.showIntroScreen(),
      showSpinner: true
    };
    this.firebaseDB = database();
    this.firebaseChatRef = this.firebaseDB.ref("chats");
    this.firebaseUserRef = null;
    this.firebaseDBTyping = null;
    this.firebaseChatDisconnection = null;
    this.userId = window.navigator.userAgent.replace(/\D+/g, "");
    autoBind(this);
  }

  componentWillMount() {
    this.checkFirebaseConnection();
    this.checkForDisconnection();
  }

  componentDidMount() {
    this.initializeChat();
  }

  checkFirebaseConnection() {
    this.firebaseConnection = this.firebaseDB.ref(".info/connected");
    this.firebaseConnection.on("value", (snap) => {
      if (snap.val() === true) {
        console.log("Came ---->");
        if (this.currentChat) {
          this.currentChat.onDisconnect().remove();
        }
        this.firebaseUserRef.onDisconnect().remove();
      }
    });
  }

  checkForDisconnection() {
    window.addEventListener("beforeunload", () => { 
      this.removeConnection();
    });

    window.addEventListener("offline", () => {
      this.setState({
        headerStatus: "no internet",
        spinnerText: "No internet connection"
      });
    });

    window.addEventListener("online", () => {
      this.setState({
        headerStatus: "connected",
        spinnerText: "Looking for user..."
      });
    });
  }

  createUser() {
    this.firebaseUserRef = this.firebaseDB.ref(`chats/user_${this.userId}`);
    this.firebaseUserRef.update({
      userId: this.userId,
      queued: true
    });
  }

  initializeChat() {
    this.setState({
      showCloseBtn: false,
      headerStatus: "connecting...",
      showSpinner: true,
      spinnerText: "Looking for user..."
    }, () => {
      this.createUser();
      this.lookForUser();
    });
  }

  lookForUser() {
    this.firebaseChatRef.on("value", (snapshot) => {
      snapshot.forEach((data) => { 
        const user = data.val();
        if (user.userId !== this.userId && user.queued) {
          const chatURL = utility.getChatHash(user.userId, this.userId);
          const isChatAlreadyExist = snapshot.child(chatURL).exists();
          if (!isChatAlreadyExist) { 
            this.addChatConnection(chatURL, user.userId);
          }
        }
      });
    });
  }

  addChatConnection(chatURL, otherUserId) {
    this.firebaseUserRef.update({
      queued: false
    });

    this.currentChat = this.firebaseDB.ref(`chats/${chatURL}`);
    this.currentChat.update({
      connection: true
    });

    this.setState({
      headerStatus: "connected",
      showCloseBtn: true,
      showSpinner: false,
      otherUserId,
      chatURL
    }, () => {
      this.listenToTyping();
      this.checkUserDisconnection();
    });
  }

  listenToTyping() {
    const {chatURL, otherUserId} = this.state;
    this.firebaseDBTyping = this.firebaseDB.ref(`chats/${chatURL}/${otherUserId}`).on("value", (snapshot) => {
      var snapshotData = snapshot.val();
      if (snapshotData && snapshotData.typing) {
        this.setState({
          headerStatus: "typing..."
        });
      }
      else {
        this.setState({
          headerStatus: "online"
        });
      }
    });
  }

  checkUserDisconnection() {
    const {chatURL, otherUserId} = this.state;
    var counter = 0;
    this.firebaseChatRef.orderByChild("chat_").on("child_removed", (oldSnapshot) => {
      if (chatURL === oldSnapshot.key || otherUserId === oldSnapshot.key) {
        this.removeConnection();
      }
    });
  }

  removeConnection() {
    if (this.firebaseUserRef) {
      this.firebaseUserRef.remove();
    }
    if (this.firebaseChatRef) {
      this.firebaseChatRef.remove((error) => {
        if (!error) {
          this.initializeChat();
        }
      });
    }
  }
 
  hideIntroCallback() {
    this.setState({showIntroScreen: false}, () => {
      localStorage.setItem("visited", true);
    });
  }

  showIntroCallback() {
    this.setState({showIntroScreen: true}); 
  }

  render() {
    const {firebaseRef} = this.props;
    const {chatURL, headerStatus, otherUserId, showCloseBtn, showIntroScreen, showSpinner, spinnerText} = this.state;

		return (
			<div className="app__layout">
        <Header closeChatCallback={this.removeConnection} showCloseBtn={showCloseBtn} showIntroCallback={this.showIntroCallback} status={headerStatus}/>
        <Spinner showSpinner={showSpinner} spinnerText={spinnerText}/>
        <Intro show={showIntroScreen} closeCallback={this.hideIntroCallback}/>
        <div className="app__content">
          <Messages chatURL={chatURL} otherUserId={otherUserId} userId={this.userId}/>
        </div>
        <Input chatURL={chatURL} userId={this.userId}/>
			</div>
		);
	}
}
