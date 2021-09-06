import React from "react";
import Bar from './Bar';
import styled, { css } from 'styled-components';

const BookContainer = styled.div`
width: 100vw;
background-color: #3E5962;
height: 50vh;
margin-top: 30px;
`;
const ArrowLeft = styled.div`
width: 0; 
height: 0; 
border-top: 30px solid transparent;
border-bottom: 30px solid transparent; 
border-right:30px solid black; 

`;
const ArrowRight = styled(ArrowLeft)`
border-left :30px solid black; 
border-right:30px solid transparent; 
`;
const BookCard = styled.div``;
class BookSelector extends React.Component
{
    render() {
        return(
        <div>
            <Bar/>
            <BookContainer>
                <ArrowLeft/>
                <BookCard>
                    {/* Year, Image, Title, Button to edit */}
                </BookCard>
                <ArrowRight/>
            </BookContainer>
            
        </div>
        );
    }
}
export default BookSelector;