import React from 'react';
import { useParams, Navigate } from 'react-router';
import PostCard from '../../../components/postCard/PostCard';
import Container from '../../../components/container/Container';
import { useAccounts } from '../../../hooks/useAccounts';
import LoadingState from '../../../components/common/LoadingState';
import ErrorState from '../../../components/common/ErrorState';

const AccountPage = () => {
  const { accountSlug } = useParams();
  const { accounts, isLoading, isError } = useAccounts();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Failed to load accounts" />;

  const accountExists = accounts && accounts.length > 0 && accounts.some((a) => a.slug === accountSlug);
  if (!accountExists) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container>
      <div className="my-14">
        <PostCard account={accountSlug} />
      </div>
    </Container>
  );
};

export default AccountPage;
