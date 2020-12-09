import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as R from 'ramda';
import SpotCard from '@/v1/components/SpotCard/SpotCard';
import NewsBlock from '@/v1/components/NewsBlock/NewsBlock';
import { css, StyleSheet } from '@/v2/aphrodite';
import { loadSpots } from '@/v2/redux/spots/actions';

const sortSpotsByActivity = (spot1, spot2) => {
  const activity1 = (
    spot1?.data?.statistics?.activity === undefined ? (
      spot1?.statistics?.activity
    ) : (
      spot1?.data?.statistics?.activity
    )
  );

  const activity2 = (
    spot2?.data?.statistics?.activity === undefined ? (
      spot2?.statistics?.activity
    ) : (
      spot2?.data.statistics?.activity
    )
  );

  if (activity1 === undefined) return +1;
  if (activity2 === undefined) return -1;

  return activity2 - activity1;
};

const MainPageContent = () => {
  const spots = useSelector(state => state.spotsStoreV2.spots);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(loadSpots()); }, []);

  const publicSpots = R.filter(spot => spot.data && spot.data.public)(Object.values(spots));

  return (
    <>
      <NewsBlock />
      <div className={css(style.spotsSection)}>
        <div className={css(style.spotsContainer)}>
          <h1 className={css(style.spotsHeader)}>Скалодромы</h1>
          <div className={css(style.spotsInnerContainer)}>
            {
              R.map(spot => <SpotCard key={spot.id} spot={spot} />)(
                R.sort(sortSpotsByActivity, publicSpots),
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

const style = StyleSheet.create({
  spotsSection: {
    paddingTop: '64px',
    paddingBottom: '34px',
    backgroundColor: '#FFFFFF',
  },
  spotsContainer: {
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  spotsHeader: {
    fontSize: '28px',
    fontFamily: 'GilroyMedium, sans-serif',
    color: '#1F1F1F',
    marginTop: 0,
    marginBottom: '40px',
  },
  spotsInnerContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: '-12px',
    marginRight: '-12px',
  },
});

export default MainPageContent;
