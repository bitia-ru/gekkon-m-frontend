import React from 'react';
import { withRouter } from 'react-router-dom';
import MainPageHeader from '@/v2/components/MainPageHeader/MainPageHeader';
import MainPageContent from '@/v1/components/MainPageContent/MainPageContent';
import ScrollToTopOnMount from '@/v1/components/ScrollToTopOnMount';
import MainScreen from '@/v2/layouts/MainScreen/MainScreen';

class SpotsIndex extends React.PureComponent {
  render() {
    return (
      <>
        <ScrollToTopOnMount />
        <MainScreen
          header={
            <MainPageHeader />
          }
        >
          <MainPageContent />
        </MainScreen>
      </>
    );
  }
}

export default withRouter(SpotsIndex);
