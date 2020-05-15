import React, { useState, useEffect } from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';

import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';

import LanguageContext from './context';

addLocaleData([...en, ...fr]);

const LanguageContainer = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [langResource, setLangResource] = useState({});

  useEffect(() => {
    if (language) {
      const languageResource = require(`../../../i18n/${language}.json`); // eslint-disable-line
      setLangResource(languageResource);
    }
  }, [language]);

  const switchLanguage = lang => {
    if (lang) {
      setLanguage(lang);
    }
  };

  return (
    <IntlProvider locale="en" messages={langResource}>
      <LanguageContext.Provider value={{ language, switchLanguage }}>{children}</LanguageContext.Provider>
    </IntlProvider>
  );
};

export default LanguageContainer;
