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
    this.changeComponents = this.changeComponents.bind(this);
    this.state={
      activeComponentName: '',
      activeComponent: <Home/>
    }
  }
  changeComponents() {
    let activeComponent;
    let acn = this.state.activeComponentName;
    console.log(acn)
    if(acn === 'login')
    {
      activeComponent = (
        <Login />
      )
    }
    else if(acn === 'Book')
    {
      activeComponent = (
        <Book />
      )
    }
    else if(acn === 'BookSelector')
    {
      activeComponent = (
        <BookSelector />
      )
    }
    else if(acn === 'Home')
    {
      activeComponent = (
        <Home />
      )
    }
    else
    {
      activeComponent = (
        <Login myState='t' />
      )
    }
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
