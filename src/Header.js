import React, { Component } from 'react';

export default class Header extends Component {
  static defaultProps = {
    status: 'connecting..'
  }

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.closeCallback();
  }

  render() {
    const {status} = this.props;
    return (
      <header className="mdl-layout__header is-casting-shadow">
        <div className="mdl-layout__header-row custom-header">
          {
            (status === "connecting..") && (<svg className="spinner" width="45px" height="45px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
              <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
            </svg>)
          }
          <i className="material-icons noselect custom-icon-logo">&#xE0B7;</i>
          <span className="mdl-layout-title custom-title noselect">Anonymous</span>
          <span className="custom-status noselect">{status}</span>
          <div className="mdl-layout-spacer"></div>
          <div className="mdl-textfield--align-right">
            <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="fixed-header-drawer-exp">
             <i className="material-icons noselect custom-icon-close" onClick={this.handleClose}>&#xE14C;</i>
           </label>
          </div>
        </div>
      </header>
    );
  }
}
