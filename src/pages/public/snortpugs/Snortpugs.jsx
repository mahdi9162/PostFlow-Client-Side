import React from 'react';
import PostCard from '../../../components/postCard/postCard';
import Container from '../../../components/container/Container';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../services/axiosInstance';

const Snortpugs = () => {
  const { data: snortpugsPosts, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/posts');
      return res.data;
    },
  });

  const onlySnortpugs = snortpugsPosts?.filter((posts) => {
    return posts.account === 'snortpugs';
  });

  return (
    <Container>
      <div className="my-14">
        <PostCard posts={onlySnortpugs} account={'snortpugs'} refetch={refetch}></PostCard>
      </div>
    </Container>
  );
};

export default Snortpugs;
