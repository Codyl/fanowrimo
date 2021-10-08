import React from "react";
import Bar from './Bar';
import styled, { css } from 'styled-components';

const BookContainer = styled.div`
width: 100vw;
background-color: #3E5962;
height: 80vh;
margin-top: 30px;
position:relative;
display: flex;
`;
const ArrowLeft = styled.div`
width: 0; 
height: 0; 
border-top: 30px solid transparent;
border-bottom: 30px solid transparent; 
border-right:30px solid black; 
position: absolute;
left: 10px;
top: 45%;
`;
const ArrowRight = styled.div`
width: 0; 
height: 0; 
border-top: 30px solid transparent;
border-bottom: 30px solid transparent; 
border-left: 30px solid black; 
position: absolute;
right: 10px;
top: 45%;
`;
const BookCard = styled.div`
height: 98%;
width: 400px;
position: absolute;
background-color: white;
left: 5%;
top: 1%;
`;
const BookYear = styled.div`
font-family: Righteous;
float: left;
font-size: 2em;
`;
const BookCreator = styled.div`
width: 100%;
height: 100px;
background-color: #DAA520;
font-family: Righteous;
font-size: 2em;
position: absolute;
top:40%;
cursor: pointer;
`;
const BookEditButton = styled.div`
width: 100%;
height: 60px;
background-color: #DAA520;
font-family: Righteous;
font-size: 2em;
position: absolute;
bottom:0;
cursor: pointer;
`;
class BookSelector extends React.Component
{
    render() {
        return(
        <div>
            <Bar barButton1={this.props.barButton1} barButton2={this.props.barButton2}/>
            <BookContainer>
                <ArrowLeft/>
                <BookCard>
                    {/* Year, Image, Title, Button to edit */}
                    
                    <BookCreator onClick={this.props.bookButton}>Create New Book</BookCreator>
                </BookCard>
                <BookCard style={{left: '35%'}}>
                    {/* Year, Image, Title, Button to edit */}
                    <BookYear>2021</BookYear>
                    <BookEditButton onClick={this.props.bookButton}>Edit Book</BookEditButton>
                </BookCard>
                <BookCard style={{left: '65%'}}>
                    {/* Year, Image, Title, Button to edit */}
                </BookCard> 
                <ArrowRight/>
            </BookContainer>
            
        </div>
        );
    }
}
export default BookSelector;