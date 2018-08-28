import MapView from 'js/components/MapView';
import Header from 'js/components/Header';
import React, { Component } from 'react';
import { TEXT } from 'js/config';

class App extends Component {
  // displayName: 'App';

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
    this.change = this.change.bind(this);
  }

  change(event) {
    this.setState({value: event.target.value});
    if (event.target.value === '') {
      this.setState({value: undefined});
    }
  }

  render () {
    return (
      <div className='root'>
        <Header title={TEXT.title} subtitle={TEXT.subtitle} />
        <MapView view={this.state.value}/>
      </div>
    );
  }

}

export default App;
