import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import FormikLoginComponent from '../client/src/pages/FormikLogin';

const LoginPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login - Loan Chaiye</title>
        <meta name="description" content="Login to Loan Chaiye admin portal" />
      </Head>
      <FormikLoginComponent />
    </>
  );
};

export default LoginPage;