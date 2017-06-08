import { h, Component } from "preact";
import style from "./style";
import logo from "./logo.png";
import outlineInfo from "./outline.png";
import closeBtn from "./close.png";

export default class Header extends Component {
	static defaultProps = {
    status: "connecting..."
  }

  constructor(props) {
    super(props);
  }

  htmlCloseBtn() {
    const {closeChatCallback, showCloseBtn} = this.props;
    if (!showCloseBtn) return <div/>;
    return (
      <div>
        <label className="header__icon--intro" onClick={closeChatCallback}>
          <img className="header__close-icon" src={closeBtn} alt="Close the chat"/>
        </label>
      </div>
    );
  }

  render() {
    const {status} = this.props;
    return (
      <header>
        <img src={logo} className="header__logo" alt="logo"/>
        <div className="header__content">
          <span className="header__title">Anonymous Chat</span>
          <span className="header__status">{status}</span>
        </div>

        <div className="header__spacer"></div>

        <div className="header__icons">
          <label className="header__icon--intro" onClick={this.props.showIntroCallback}>
            <img src={outlineInfo} className="header__icon" alt="application info" />
          </label>
          {this.htmlCloseBtn()}
        </div>
      </header>
    );
  }
}

