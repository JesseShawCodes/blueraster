import React, { Component } from 'react';
import { Provider } from 'react-redux';
import appStore from '../appStore';
import App from './App';

export default class Root extends Component {
  render() {
    return (
      <Provider store={appStore}>
        <App />
      </Provider>
    );
  }
}
