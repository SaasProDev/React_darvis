import React from 'react';
import { Card as BsCard, CardBody, CardHeader } from 'reactstrap';
import cn from 'classnames';

import styles from './styles.module.scss';

const Card = ({ children, dark, className, bodyClass, actionHandler, header, ...rest }) => (
  <BsCard className={cn(styles.card, className, (() => dark && styles.dark)())} {...rest}>
    {header && (
      <CardHeader className={styles.cardHeader}>
        {header}
        {actionHandler}
      </CardHeader>
    )}
    <CardBody className={bodyClass}>{children}</CardBody>
  </BsCard>
);

Card.defaultProps = {
  dark: false,
  header: undefined,
  actionHandler: undefined,
};

export default Card;
