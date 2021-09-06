import React from "react";

class Bar extends React.Component
{
    render() {
        return (
        <div id='bar'>
            <div className='bar-item'>
                <div className='bar-text'>
                    <a>My Books</a>
                </div>
            </div>
            <div className='bar-item'>
                <div className='bar-text'>
                    <a>Logout</a>
                </div>
            </div>
        </div>
        );
    }
}
export default Bar;