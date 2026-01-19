import React from 'react';
import Container from '../../../components/container/Container';
import PostCard from '../../../components/postCard/postCard';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../services/axiosInstance';

const Pugsnuff = () => {
  const { data: pugsnuffPosts } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/posts');
      return res.data;
    },
  });

  const onlyPugsnuff = pugsnuffPosts?.filter((posts) => {
    return posts.account === 'pugsnuff';
  });

  return (
    <Container>
      <div className="my-14">
        <PostCard posts={onlyPugsnuff} account={'pugsnuff'}></PostCard>
      </div>
    </Container>
  );
};

export default Pugsnuff;
