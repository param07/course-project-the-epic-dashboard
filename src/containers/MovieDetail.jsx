import React, { Component } from 'react';
import { CastList, TrailerList} from '../components';
import { CAST_MAX_NUM, TRAILER_MAX_NUM } from '../const';
import { Grid, Row, Col} from 'react-bootstrap/lib';
import { MovieInfo, Poster } from '../components';
import { connect } from 'react-redux';
import { fetchMovieDetail, fetchCastList, fetchTrailerList} from '../actions';

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
      if (error.extensions.code == 'BAD_USER_INPUT') {
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


class MovieDetail extends Component {
  //test
  constructor() {
    super();
    this.state = { posts: [], selector: 1}
  }
  //test-end

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchMovieDetail(this.props.params.id));
    dispatch(fetchCastList(this.props.params.id));
    dispatch(fetchTrailerList(this.props.params.id));
    this.loadData();
    
  }
//test

async loadData() {

  //MY CODE
  const movieId= this.props.params.id;
  console.log('movie id is',movieId);
  const query = `query {
    getpost(movieId: "${movieId}") {
      post
      username
    }
  }`;

  const data = await graphQLFetch(query);
  if (data) {
    //console.log('data of posts is kjkjkj',Object.values(data.getpost));
    //this.setState({ posts: data.getpost });
    this.setState({ posts: Object.values(data.getpost) });
    //console.log('posts state is',this.state.posts);

  }
  //MY CODE ENDS
   /*End of Q3*/
}
//test-end
  componentWillReceiveProps(nextProps) {
     const {dispatch} = this.props;
     if(nextProps.params.id && this.props.params.id !== nextProps.params.id) {
         dispatch(fetchMovieDetail(nextProps.params.id));
         dispatch(fetchCastList(nextProps.params.id));
         dispatch(fetchTrailerList(nextProps.params.id));
      }
  }
  //new
  handleInputChange = event => {
  this.setState({ reviewInput: event.target.value });
}

handleAddReview = async () => {
  const { dispatch } = this.props;
  const movieId = this.props.params.id;
  var username = ""
  var actualUser = localStorage.getItem("username");
  if(actualUser && actualUser!=null && actualUser!=undefined){
    username = actualUser;
  }
  const userid = localStorage.getItem("userid");
  const post = {
    "post": this.state.reviewInput,
    "movieId": String(this.props.params.id),
    "username": username
  };
  
  console.log(this.state.reviewInput,typeof(this.state.reviewInput));
  console.log('id type is ',this.props.params.id,typeof(this.props.params.id));
  const query = `mutation mymutation($post: reviewfield!){
      addPost(post: $post)
    }`;
  const variables = { post }; 
  const data = await graphQLFetch(query,variables);
  if (data) {
    //this.setState(prevState => ({
   //   posts: [...prevState.posts, { post }]
    //}));
    alert("Review added successfully");
    this.loadData();
    this.setState({ reviewInput: "" });
    /*this.setState({ reviewInput: "" }, () => {
      this.loadData();
    });*/
  }
  this.setState({ reviewInput: "" });
}

  //new-end

  render() {
    const { movie, casts, trailers, isFetching_movie, isFetching_casts, isFetching_trailers } = this.props;
    const { reviewInput, posts } = this.state;
  
    if (isFetching_movie || isFetching_casts || isFetching_trailers) {
      return <p>Loading...</p>;
    }
  
    if (movie.hasOwnProperty('id')) {
      return (
        <div style={{ fontFamily: 'Helvetica Neue', color: '#333', padding: '2em' }}>
          <Row>
            <Col xs={12} sm={6} md={4}>
              <Poster id={movie.id} path={movie.poster_path} responsive />
            </Col>
            <Col xs={12} sm={6} md={8}>
              <h1 style={{ fontSize: '2em', marginBottom: '0.5em' }}>{movie.title}</h1>
              <p style={{ fontSize: '1.5em', marginBottom: '1em' }}>{movie.overview}</p>
              <CastList data={casts.slice(0, CAST_MAX_NUM)} />
            </Col>
          </Row>
          <Row style={{ marginTop: '2em' }}>
          <Col xs={12} sm={6} md={4}>
            <TrailerList data={trailers.slice(0, TRAILER_MAX_NUM)} />
          </Col>
          <Col xs={12} sm={6} md={8}>
            {/* Add Review section */}
            <div style={{ marginTop: '2em' }}>
                <h3 style={{ fontSize: '1.5em', marginBottom: '0.5em' }}>Add Review:</h3>
                <div style={{ display: 'flex' }}>
                  <input
                    type="text"
                    placeholder="Write a review"
                    value={reviewInput}
                    onChange={this.handleInputChange} // add a new method for handling input change
                    style={{ flex: '1', marginRight: '1em', padding: '0.5em', fontSize: '1em' }}
                  />
                  <button
                    onClick={this.handleAddReview}
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
      );
    } else {
      return null;
    }
  }
  
  
}

function mapStateToProps(state){
  const {movieDetail, castList, trailerList} = state;
  const {isFetcing_movie, item: movie, error_movie} = movieDetail;
  const {isFetcing_casts, items: casts, error_casts} = castList;
  const {isFetcing_trailers, items: trailers, error_trailers} = trailerList;

  return {isFetcing_movie, movie, error_movie, isFetcing_casts, casts, error_casts, isFetcing_trailers, trailers, error_trailers}
}

export default connect(mapStateToProps)(MovieDetail);
