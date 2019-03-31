import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BusinessList from './components/BusinessList/BusinessList';
import SearchBar from './components/SearchBar/SearchBar';
import Yelp from './util/Yelp';
import HELLO from './js_test';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {businesses: [],
                    test: "Click me!"};
      this.searchYelp = this.searchYelp.bind(this);
      this.returnHello = this.returnHello.bind(this);
  }

  returnHello() {
      this.setState({test: HELLO});
  }

  searchYelp(term, location, sortBy) {
      Yelp.search(term, location, sortBy).then(
          businesses => {this.setState({businesses: businesses});
      })
  }
  render() {
    return (
        <div className="App">
            <h1>ravenous</h1>
            <button onClick={this.returnHello}>{this.state.test}</button>
            <SearchBar searchYelp={this.searchYelp}/>
            <BusinessList businesses={this.state.businesses}/>
        </div>
    );
  }
}

export default App;
