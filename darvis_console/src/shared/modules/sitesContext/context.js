import React from 'react';

const SitesContext = React.createContext({
  sites: [],
  selectedSite : {},
  selectSite: () => {},
  setSelectedSite: () => {},
  reloadSites: () => {}
});

export default SitesContext;
