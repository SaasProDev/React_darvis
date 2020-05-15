import React from 'react';

const LanguageContext = React.createContext({
  language: 'en',
  switchLanguage: () => {},
});

export default LanguageContext;
