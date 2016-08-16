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
        <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="fixed-header-drawer-exp" onClick={this.handleClose}>
        <i className="material-icons noselect custom-icon-close">&#xE14C;</i>
      </label>)
      }
      </div>
    )
  }

  render() {
    const {status} = this.props;
    return (
      <header className="mdl-layout__header is-casting-shadow">
        <div className="mdl-layout__header-row custom-header">
          <img src={logo} className="custom-icon-logo" alt="logo"/>
          <div className="header-content">
            <span className="mdl-layout-title custom-title noselect">Anonymous</span>
            <span className="custom-status noselect">{status}</span>
          </div>
          <div className="mdl-layout-spacer"></div>
          <div className="mdl-textfield--align-right">
            <label className="mdl-button mdl-js-button mdl-button--icon custom-icon-intro" onClick={this.showIntroScreen}>
              <i className="material-icons">error_outline</i>
            </label>
            {this.htmlCloseBtn()}
          </div>
        </div>
      </header>
    );
  }
}
