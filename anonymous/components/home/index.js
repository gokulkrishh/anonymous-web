import style from "./style";
import { h, Component } from "preact";
import autoBind from "react-autobind";
import firebase from "firebase";
import utility from "../../utility";
import Header from "../header";
import Spinner from "../spinner";
import Input from "../input";
import Intro from "../intro";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showIntroScreen: utility.showIntroScreen()
    };
    this.firebaseDB = firebase.database();
    this.firebaseChatRef = this.firebaseDB.ref("chats");
    this.firebaseUserRef = null;
    this.userId = window.navigator.userAgent.replace(/\D+/g, "");
    autoBind(this);
  }

  componentWillMount() {
    this.initializeChat();
  }

  componentWillUnmount() {
    this.firebaseDB.off();
    this.firebaseChatRef.off();
  }

  initializeChat() {
    this.firebaseUserRef = this.firebaseDB.ref(`chats/user_${this.userId}`);
    this.firebaseUserRef.update({
      userId: this.userId,
      queued: true
    });
    this.lookForUser();
  }

  lookForUser() {
    this.firebaseChatRef.orderByChild("chat_").once("value", (snapshot) => {
      snapshot.forEach((data) => { 
        const user = data.val();
        if (user.queued && user.userId !== this.userId) { 
          const chatURL = utility.getChatHash(user.userId, this.userId);
          const isChatAlreadyExist = snapshot.child(chatURL).exists();
          if (!isChatAlreadyExist) { 
            this.connectToSomeUser(chatURL);
          }
        }
      });
    });
  }

  connectToSomeUser(chatURL) {
    this.currentChat = this.firebaseDB.ref("chats/" + chatURL);
    this.currentChat.update({
      connection: true
    });
    this.setState({
      headerStatus: "connected"
    });
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
    const {headerStatus, showIntroScreen} = this.state;

		return (
			<div className="app__layout">
        <Header firebaseRef={firebaseRef} showIntroCallback={this.showIntroCallback} status={headerStatus}/>
        <Spinner showSpinner={false}/>
        <Intro show={showIntroScreen} closeCallback={this.hideIntroCallback}/>
        <div className="app__content"></div>
        <Input />
			</div>
		);
	}
}
