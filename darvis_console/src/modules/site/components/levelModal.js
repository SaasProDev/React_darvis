import React, { useState, useEffect } from 'react';
import { AvForm, AvField, AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';
import { Label, Row, Col, Button, ModalFooter, ModalBody, Spinner } from 'reactstrap';
import Dropzone from 'react-dropzone';

import styles from '../styles.module.scss';
import styled from 'styled-components';
import { ORIGIN } from '../../../config';

const StyledImage = styled.img`
  max-width: 100%;
`;

const LevelModal = ({ level, addLevel, updateLevel, dismiss }) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    setFormData({
      name: level ? level.name : '',
      plan: level ? level.plan : undefined,
      vtype: level ? level.vtype : 'plan',
      path: level ? ORIGIN + level.plan : '/placeholder.png'
    });
  }, [level]);

  function handleSubmit(event, values) {
    if(event) {
      const lvl = {
        _id: level ? level._id : undefined,
        name: values.name,
        scale: level ? level.scale : undefined,
        plan: formData.plan,
        vtype: formData.vtype,
        image: formData.image,
      };
      try {
        const callback = () => {
          setIsSaving(false);
        };
        setIsSaving(true);
        if (level) {
          updateLevel(lvl, () => callback(), () => callback());
        } else {
          addLevel(lvl, () => callback(), () => callback());
        }
      } catch(err) {
        console.log(err);
      }
    }
  }

  return (
    <AvForm onValidSubmit={handleSubmit}>
      <ModalBody className="p-4">
        <Row>
          <Col md={4}>
            <h2 className="m-b-30 m-t-10">{level ? 'Edit' : 'Add'} Level</h2>
            <AvField
              name="name"
              label="Name"
              type="text"
              value={formData.name}
              validate={{
                required: { value: true, errorMessage: 'Please enter a valid name' },
                minLength: { value: 3, errorMessage: 'Your name must be between 3 and 30 characters' },
                maxLength: { value: 30, errorMessage: 'Your name must be between 3 and 30 characters' },
              }}
            />
            <AvRadioGroup inline name="vtype" required value={formData.vtype} className="darvis-radio-group">
              <Label for="vtype" className="m-b-0 m-r-15">
                Type:
              </Label>
              <AvRadio label="map" value="map" disabled />
              <AvRadio label="plan" value="plan" />
              <AvRadio label="3d" value="3D model" disabled />
            </AvRadioGroup>
            <AvField
              name="plan"
              hidden
              value={formData.plan}
              validate={{
                required: { value: true, errorMessage: 'Please select a valid plan/map' },
              }}
            />
            <Dropzone
              onDrop={acceptedFiles => {
                const tmp = URL.createObjectURL(acceptedFiles[0]);
                setFormData({
                  ...formData,
                  plan: tmp,
                  path: tmp,
                  image: acceptedFiles[0],
                });
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="darvis-dropzone">
                      <StyledImage src="/images/upload-file-bg.png" alt="upload file" />
                    </div>
                  </div>
                </section>
              )}
            </Dropzone>
          </Col>
          <Col md={8}>
            <div className={`${styles.plan_height} darvis-border w-full`}>
              <img src={formData.path} alt="placeholder" className="w-full h-full" />
            </div>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter className={styles.gray}>
        {isSaving ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <Button type="submit" className="green-button m-r-20" size="lg">
              {level ? 'Update' : 'Add'} level
            </Button>
            <Button type="button" className="green-button m-r-20" onClick={dismiss} size="lg">
              Cancel
            </Button>
          </React.Fragment>
        )}
      </ModalFooter>
    </AvForm>
  );
};

export default LevelModal;
