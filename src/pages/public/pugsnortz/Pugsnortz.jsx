import React from 'react';
import Container from '../../../components/container/Container';
import PostCard from '../../../components/postCard/postCard';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../services/axiosInstance';

const Pugsnortz = () => {
  const { data: pugsnortzPosts, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/posts');
      return res.data;
    },
  });

  const onlyPugsnortz = pugsnortzPosts?.filter((posts) => {
    return posts.account === 'pugsnortz';
  });

  return (
    <Container>
      <div className="my-14">
        <PostCard posts={onlyPugsnortz} account={'pugsnortz'} refetch={refetch}></PostCard>
      </div>
    </Container>
  );
};

export default Pugsnortz;
