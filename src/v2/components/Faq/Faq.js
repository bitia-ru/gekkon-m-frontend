import React from 'react';
import InfoPageHeader from '@/v2/components/InfoPageHeader/InfoPageHeader';
import InfoPageContent from '@/v2/components/InfoPageContent/InfoPageContent';
import { TITLE, TITLES, FAQ_DATA } from '@/v1/Constants/Faq';
import MainScreen from '@/v2/layouts/MainScreen/MainScreen';
import ScrollToTopOnMount from '@/v1/components/ScrollToTopOnMount';

const Faq = () => (
  <>
    <ScrollToTopOnMount />
    <MainScreen
      header={
        <InfoPageHeader
          title={TITLE}
          image={require('./images/faq.jpg')}
        />
      }
    >
      <InfoPageContent titles={TITLES} data={FAQ_DATA} />
    </MainScreen>
  </>
);

export default Faq;
