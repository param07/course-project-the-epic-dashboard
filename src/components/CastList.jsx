import React from 'react';
import Cast from './Cast';
import { Link } from 'react-router';
import { Col } from 'react-bootstrap';
import styled from 'styled-components';

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

const StyledLink = styled(Link)`
  display: block;
  margin-right: 1.5rem;
  margin-bottom: 1.5rem;
  text-decoration: none;
  color: #333;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    color: #000;
  }
`;

export default function CastList({data}) {
  const casts = data.map((cast) => {
    if (cast.profile_path) {
      return (
        <Col xs={6} sm={4} md={3} lg={2} key={cast.id}>
          <StyledLink to={`/star/${cast.id}`}>
            <Cast cast={cast} />
          </StyledLink>
        </Col>
      );
    }
    return null;
  });

  return (
    <StyledCastList>
      <StyledHeader>Casts</StyledHeader>
      <StyledCastWrapper>{casts}</StyledCastWrapper>
    </StyledCastList>
  );
}
