import React, { Component } from 'react';

export default class Header extends Component {
  static defaultProps = {
    status: 'connecting..'
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit() {
    alert()
  }

  render() {
    const {status} = this.props;
    return (
      <header className="mdl-layout__header is-casting-shadow">
        <div className="mdl-layout__header-row custom-header">
          <i className="material-icons noselect custom-icon-logo" onClick={this.handleSubmit}>&#xE0B7;</i>
          <span className="mdl-layout-title custom-title noselect">Anonymous</span>
          <span className="custom-status noselect">{status}</span>
          <div className="mdl-layout-spacer"></div>
          <div className="mdl-textfield--align-right">
            <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="fixed-header-drawer-exp">
             <i className="material-icons noselect custom-icon-close">&#xE14C;</i>
           </label>
          </div>
        </div>
      </header>
    );
  }
}
