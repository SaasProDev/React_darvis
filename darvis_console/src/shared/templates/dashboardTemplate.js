import React from 'react';
import { withRouter } from 'react-router';

import Navbar from '../molecules/navBar';
import SiteContextContainer from '../modules/sitesContext';
import ConfirmationModalContainer from '../modules/confirmationModal/container';

const DashboardTemplate = ({ match, children }) => {
  function wrapSiteContext(callback) {
    if (match.path.includes('admin')) {
      return callback();
    }
    return <SiteContextContainer>{callback()}</SiteContextContainer>;
  }
  return (
    <ConfirmationModalContainer>
      {wrapSiteContext(() => (
        <React.Fragment>
          <Navbar />
          <div className="container camera-system" style={{ marginBottom: '30px' }}>
            {children}
          </div>
        </React.Fragment>
      ))}
    </ConfirmationModalContainer>
  );
};

export default withRouter(DashboardTemplate);
