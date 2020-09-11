import React from 'react';
import InfoPageHeader from '@/v2/components/InfoPageHeader/InfoPageHeader';
import InfoPageContent from '@/v2/components/InfoPageContent/InfoPageContent';
import { TITLE, TITLES, ABOUT_DATA } from '@/v1/Constants/About';
import MainScreen from '@/v2/layouts/MainScreen/MainScreen';
import ScrollToTopOnMount from '@/v1/components/ScrollToTopOnMount';

const About = () => (
  <>
    <ScrollToTopOnMount />
    <MainScreen
      header={
        <InfoPageHeader
          title={TITLE}
          image={require('./images/about.jpg')}
        />
      }
    >
      <InfoPageContent titles={TITLES} data={ABOUT_DATA} />
    </MainScreen>
  </>
);

export default About;
