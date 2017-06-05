import { h, Component } from 'preact';
import style from './style';
import logo from './logo.png';
import outlineInfo from './outline.png';

export default class Header extends Component {
	static defaultProps = {
    status: "connecting..."
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {status} = this.props;
    return (
      <header>
        <img src={logo} className="header__logo" alt="logo"/>
        <div className="header__content noselect">
          <span className="header__title">Anonymous Chat</span>
          <span className="header__status">{status}</span>
        </div>

        <div className="header__spacer"></div>

        <div className="header__icons">
          <label className="header__icon--intro" onClick={this.props.showIntroCallback}>
            <img src={outlineInfo} className="header__icon" alt="application info" />
          </label>
        </div>
      </header>
    );
  }
}

