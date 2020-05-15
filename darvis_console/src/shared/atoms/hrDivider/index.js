import React from 'react';
import styles from './styles.module.scss';

const HrDivider = ({ bold, color }) => {
  return <hr style={{ borderColor: color }} className={bold ? styles.hr : ''} />;
};

HrDivider.defaultProps = {
  bold: true,
  color: 'black',
};

export default HrDivider;
