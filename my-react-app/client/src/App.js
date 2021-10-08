import logo from './logo.svg';
import './App.css';
import React from 'react';
import Login from './Login';
import Home from './Home';
import Book from './Book';
import BookSelector from './BookSelector';

class App extends React.Component
{
  constructor(props) {
    super(props);
    this.toBookPage = this.toBookPage.bind(this);
    this.toBookSelectorPage = this.toBookSelectorPage.bind(this);
    this.toLoginPage = this.toLoginPage.bind(this);
    this.toHomePage = this.toHomePage.bind(this);
    this.state={
      activeComponentName: '',
      activeComponent: <Login login={this.toHomePage}/>
    }
  }

  toBookPage() {
    this.setState({
      activeComponent: <Book barButton1={this.toBookSelectorPage} barButton2={this.toLoginPage}/>
    })
  }
  toBookSelectorPage() {
    this.setState({
      activeComponent: <BookSelector barButton1={this.toBookSelectorPage} barButton2={this.toLoginPage} bookButton={this.toBookPage}/>
    })
  }
  toLoginPage() {
    this.setState({
      activeComponent: <Login login={this.toHomePage}/>
    })
  }
  toHomePage() {
    this.setState({
      activeComponent: <Home  barButton1={this.toBookSelectorPage} barButton2={this.toLoginPage}/>
    })
  }
  render() {
    return (
      <div className="App">
        {this.state.activeComponent}
        {/* <button onClick={this.changeComponents} goTo='Home'>Change State</button> */}
      </div>
    );
  }
}

export default App;
