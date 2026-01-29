import React from 'react';
import PostCard from '../../../components/postCard/postCard';
import Container from '../../../components/container/Container';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Snortpugs = () => {
  const axiosSecure = useAxiosSecure();
  const { data: snortpugsPosts, refetch } = useQuery({
    queryKey: ['posts', 'snortpugs'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/posts?account=snortpugs');
      return res.data;
    },
  });

  return (
    <Container>
      <div className="my-14">
        <PostCard posts={snortpugsPosts} account={'snortpugs'} refetch={refetch}></PostCard>
      </div>
    </Container>
  );
};

export default Snortpugs;
