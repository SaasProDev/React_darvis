import React from 'react';
import { CustomInput } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { ORIGIN } from '../../../config';
import ConfirmationContext from '../../../shared/modules/confirmationModal/context';
import styles from '../styles.module.scss';


const StyledImage = styled.img`
  max-width: 100%;
`;

const CameraPreview = ({ camera, updateCamera, deleteCamera, refreshCamera, enableCamera }) => {
  return (
    <div className={styles.cameraCard}>
      <div>
        <StyledImage src={ORIGIN + camera.image} className={styles.cardBodyImage} />
      </div>
      <button className={styles.refreshButton} onClick={refreshCamera}>
        <FontAwesomeIcon
          icon="sync-alt"
        />
      </button>

      <CustomInput 
        type="switch" 
        name="status" 
        id={camera._id} 
        className={styles.switch} 
        defaultChecked={camera.isActive} 
        onChange={enableCamera}
      />
      <div className={styles.cameraCardFooter}>
        <span>{camera.name} ( {camera.type} )</span>
        <span>
          <button className={styles.editButton} onClick={updateCamera}><FontAwesomeIcon icon="pen" /></button>
          <ConfirmationContext.Consumer>
            {({ setConfirmationModal, resetConfirmationModal, setLoader }) => (
              <button
                className={styles.trashButton}
                onClick={() => {
                  setConfirmationModal(s => ({
                    ...s,
                    visible: true,
                    item: camera.name,
                    callback: () => {
                      setLoader(true);
                      deleteCamera(camera._id, () => resetConfirmationModal(), () => setLoader(false));
                    }
                  }));
                }}>
                <FontAwesomeIcon icon="trash" />
              </button>
            )}
          </ConfirmationContext.Consumer>
        </span>
      </div>
    </div>

  );
};

export default CameraPreview;