import React, { Component } from 'react';
import Poster from './Poster';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import logo from '../images/moviebox.jpg'

export default class MovieList extends Component {

  render() {
    const StyledRow = styled(Row)`
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    `;
    
    const StyledCol = styled(Col)`
      margin-bottom: 20px;
    `;
    
    const StyledPosterDiv = styled.div`
      margin-right: 20px;
    `;
    
    let movies = this.props.movies.filter(function(movie) {
      return movie.poster_path != null;
    }).map(function(movie) {
      return (
        
        <StyledCol xs={6} sm={4} md={3} key={movie.id}>
          <StyledPosterDiv>
              <Link to={'/movie/' + movie.id}><div style={{ border: '10px solid white' }}><Poster id={movie.id} path={movie.poster_path} title={movie.title} voteAverage={movie.vote_average} release_date={movie.release_date} responsive /></div></Link>

            </StyledPosterDiv>
        </StyledCol>
      );
    });

    return (
      <Grid fluid={false}>
        <StyledRow>
          {movies}
        </StyledRow>
      </Grid>
    );
  }
}
