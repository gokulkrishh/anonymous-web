import React, { Component } from 'react';
import logo from './logo.png';

export default class Header extends Component {
  static defaultProps = {
    status: 'connecting...'
  }

  constructor(props: Object) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.showIntroScreen = this.showIntroScreen.bind(this);
  }

  handleClose() {
    this.props.closeCallback();
  }

  showIntroScreen() {
    this.props.showIntroCallback();
  }

  htmlCloseBtn() {
    const {showCloseBtn} = this.props;
    return (
      <div>
      {
        showCloseBtn && (
        <label className="header__icon--close noselect" onClick={this.handleClose}>
        <i className="material-icons noselect">&#xE14C;</i>
      </label>)
      }
      </div>
    )
  }

  render() {
    const {status} = this.props;
    return (
      <header>
        <img src={logo} className="header__logo" alt="logo"/>
        <div className="header__content noselect">
          <span className="header__title">Anonymous</span>
          <span className="header__status">{status}</span>
        </div>

        <div className="header__spacer"></div>

        <div className="header__icons">
          <div>
            <label className="header__icon--intro" onClick={this.showIntroScreen}>
              <i className="material-icons noselect">error_outline</i>
            </label>
          </div>
          {this.htmlCloseBtn()}
        </div>
      </header>
    );
  }
}
