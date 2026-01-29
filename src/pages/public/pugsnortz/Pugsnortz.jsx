import React from 'react';
import Container from '../../../components/container/Container';
import PostCard from '../../../components/postCard/postCard';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Pugsnortz = () => {
  const axiosSecure = useAxiosSecure();
  const { data: pugsnortzPosts, refetch } = useQuery({
    queryKey: ['posts', 'pugsnortz'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/posts?account=pugsnortz');
      return res.data;
    },
  });

  return (
    <Container>
      <div className="my-14">
        <PostCard posts={pugsnortzPosts} account={'pugsnortz'} refetch={refetch}></PostCard>
      </div>
    </Container>
  );
};

export default Pugsnortz;
