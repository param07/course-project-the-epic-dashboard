import React, { Component } from 'react';
import SearchBar from './containers/SearchBar';
import './App.css';

export default class App extends Component {
  render() {
    const containerStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '2em',
    };

    const contentStyle = {
      maxWidth: '1200px',
      width: '100%',
      margin: '0 1em',
    };

    return(
      <div>
        <SearchBar brand="MovieBox" searchText={''} />
        <div style={containerStyle}>
          <div style={contentStyle}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
