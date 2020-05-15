import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'reactstrap';

import styles from '../styles.module.scss';

const CameraAddButton = ({ handleAddClick }) => {
  return (
    <div className={styles.cameraAddButton}>
      <div className={styles.cameraAddButtonBody}>
        <Button color="default" onClick={handleAddClick}>
          <FontAwesomeIcon size="5x" icon="plus" />
          <div style={{fontSize: '0.7rem'}}>Add new camera</div>
        </Button>
      </div>
    </div>
  );
};

CameraAddButton.defaultProps = {
  onClick: () => {},
};

export default CameraAddButton;
