import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router';

import { getSite } from '../../services/sites';
import SitesContext from './context';
import ErrorContext from '../error/context';

const SitesContextContainer = ({ history, children }) => {
  const errorContext = useContext(ErrorContext);
  const storageSite = JSON.parse(localStorage.getItem('selectedSite'));
  const [state, setState] = useState({
    selectedSite: storageSite,
    reset: 0,
    loading: false,
  });

  useEffect(() => {
    async function loadSite() {
      try {
        setState(s => ({ ...s, loading: true }));
        const site = await getSite(state.selectedSite._id);
        setState(s => ({ ...s, selectedSite: site, loading: false }));
        localStorage.setItem('selectedSite', JSON.stringify(site));
      } catch (e) {
        setState(s => ({ ...s, loading: false }));
        errorContext.setError(e, true);
      }
    }

    if (!state.selectedSite) {
      history.push('/console/site');
    } else {
      loadSite();
    }
  }, [history, state.reset, errorContext, setState]);

  function setSelectedSite(site) {
    setState({
      ...state,
      selectedSite: site,
    });
  }

  function reloadSites() {
    setState({
      ...state,
      reset: state.reset + 1,
    });
  }

  return (
    <SitesContext.Provider
      value={{
        loading: state.loading,
        selectedSite: state.selectedSite,
        selectSite: site => {
          setState({
            selectSite: site,
          });
          localStorage.setItem('selectedSite', JSON.stringify(site));
          history.push('/console/site');
        },
        reloadSites,
        setSelectedSite,
      }}
    >
      {children}
    </SitesContext.Provider>
  );
};

export default withRouter(SitesContextContainer);
