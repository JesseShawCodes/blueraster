import React, { Component } from 'react';

export default class Footer extends Component {
  // displayName: 'Header';

  render () {
    return (
        <footer>
            <form className="number-input">
                <input type="text" name="population" onChange={this.props.handleChange} value={this.props.population}></input>
                <input type="submit"></input>
            </form>
            <section className='footer'>
            <h4>Cities with Population greater than <span className='total'>{this.props.population}</span></h4>
            <input className='population-slider' type='range' min='1000' max='1000000' step='100'
                defaultValue={this.props.population} value={this.props.population} onChange={this.props.handleChange}></input>
            </section>
        </footer>
    );
  }
}
