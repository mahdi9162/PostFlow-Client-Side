import React from 'react';
import Container from '../container/Container';

const Loading = () => {
  return (
    <Container>
      <div className="flex justify-center">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    </Container>
  );
};

export default Loading;
