import React, { useState, useEffect } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { ModalHeader, ModalBody, ModalFooter, Row, Col, Spinner, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ContentEditable from 'react-contenteditable';

import styles from '../styles.module.scss';

const ActionModal = ({ trigger, updateTrigger, dismiss }) => {
  const [isSaving, setIsSaving] = useState(false);
  const initialData = {
    loading: false,
    aidata: [
      { label: 'id', value: 'id' },
      { label: 'camera_id', value: 'camerea_id' },
      { label: 'camera_name', value: 'camera_name' },
      { label: 'timestamp', value: 'timestamp' },
      { label: 'object_type', value: 'object_type' },
      { label: 'loc_x', value: 'loc_x' },
      { label: 'loc_y', value: 'loc_y' },
    ],
    actions: [
      { label: 'Publish trigger to topic', value: 'publish' },
      { label: 'Send a json to an endpoint', value: 'json' },
      { label: 'Send a text message', value: 'text' },
      { label: 'Send an email', value: 'email' }
    ],
    fieldTypes: [
      { label: 'AI section', value: 'ai_section' },
      { label: 'Constant', value: 'constant' }
    ],
  };

  const editableRef = React.createRef();
  const formRef = React.createRef();

  const [formData, setFormData] = useState({
    loading: false,
    triggerName: trigger.name,
    actionType: 'publish',
    actionReceipient: '',
    actionReceipientLabel: 'Endpoint URL :',
    fields: [],
    html: '',
    textmodeAI: 'id',
  }, []);

  useEffect(() => {
    if (trigger && trigger.action && Object.keys(trigger.action).length > 0) {
      let label = 'Endpoint URL :';
      if (trigger.action.type === 'publish' || trigger.action.type === 'json') {
        label = 'Endpoint URL :';
      } else if (trigger.action.type === 'text') {
        label = 'Recipient mobile number(s) :';
      } else if (trigger.action.type === 'email') {
        label = 'Recipient email address(es) :';
      }

      setFormData({
        loading: false,
        triggerName: trigger.name ? trigger.name : '',
        actionType: trigger.action.type ? trigger.action.type : 'publish',
        actionReceipient: trigger.action.receipient ? trigger.action.receipient : '',
        actionReceipientLabel: label,
        fields: trigger.action.fields && trigger.action.fields.length > 0 ? trigger.action.fields : [],
        html: trigger.action.html ? trigger.action.html : '',
        textmodeAI: 'id',
      });
    }
  }, [trigger]);

  const onEditableBlur = (event) => {
    //event.preventDefault();
    if (event && event.target.tagName === 'INPUT') {
      event.target.attributes.value.nodeValue = event.target.value;
    } else {
      setFormData({
        ...formData,
        html: editableRef.current.innerHTML
      })
    }
  }

  const onActionTypeChanged = (event, value) => {
    try {
      if (event) {
        let lbl = '';
        if (value === 'publish' || value === 'json') {
          lbl = 'Endpoint URL :';
        } else if (value === 'email') {
          lbl = 'Recipient email address(es) :';
        } else if (value === 'text') {
          lbl = 'Recipient mobile number(s) :';
        }
        setFormData(s => ({
          ...s,
          actionReceipientLabel: lbl,
          actionReceipient: '',
          actionType: value
        }));
      }
    } catch (e) {

    }
  }
  const addField = (event) => {
    if (event) {
      if (formData.actionType === 'publish' || formData.actionType === 'json') {
        setFormData({
          ...formData,
          fields: [
            ...formData.fields,
            {
              name: '',
              type: 'constant',
              value: '',
            }
          ],
        });
      } else if (formData.actionType === 'text' || formData.actionType === 'email') {
        let inputVal = '';
        if (formData.textmodeAI === 'input') {
          inputVal = `<input class='innerEdit' type='text' value='' />`;
        } else {
          inputVal = `<input class='innerSpan' type='text' disabled value='${formData.textmodeAI}' />`
        }
        let html = editableRef.current.innerHTML;

        if (html.endsWith('</div>')) {
          html = html.replace(new RegExp('</div>$'), inputVal + '</div>');
        } else {
          html = editableRef.current.innerHTML + inputVal;
        }
        editableRef.current.innerHTML = html;
      }
    }
  }
  const deleteField = (index) => {
    let fields = formData.fields;
    fields.splice(index, 1);
    setFormData(s => ({
      ...s,
      fields
    }));
  }
  const onFieldTypeChange = (event, value) => {
    try {
      if (event) {
        let index = event.target.name.split('_')[1];
        let fields = formData.fields;
        fields[index].type = value;
        fields[index].value = '';
        setFormData({
          ...formData,
          fields: [...fields],
          html: ''
        });
      }
    } catch (e) {
    }

  }
  const onTextmodeAIChange = (event, value) => {
    try {
      if (event) {
        setFormData({
          ...formData,
          textmodeAI: value,
          html: editableRef.current.innerHTML
        });
      }
    } catch (e) {

    }
  }
  const onFieldValueChange = (event, value) => {
    if (event) {
      let index = event.target.name.split('_')[1];
      let fields = formData.fields;
      fields[index].value = value;
      setFormData(s => ({
        ...s,
        fields
      }));
    }
  }
  const onFieldNameChange = (event, value) => {
    try {
      if (event) {
        let index = event.target.name.split('_')[1];
        let fields = formData.fields;
        fields[index].name = value;
        setFormData(s => ({
          ...s,
          fields
        }));
      }
    } catch (e) {

    }
  }
  const beforeSubmit = (event) => {
    if (formData.actionType === 'text' || formData.actionType === 'email') {
      setFormData({
        ...formData,
        html: editableRef.current.innerHTML
      });
    }
    formRef.current.submit();
  }
  const handleValidSubmit = (event, values) => {
    let body = [];
    let action = {};
    const cb = () => {
      setIsSaving(false);
      dismiss();
    }
    const errcb = () => {
      setIsSaving(false);
      dismiss();
    }

    action.type = values.actionType;
    if (values.actionType === 'publish') {
      action.receipient = 'trigger';
    } else {
      action.receipient = values.actionReceipient;
    }

    if (values.actionType === 'publish' || values.actionType === 'json') {
      if (formData.fields && formData.fields.length > 0) {
        formData.fields.map(item => {
          if (item.name !== '' && item.value !== '') {
            body.push({ name: item.name, type: item.type, value: item.value });
          }
        });
      }
      if (body.length === 0) {
        // error
        return;

      } else {
        action.fields = body;
      }

    } else if (values.actionType === 'text' || values.actionType === 'email') {
      // get body text
      let html = formData.html;
      if (html === '') {
        return;
      }
      action.html = html;
      // parsing
      html = html.replace(new RegExp('&nbsp;', 'g'), ' ');
      html = html.replace(new RegExp('<input class="innerSpan" type="text" disabled="" value=', 'g'), '');
      html = html.replace(new RegExp('<input class="innerEdit" type="text" value=', 'g'), '');
      html = html.replace(new RegExp('</span>', 'g'), '%');
      html = html.replace(new RegExp('<div>', 'g'), '');
      html = html.replace(new RegExp('</div>', 'g'), '');
      html = html.replace(new RegExp('<br />', 'g'), '');
      html = html.replace(new RegExp('<br>', 'g'), '');
      html = html.replace(new RegExp('>', 'g'), '');
      html = html.replace(new RegExp('%%', 'g'), '');
      html = html.replace(new RegExp('"', 'g'), '%');
      action.body = html;
    }

    let t = trigger;
    t.action = action;
    setIsSaving(true);
    updateTrigger(t, cb, errcb);
  }

  return (
    <React.Fragment>
      {formData.loading ? (
        <ModalBody>
          <Spinner />
          <div>loading...</div>
        </ModalBody>
      ) : (
          <AvForm
            ref={formRef}
            onValidSubmit={handleValidSubmit}
          >
            <ModalHeader>{formData.actionReceipient ? 'Edit' : 'Add'} action</ModalHeader>
            <ModalBody className='p-l-30 p-r-30' style={{ height: '450px', overflow: 'auto' }}>
              <Row>
                <Col md={12} style={{ textAlign: 'center' }}>
                  <h5>Alert name : {formData.triggerName}</h5>
                </Col>
              </Row>
              <Row className='m-t-20'>
                <Col md={12}>
                  <AvField
                    type='select'
                    name='actionType'
                    label='Type'
                    value={formData.actionType}
                    onChange={onActionTypeChanged}
                  >
                    {initialData.actions && initialData.actions.map(item => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </AvField>
                </Col>
              </Row>
              {formData.actionType !== 'publish' && (
                <Row>
                  <Col md={12}>
                    <AvField
                      type='text'
                      name='actionReceipient'
                      label={formData.actionReceipientLabel}
                      value={formData.actionReceipient}
                      required
                    />
                  </Col>
                </Row>
              )}
              {(formData.actionType === 'publish' || formData.actionType === 'json') ? (
                <React.Fragment>
                  <Row>
                    <Col md={4} className='p-r-0'>Field name</Col>
                    <Col md={3} className='p-l-5 p-r-5'>Type</Col>
                    <Col md={4} className='p-l-0 p-r-5'>Value</Col>
                    <Col md={1} className='p-l-5'>#</Col>
                  </Row>
                  {formData.fields && formData.fields.map((item, i) => (
                    <Row key={'field_' + i}>
                      <Col md={4} className='p-r-0'>
                        <AvField
                          type='text'
                          name={'fieldName_' + i}
                          value={item.name}
                          onChange={onFieldNameChange}
                        />
                      </Col>
                      <Col md={3} className='p-l-5 p-r-5'>
                        <AvField
                          type='select'
                          name={'fieldType_' + i}
                          value={item.type}
                          onChange={onFieldTypeChange}
                        >
                          {initialData.fieldTypes.map(t => (
                            <option key={'fieldType_' + i + t.value} value={t.value}>{t.label}</option>
                          ))}
                        </AvField>
                      </Col>
                      <Col md={4} className='p-l-0 p-r-5'>
                        {item.type === 'constant' ? (
                          <AvField
                            type='text'
                            name={'fieldValue_' + i}
                            value={item.value}
                            onChange={onFieldValueChange}
                          />
                        ) : (
                            <AvField
                              type='select'
                              name={'fieldValue_' + i}
                              onChange={onFieldValueChange}
                              value={item.value}
                            >
                              {initialData.aidata && initialData.aidata.map((data, j) => (
                                <option key={'fieldValuelst_' + j + data.value} value={data.value}>{data.label}</option>
                              ))}
                            </AvField>
                          )}
                      </Col>
                      <Col md={1} className='p-l-5'>
                        <button className={`${styles.blue} m-t-7`} type="button" onClick={() => { deleteField(i) }}>
                          <FontAwesomeIcon size="lg" icon="times" />
                        </button>
                      </Col>
                    </Row>
                  ))}

                </React.Fragment>

              ) : (
                  <React.Fragment>
                    <ContentEditable
                      innerRef={editableRef}
                      name='editable'
                      className={styles.editable}
                      html={formData.html}
                      onBlur={onEditableBlur}
                    />
                  </React.Fragment>
                )}
              <Row className='m-t-10'>
                {(formData.actionType === 'text' || formData.actionType === 'email') && (
                  <AvField
                    type='select'
                    name='textmodeAI'
                    onChange={onTextmodeAIChange}
                    className='m-l-15'
                    value={formData.textmodeAI}
                  >
                    {initialData.aidata && initialData.aidata.map((data, j) => (
                      <option key={'textmodeai_' + j + data.value} value={data.value}>{data.label}</option>
                    ))}
                  </AvField>
                )}
                <button className={`${styles.blue} m-l-30 p-b-10`} type="button" onClick={addField}>
                  <FontAwesomeIcon size="1x" icon="plus-circle" />
                  <span className="pl-1">Add new field</span>
                </button>
              </Row>
            </ModalBody>
            <ModalFooter style={{ backgroundColor: '#e5e5e5' }}>
              {(isSaving) ? (
                <Spinner />
              ) : (
                  <React.Fragment>
                    <Button type='button' className='green-button' onClick={beforeSubmit}>{formData.actionReceipient ? 'Update ' : 'Save '}action</Button>
                    <Button type='button' className='green-button' onClick={dismiss}>Cancel</Button>
                  </React.Fragment>
                )}
            </ModalFooter>
          </AvForm>
        )}
    </React.Fragment>
  )
}

export default ActionModal;