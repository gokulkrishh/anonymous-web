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
          showSpinner && (
            <div className="spinner-container">
              <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66">
                <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
              </svg>
              <p>{spinnerText}</p>
            </div>
          )
        }
      </div>
    );
  }
};
