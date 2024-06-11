import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { Image } from 'react-bootstrap';
import { CAST_MAX_NUM } from '../const';

//test
const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');
function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}
async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);
    console.log('I went till here',result);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code === 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}
//test-end

class vintageContainer extends Component {
  constructor() {
    super();
    this.state = { oldmovies: [],showDetailsofSingleMovie: false,selectedMovie:null,posts: [],directorData:null,writerData:null}
  }

  async componentDidMount() {
    this.loadData();
    //this.loadReviewData();
  }
  
  async loadData() {
    const query = `query {
      listoldmovies(year: "<2005") {
        title
        rating
        year
        description
        trailer
        image
        imdbid
        director
        writers
      }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
      console.log("going inside fetch and the data is ",data);
      this.setState({ oldmovies: data.listoldmovies,showDetailsofSingleMovie: false,selectedMovie:null});
      console.log("the state of old movies",this.state.oldmovies);
    }
  }
  
  handleInputChange = event => {
    this.setState({ reviewInput: event.target.value });
  }

  handleMovieClick = async(movie) => {
    console.log(movie)
    const movieId= movie.imdbid;
    console.log('movie id is',movieId);
    const query = `query {
      getpost(movieId: "${movieId}") {
        post
        username
      }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ posts: Object.values(data.getpost) });
    }

    const directorData = movie.director.slice(0, CAST_MAX_NUM);
    var count = 0;
    const directors = directorData.map((direct) => {
      if (direct!="") {
        count=count+1;
        return (
          <Col xs={6} sm={4} md={3} lg={2} key={count}>
            
            <p>{direct}</p>
            
          </Col>
        );
      }
      return null;
    });

    count = 0;
    const writerData = movie.writers.slice(0, CAST_MAX_NUM);
    const writers = writerData.map((writer) => {
      if (writer!="") {
        count=count+1;
        return (
          <Col xs={6} sm={4} md={3} lg={2} key={count}>
            <p>{writer}</p>
            
          </Col>
        );
      }
      return null;
    });

    this.setState({
      showDetailsofSingleMovie: true,
      selectedMovie:movie,
      directorData:directors,
      writerData:writers,
    });
    

    //e.preventDefault();
  };


  handleAddReview = async (movie) => {
    console.log(movie.imdbid);
    const reviewAdded=document.getElementById("addReviewId").value;
    const movieId=movie.imdbid;
    var username = ""
    var actualUser = localStorage.getItem("username");
    if(actualUser && actualUser!=null && actualUser!=undefined){
      username = actualUser;
    }
    const post = {
      "post": reviewAdded,
      "movieId": String(movieId),
      "username": username
    };
    const query = `mutation mymutation($post: reviewfield!){
      addPost(post: $post)
    }`;
    const variables = { post }; 
    const data = await graphQLFetch(query,variables);
    if (data) {
      alert("Review added successfully");
      this.handleMovieClick(movie);
      //this.loadData();
      //this.setState({ reviewInput: "" });
      document.getElementById("addReviewId").value=""
      
    }
    
    }
  

  handleMovieClickBack = () => {
    this.setState({
      showDetailsofSingleMovie: false,
      selectedMovie:null,
    });
    //e.preventDefault();
  };

  render() {
    const StyledCastList = styled.div`
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #f7f7f7;
  `;

const StyledHeader = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const StyledCastWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;


    const StyledImg = styled.div`
    &:hover .image{
       opacity:1;
    }
  `;
  const Info =  styled.div`
      position: absolute;
      top: 75%;
      margin:10px;
      color:white;
      font-weight:bold;
      opacity:0;
  `;

    const style = {
      marginTop: '15px'
    };

    const titleStyle = {
      paddingLeft: '20px'
    };
    const { oldmovies,showDetailsofSingleMovie,selectedMovie,posts,directorData,writerData } = this.state;
    console.log('old movies inside render', oldmovies);

    const particularMovieDetails = selectedMovie ? (
      <div style={{ fontFamily: 'Helvetica Neue', color: '#333', padding: '2em' }}>
        <div style={{paddingBottom:"1%"}}>
        <button className="btn btn-default" onClick={() => this.handleMovieClickBack()} style={{background:"red",color:"white"}}>Back</button>
        </div>
          <Row>
            <Col xs={12} sm={6} md={4}>
              <StyledImg>
      <Image className="image" key={selectedMovie.imdbid} src={selectedMovie.image} style={{cursor:"pointer"}} responsive />
      {selectedMovie.title &&
      <Info className="title">
        <h4>${selectedMovie.title}</h4>
        
      </Info>
      }
    </StyledImg>
            </Col>
            <Col xs={12} sm={6} md={8}>
              <h1 style={{ fontSize: '2em', marginBottom: '0.5em' }}>{selectedMovie.title}</h1>
              <p style={{ fontSize: '1.5em', marginBottom: '1em' }}>{selectedMovie.description}</p>
              <StyledCastList>
              <StyledHeader>Directors</StyledHeader>
              <StyledCastWrapper>{directorData}</StyledCastWrapper>
              </StyledCastList>
              {/*<CastList data={casts.slice(0, CAST_MAX_NUM)} />*/}
              <StyledCastList>
              <StyledHeader>Writers</StyledHeader>
              <StyledCastWrapper>{writerData}</StyledCastWrapper>
              </StyledCastList>
            </Col>
          </Row>
          <Row style={{ marginTop: '2em' }}>
          <Col xs={12} sm={6} md={4}>
			<Col xs={12} sm={6} md={4} >
      <div>
          <h3 style={titleStyle}>Trailers</h3>
				<div style={style}><iframe src={selectedMovie.trailer} allowFullScreen></iframe></div>
      </div>
			</Col>
          </Col>
          <Col xs={12} sm={6} md={8}>
            {/* Add Review section */}
            <div style={{ marginTop: '2em' }}>
                <h3 style={{ fontSize: '1.5em', marginBottom: '0.5em' }}>Add Review:</h3>
                <div style={{ display: 'flex' }}>
                  <input
                    type="text" id="addReviewId" name="addReviewName"
                    placeholder="Write a review"
                    //value={reviewInput}
                    //onChange={this.handleInputChange} // add a new method for handling input change
                    style={{ flex: '1', marginRight: '1em', padding: '0.5em', fontSize: '1em' }}
                  />
                  <button
                    onClick={() => this.handleAddReview(selectedMovie)}
                    style={{ padding: '0.5em', backgroundColor: '#f44336', color: '#fff', border: 'none', fontSize: '1em' }}
                  >
                    Add
                  </button>
                </div>
              </div>
  
              {/* Reviews section */}
              {/*<div style={{ marginTop: '2em' }}>
                <h3 style={{ fontSize: '1.5em', marginBottom: '0.5em' }}>Reviews:</h3>
                {posts.map((post, index) => (
                  <div key={index} style={{ marginBottom: '1em', fontSize: '1.2em' }}>
                    <p style={{ marginBottom: '0.5em' }}>{post.post}</p>
                    <small style={{ color: '#999' }}>Posted by {post.author}</small>
                  </div>
                ))}
                </div>*/}
                <div style={{ marginTop: '2em' }}>
                  <h3 style={{ fontSize: '1.5em', marginBottom: '0.5em' }}>Reviews:</h3>
                    {posts.map((post, index) => (
                      <div key={index} style={{ marginBottom: '1em', fontSize: '1.2em', backgroundColor: '#f4f4f4', borderRadius: '10px', padding: '1em' }}>
                        <p style={{ marginBottom: '0.5em', fontStyle: 'italic', textAlign: 'justify' }}>{post.post}</p>
                        <small style={{ color: '#999', fontWeight: 'bold', textAlign: 'right' }}>Posted by {post.username}</small>
                </div>
                    ))}
                </div>
          </Col>    
          </Row>
        </div>
    ):null


    const allMovieDetails =(
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          backgroundColor: '#f1e6d5',
          padding: '50px 10%',
        }}
      >
        {oldmovies.map((movie, index) => (
          <div
            key={index}
            style={{
              margin: '20px',
              cursor: 'selection',
              border: '10px solid #cfb590',
              borderRadius: '5px',
              padding: '10px',
              boxShadow: '5px 5px 0px #a5a5a5',
              width: '300px',
              backgroundColor: '#fff',
            }}
          >
            <img
              src={movie.image}
              alt={`${movie.title} (${movie.year})`}
              style={{
                maxWidth: '300px',
                maxHeight: '450px',
                width: '100%',
                height: 'auto',
                cursor: 'selection',
              }}
              onClick={() => this.handleMovieClick(movie)}
            />
          </div>
        ))}
      </div>
    )

    return (
      <div style={{}}>
      {showDetailsofSingleMovie ? particularMovieDetails : allMovieDetails}
      </div>
    );
  }
}

export default connect()(vintageContainer);
