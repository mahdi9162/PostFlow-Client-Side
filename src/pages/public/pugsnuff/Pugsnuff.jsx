import React from 'react';
import Container from '../../../components/container/Container';
import PostCard from '../../../components/postCard/postCard';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Pugsnuff = () => {
  const axiosSecure = useAxiosSecure();
  const { data: pugsnuffPosts, refetch } = useQuery({
    queryKey: ['posts', 'pugsnuff'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/posts?account=pugsnuff');
      return res.data;
    },
  });

  return (
    <Container>
      <div className="my-14">
        <PostCard posts={pugsnuffPosts} account={'pugsnuff'} refetch={refetch}></PostCard>
      </div>
    </Container>
  );
};

export default Pugsnuff;
