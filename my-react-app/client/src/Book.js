import React from "react";
import Bar from "./Bar";
import styled, { css } from 'styled-components';
import * as d3 from 'd3';
import Axios from 'axios';
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
const BookImageContainer = styled.div`
position: absolute;
top: 10px;
left: 50px;
width: 200px;
height: 300px;
background-color: white;
overflow: hidden;
`;
const BookImage = styled.img`
display: block;
height: 100%;
width: 100%;
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
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            desc: '',
            img_path: ''
        };
        this.addBook = this.addBook.bind(this);
    }
    addBook(e) {
        // this.setState({
        //     title: document.getElementById('title').value,
        //     desc: document.getElementById('desc').value,
        //     img_path: document.getElementById('img').files
        // });
        const title = this.state.title;
        const desc = this.state.desc;
        console.log(this.state)
        Axios.post('http://localhost:3001/create', {
            title: "test",
            desc: "test"
        }).then(() => {
            console.log('success');
        });
    }
    previewImage(e) {
        console.log(e.target,document.getElementById('imagePreviewer'))
        const [file] = e.target.files;
        if (file) {
            document.getElementById('imagePreviewer').src = URL.createObjectURL(file);
        }
    }
    render() {
        return (
        <div>
            <Bar barButton1={this.props.barButton1} barButton2={this.props.BarButton2}/>
            <BookInfo id="bookInfoContainer">
                <BookTitle id='title' placeholder='Enter Title here' onChange={(e) => this.setState({title: e.target.value})}/>
                <BookDesc id='desc' placeholder='Enter description here' onChange={(e) => this.setState({desc: e.target.value})}/>
                <BookImageContainer>
                    <BookImage id='imagePreviewer'/>
                </BookImageContainer>
                <BookUpload onChange={this.previewImage} accept="image/*" id='img' type='file'/>
                <BookSave onClick={this.addBook}>Save Changes</BookSave>
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