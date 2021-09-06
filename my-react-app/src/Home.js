import React from "react";
import Bar from "./Bar";

class Home extends React.Component
{
    render() {
        return (
            <div className='myContainer' style={{backgroundColor: '#532E1B'}}>
                <Bar/>
                <div className='myContainer' id='home' style={{position: 'absolute', top: 0}}></div>
                    <h1 id='title' style={{position:'absolute',top: 50, left: '50%'}}>Fanowrimo</h1>
                    <p className='generalText' style={{position:'absolute',top: 100, left: '10%',margin: '0 10%',fontSize: 'large'}}>
                    Will you accept the challenge? 
We seek to help you write your novels for
National Writing Month while keeping it all
about the family. 
                    </p>
                    <div id='challenge'></div>
                    <button  className='generalText' style={{position:'absolute',top: 200, left: '10%'}}>Create New Book</button>
                
            </div>
        );
    }
}
export default Home;