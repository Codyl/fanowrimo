import React from "react";
import Bar from "./Bar";
import styled, { css } from 'styled-components';
import * as d3 from 'd3';
//TODO use D3 to create line graph for word count.
const lineGraph = d3.select('svg')
.append('svg') 
.attr("width", 100)
.attr("height", 100)
.style('padding', 0);


const BookInfo = styled.div`
position: relative;
  width: 90vw;
  height: 400px;
  background-color: #3E5962;
  margin: 30px auto ;
`;
const BookTitle = styled.input`
position: absolute;
top: 50px;
left: 50%;
width: 40%;
font-family: Righteous, cursive;
`;
const BookDesc = styled.textarea`
position: absolute;
top: 100px;
left: 50%;
width: 40%;
height: 200px;
font-family: Righteous, cursive;
`;
const BookImage = styled.div`
position: absolute;
top: 10px;
left: 50px;
  width: 200px;
  height: 300px;
  background-color: white;
`;
const BookUpload = styled.input`
position: absolute;
left: 50px;
bottom: 30px;
`;
const BookSave = styled.button`
position: absolute;
right: 50px;
bottom: 30px;
`;

const WordCountContainer = styled(BookInfo)`

`;
const WordCountTitle = styled.h2`
padding: 10px;
float: left;
font-family: Righteous, cursive;
`;

const WordCountInput = styled(BookTitle)`
`;
const WordCountButton = styled.button`
position: absolute;
left: 90%;
top: 50px;
`;
class Book extends React.Component
{
    render() {
        return (
        <div>
            <Bar/>
            <BookInfo id="bookInfoContainer">
                <BookTitle placeholder='Enter Title here'/>
                <BookDesc placeholder='Enter description here'/>
                <BookImage/>
                <BookUpload type='file'/>
                <BookSave>Save Changes</BookSave>
            </BookInfo>
            <WordCountContainer id="wordCountContainer">
                <WordCountTitle>Word Count</WordCountTitle>
                <WordCountInput placeholder='Enter # words written today'>
                </WordCountInput>
                <WordCountButton>Add</WordCountButton>
            </WordCountContainer>
        </div>
        );
    }
}
export default Book;