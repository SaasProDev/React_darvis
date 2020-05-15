import React, { useState, useEffect, useContext } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { ModalHeader, ModalBody, ModalFooter, Row, Col, Spinner, Button } from 'reactstrap';

import ErrorContext from '../../../shared/modules/error/context';

const KPIModal = ({ kpi, site, addKPI, updateKPI, dismiss }) => {
  // state for the saving modal
  const [isSaving, setIsSaving] = useState(false);
  const { setError } = useContext(ErrorContext);
  const [initialData, setInitialData] = useState({
    loading: false,
    ai: [],
    types: [
      { label: 'Count objects', value: 'count' },
      { label: 'Count objects doing something', value: 'event_count' },
      { label: 'Measure duration of objects doing something', value: 'duration' }
    ],
    eventTypes: [
      { label: 'None', value: '' },
      { label: 'Entering an area', value: 'Area_enter' },
      { label: 'Leaving an area', value: 'Area_leave' },
      { label: 'Crossing a line', value: 'Line_cross' },
      { label: 'Changing attribute', value: 'attribute_change' },
      { label: 'Changing state', value: 'state_change' }
    ],
    interval: [
      { label: 'second', value: 1 },
      { label: 'minute', value: 60 },
      { label: 'hour', value: 3600 },
    ],
    zl: [],
  });
  // loading initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialData({
          ...initialData,
          loading: true
        });
        debugger;
        const ai = site.ai ? site.ai : {};
        
        let zl = [{ label: 'all', value: 'all' }];
        if (site) {
          site.levels.map(l => {
            zl.push({ label: l.name, value: l.name });
            l.zones.map(z => (zl.push({ label: z.name, value: z.name })));
          });
        }
        setInitialData({ ...initialData, ai: ai, zl: zl, loading: false });
      } catch (e) {
        setError(e, true);
        setInitialData({ ...initialData, ai: [], zl: [], loading: false });
      }
    };
    fetchData();
  }, [site]);
  const [formData, setFormData] = useState({
    name: '',
    interval: 60,
    type: 'count',
    object: '',
    attribute: '',
    state: '',
    where: '',
    event1Type: '',
    event1Value: '',
    event2Type: '',
    event2Value: '',
  });
  useEffect(() => {
    setFormData({
      name: kpi ? kpi.name : '',
      interval: kpi ? kpi.interval : 60,
      type: kpi ? kpi.type : 'count',
      object: kpi ? kpi.object : '',
      attribute: kpi ? kpi.attribute : '',
      state: kpi ? kpi.state : '',
      where: kpi ? kpi.where : 'all',
      event1Type: kpi && kpi.events && kpi.events.length > 0 ? kpi.events[0].event : '',
      event1Value: kpi && kpi.events && kpi.events.length > 0 ? kpi.events[0].value : '',
      event2Type: kpi && kpi.events && kpi.events.length > 1 ? kpi.events[1].event : '',
      event2Value: kpi && kpi.events && kpi.events.length > 1 ? kpi.events[1].value : '',
    });
    if (kpi) {
      if (kpi.object && initialData.ai.classes) {
        // set attributes, states to list
        let e1Type = '';
        let e2Type = '';
        if (kpi.events) {
          e1Type = kpi.events[0].event;
          if (kpi.events.length === 2) {
            e2Type = kpi.events[1].event;
          }
        }
        objectChanged(kpi.object, e1Type, e2Type);
        initialEventType(e1Type, e2Type);
      }
    }
  }, [kpi, initialData]);
  const [aiAttrState, setAiAttrState] = useState({
    attributes: [],
    states: [],
    lines: []
  });
  const [eventValues, setEventValues] = useState({
    event1Values: [],
    event1Label: 'Select',
    event2Values: [],
    event2Label: 'Select'
  });
  const onTypeChange = (event, value) => {
    setFormData(s => ({
      ...s,
      type: value
    }));
  }
  const objectChanged = (value, event1Type, event2Type) => {
    const ai = initialData.ai.classes.find(x => x.className === value);
    let a = [];
    let s = [];
    let l = [];
    if (ai) {
      if (ai.attributes && ai.attributes.length > 0) {
        a.push({ label: 'None', value: '' });
        ai.attributes.map(item => (a.push({ label: item, value: item })));
      } else {
        a = [{ label: 'no attributes available', value: 'none' }];
      }
      if (ai.states && ai.states.length > 0) {
        s.push({ label: 'None', value: '' });
        ai.states.map(item => (s.push({ label: item, value: item })));
      } else {
        s = [{ label: 'no states available', value: 'none' }];
      }
      l = [{ label: 'no lines available', value: 'none' }];
    } else {
      // error case
    }
    setAiAttrState({
      attributes: a,
      states: s,
      lines: l,
    });
    if (event1Type === 'attribute_change') {
      setEventValues({ ...eventValues, event1Values: a });
    }
    if (event1Type === 'state_change') {
      setEventValues({ ...eventValues, event1Values: s });
    }
    if (event1Type === 'Line_cross') {
      setEventValues({ ...eventValues, event1Values: l });
    }
    if (event2Type === 'attribute_change') {
      setEventValues({ ...eventValues, event2Values: a });
    }
    if (event2Type === 'state_change') {
      setEventValues({ ...eventValues, event2Values: s });
    }
    if (event2Type === 'Line_cross') {
      setEventValues({ ...eventValues, event2Values: l });
    }
  }
  const initialEventType = (event1Type, event2Type) => {
    if (event1Type === 'Area_enter' || event1Type === 'Area_leave') {
      setEventValues({ ...eventValues, event1Values: initialData.zl, event1Label: 'Area' });
      setFormData({ ...formData, event1Value: 'all' });
    }
    if (event2Type === 'Area_enter' || event2Type === 'Area_leave') {
      setEventValues({ ...eventValues, event2Values: initialData.zl, event2Label: 'Area' });
      setFormData({ ...formData, event1Value: 'all' });
    }
  }
  const onObjectChange = (event, value) => {
    // here need to change attributes and states
    if (event && initialData.ai && initialData.ai.classes) {
      objectChanged(value, formData.event1Type, formData.event2Type);
    }

  }
  const event1TypeChange = (event, value) => {
    setFormData(s => ({ ...s, event1Type: value }));
    if (value === 'Area_enter' || value === 'Area_leave') {
      setEventValues(s => ({ ...s, event1Values: initialData.zl, event1Label: 'Area' }));
      setFormData(s => ({ ...s, event1Value: 'all' }));
    } else if (value === 'Line_cross') {
      setEventValues(s => ({ ...s, event1Values: aiAttrState.lines, event1Label: 'Line' }));
    } else if (value === 'attribute_change') {
      setEventValues(s => ({ ...s, event1Values: aiAttrState.attributes, event1Label: 'To attribute' }));
    } else if (value === 'state_change') {
      setEventValues(s => ({ ...s, event1Values: aiAttrState.states, event1Label: 'To state' }));
    } else {
      setEventValues(s => ({ ...s, event1Values: [], event1Label: 'Select' }));
    }
  }
  const event2TypeChange = (event, value) => {
    setFormData(s => ({ ...s, event2Type: value }));
    if (value === 'Area_enter' || value === 'Area_leave') {
      setEventValues(s => ({ ...s, event2Values: initialData.zl, event2Label: 'Area' }));
      setFormData(s => ({ ...s, event2Value: 'all' }));
    } else if (value === 'Line_cross') {
      setEventValues(s => ({ ...s, event2Values: aiAttrState.lines, event2Label: 'Line' }))
    } else if (value === 'attribute_change') {
      setEventValues(s => ({ ...s, event2Values: aiAttrState.attributes, event2Label: 'To attribute' }));
    } else if (value === 'state_change') {
      setEventValues(s => ({ ...s, event2Values: aiAttrState.states, event2Label: 'To state' }));
    } else {
      setEventValues(s => ({ ...s, event2Values: [], event2Label: 'Select' }));
    }
  }
  const generateKPI = (values) => {
    let k = {
      name: values.name,
      type: values.type,
      interval: values.interval,
      object: values.object,
      where: values.where,
    }
    if (values.attribute && values.attribute !== '' && values.attribute !== 'None') {
      k.attribute = values.attribute;
    }
    if (values.state && values.state !== '' && values.state !== 'None') {
      k.state = values.state;
    }
    if (values.event1Type) {
      let events = [];
      events.push({
        event: values.event1Type,
        value: values.event1Value
      });
      if (values.event2Type) {
        events.push({
          event: values.event2Type,
          value: values.event2Value
        });
      }
      k.events = events;
    }
    return k;
  }
  const handleSubmit = (event, values) => {
    const callback = () => {
      setIsSaving(false);
    };
    const errCallback = () => {
      setIsSaving(false);
    };
    setIsSaving(true);
    let k = generateKPI(values);
    if (kpi) {
      k = {
        _id: kpi._id,
        ...k
      };
      updateKPI(k, callback, errCallback);
    } else {
      addKPI(k, callback, errCallback);
    }
  }
  
  return (
    <React.Fragment>
      {initialData.loading ? (
        <ModalBody>
          <Spinner />
          <br />
          <div>Loading...</div>
        </ModalBody>
      ) : (
          <AvForm onValidSubmit={handleSubmit}>
            <ModalHeader>{kpi ? 'Edit ' : 'Add '} KPI</ModalHeader>
            <ModalBody>
              {/* Name & interval */}
              <Row>
                <Col md={7}>
                  <AvField type='text' name='name' label='Name of KPI' value={formData.name} required />
                </Col>
                <Col md={5}>
                  <AvField type='select' name='interval' label='Interval' value={formData.interval}>
                    {initialData.interval && (initialData.interval.map(item => (<option key={item.value} value={item.value}>{item.label}</option>)))}
                  </AvField>
                </Col>
              </Row>
              {/* Type */}
              <Row>
                <Col md={12}>
                  <AvField type='select' name='type' label='Select the type' value={formData.type} onChange={onTypeChange}>
                    {initialData.types && (initialData.types.map(item => (<option key={item.value} value={item.value}>{item.label}</option>)))}
                  </AvField>
                </Col>
              </Row>
              {/* Object */}
              <Row>
                <Col md={12}>
                  <AvField type='select' name='object' label='Select the object' value={formData.object} onChange={onObjectChange} required>
                    <option value=''>None</option>
                    {initialData.ai && initialData.ai.classes && initialData.ai.classes.map(item => (<option key={item.classId} value={item.className}>{item.className}</option>))}
                  </AvField>
                </Col>
              </Row>
              {/* Attribute and state for count */}
              <Row>
                <Col md={6}>
                  <AvField type='select' name='attribute' label='Attribute' value={formData.attribute}>
                    {aiAttrState && aiAttrState.attributes.map(item => (<option key={item.value} value={item.label}>{item.label}</option>))}
                  </AvField>
                </Col>
                <Col md={6}>
                  <AvField type='select' name='state' label='State' value={formData.state}>
                    {aiAttrState && aiAttrState.states.map(item => (<option key={item.value} value={item.label}>{item.label}</option>))}
                  </AvField>
                </Col>
              </Row>
              {/* Where for count */}
              {formData.type === 'count' && (
                <Row>
                  <Col md={12}>
                    <AvField type='select' name='where' label='Where' value={formData.where}>
                      {initialData.zl && initialData.zl.map(item => (<option key={item.value} value={item.label}>{item.label}</option>))}
                    </AvField>
                  </Col>
                </Row>
              )}
              {/* Start event */}
              {formData.type !== 'count' && (
                <Row>
                  <Col md={6}>
                    <AvField
                      type='select'
                      name='event1Type'
                      label={formData.type === 'duration' ? 'Start' : 'Count objects doing what?'}
                      value={formData.event1Type}
                      onChange={event1TypeChange}
                      required
                    >
                      {initialData.eventTypes && initialData.eventTypes.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
                    </AvField>
                  </Col>
                  <Col md={6}>
                    <AvField
                      type='select'
                      name='event1Value'
                      label={eventValues.event1Label}
                      value={formData.event1Value}
                      required
                    >
                      {eventValues.event1Values && eventValues.event1Values.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
                    </AvField>
                  </Col>
                </Row>
              )}
              {/* End event */}
              {formData.type === 'duration' && (
                <Row>
                  <Col md={6}>
                    <AvField
                      type='select'
                      name='event2Type'
                      label='End'
                      value={formData.event2Type}
                      onChange={event2TypeChange}
                      required
                    >
                      {initialData.eventTypes && initialData.eventTypes.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
                    </AvField>
                  </Col>
                  <Col md={6}>
                    <AvField
                      type='select'
                      name='event2Value'
                      label={eventValues.event2Label}
                      value={formData.event2Value}
                      required
                    >
                      {eventValues.event2Values && eventValues.event2Values.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
                    </AvField>
                  </Col>
                </Row>
              )}
            </ModalBody>
            <ModalFooter style={{ backgroundColor: '#e5e5e5' }}>
              {(isSaving) ? (
                <Spinner />
              ) : (
                  <React.Fragment>
                    <Button type='submit' className='green-button'>{kpi ? 'Update ' : 'Save '}KPI</Button>
                    <Button type='button' className='green-button' onClick={dismiss}>Cancel</Button>
                  </React.Fragment>
                )}
            </ModalFooter>
          </AvForm>
        )}
    </React.Fragment>
  );
};

export default KPIModal;