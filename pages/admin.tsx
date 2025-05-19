import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import AdminComponent from '../client/src/pages/Admin';

const AdminPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Admin Dashboard - Loan Chaiye</title>
        <meta name="description" content="Admin dashboard for Loan Chaiye loan management" />
      </Head>
      <AdminComponent />
    </>
  );
};

export default AdminPage;