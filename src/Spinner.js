import React, { Component } from 'react';

export default class Spinner extends Component {
  static defaultProps = {
    showSpinner: false,
    spinnerText: "Looking for anonymous.."
  }

  render() {
    const {showSpinner, spinnerText} = this.props;
    return (
      <div>
        {
          <div className={showSpinner ? "spinner-container" : "spinner-container none"}>
            <div className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>
            <p className="noselect">{spinnerText}</p>
          </div>
        }
      </div>
    );
  }
};
