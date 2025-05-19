import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Header } from '../client/src/components/Header';
import { Hero } from '../client/src/components/Hero';
import { FormikLoanForm } from '../client/src/components/FormikLoanForm';
import { Benefits } from '../client/src/components/Benefits';
import { Testimonials } from '../client/src/components/Testimonials';
import { TrustIndicators } from '../client/src/components/TrustIndicators';
import { SpecialOffers } from '../client/src/components/SpecialOffers';
import { Footer } from '../client/src/components/Footer';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Loan Chaiye - Apply for Loans Online</title>
      </Head>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <FormikLoanForm />
          <Benefits />
          <Testimonials />
          <TrustIndicators />
          <SpecialOffers />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;