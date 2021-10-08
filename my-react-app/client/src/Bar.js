import React from "react";

class Bar extends React.Component
{
    render() {
        return (
        <div id='bar'>
            <div className='bar-item'>
                <div className='bar-text'>
                    <a onClick={this.props.barButton1} style={{cursor: "pointer"}}>My Books</a>
                </div>
            </div>
            <div className='bar-item'>
                <div className='bar-text'>
                    <a onClick={this.props.barButton2} style={{cursor: "pointer"}}>Logout</a>
                </div>
            </div>
        </div>
        );
    }
}
export default Bar;