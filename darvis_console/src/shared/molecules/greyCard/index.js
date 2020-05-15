import React from 'react';
import Card from '../card';

import './styles.scss';

const GreyCard = ({ children }) => (
  <Card dark>
    <header>
      {children.header}
      <span className="online-status">&#8226;</span>
    </header>
    <section className="grey-card">
      <table className="table table-dark grey-card__table color--lightgrey">
        <thead>{children.thead}</thead>
        <tbody className="grey-card__cell">{children.tbody}</tbody>
      </table>
    </section>
  </Card>
);

export default GreyCard;
