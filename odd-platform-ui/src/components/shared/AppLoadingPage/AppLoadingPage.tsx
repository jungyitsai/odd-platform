import React, { type FC } from 'react';
import AppCircularProgress from '../AppCircularProgress/AppCircularProgress';
import { Container } from './AppLoadingPageStyles';

const AppLoadingPage: FC = () => (
  <Container container>
    <AppCircularProgress size={70} background='transparent' progressBackground='dark' />
  </Container>
);

export default AppLoadingPage;
