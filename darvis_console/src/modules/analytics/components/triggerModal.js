import React, { useState, useEffect, useContext } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { ModalHeader, ModalBody, ModalFooter, Row, Col, Spinner, Button } from 'reactstrap';

import ErrorContext from '../../../shared/modules/error/context';

const TriggerModal = ({ trigger, site, addTrigger, updateTrigger, dismiss }) => {
  const { setError } = useContext(ErrorContext);
  const [isSaving, setIsSaving] = useState(false);
  const [initialData, setInitialData] = useState({
    loading: false,
    ai: [],
    triggerTypes: [
      { label: 'Comparing object counts', value: 'count' },
      { label: 'Comparing elapsed time of events', value: 'elapsed' },
      { label: 'Objects doing something', value: 'object' },
    ],
    countTypes: [
      { label: 'Trigger on the count below', value: 'number' },
      { label: 'Trigger on an event below', value: 'event' },
    ],
    elapsedTypes: [
      { label: 'Trigger on the seconds below', value: 'number' },
      { label: 'Trigger on the event below', value: 'event' },
    ],
    eventTypes: [
      { label: 'Entering', value: 'enter' },
      { label: 'Leaving', value: 'leave' },
      { label: 'Crossing a line', value: 'cross' },
    ],
    objectTypes: [
      { label: 'Entering an area', value: 'enter' },
      { label: 'Leaving an area', value: 'leave' },
      { label: 'Crossing a line', value: 'cross' },
      { label: 'Changing an attribute', value: 'attrib_change' },
      { label: 'Changing their state', value: 'state_change' }
    ],
    zl: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialData({ ...initialData, loading: true });
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
    triggerType: 'count',
    condition: '',
    arg1: '',
    attr1: '',
    state1: '',
    area1: 'all',
    event1: '',
    line1: '',
    arg2: '',
    attr2: '',
    state2: '',
    area2: 'all',
    event2: '',
    line2: '',
  });
  useEffect(() => {
    if (trigger && initialData) {
      let triggerType = '';
      let condition = '';
      let arg1 = '';
      let attr1 = '';
      let state1 = '';
      let area1 = 'all';
      let event1 = '';
      let line1 = '';
      let arg2 = '';
      let attr2 = '';
      let state2 = '';
      let area2 = '';
      let event2 = '';
      let line2 = '';
      if (trigger.condition.type === 'count') {
        triggerType = 'count';
        arg1 = trigger.condition.argument[0].class;
        attr1 = trigger.condition.argument[0].attribute ? trigger.condition.argument[0].attribute : '';
        state1 = trigger.condition.argument[0].state ? trigger.condition.argument[0].state : '';
        area1 = trigger.condition.argument[0].area ? trigger.condition.argument[0].area : '';
        if (typeof trigger.condition.argument[1] === 'object') {
          condition = 'event';
          arg2 = trigger.condition.argument[1].class;
          attr2 = trigger.condition.argument[1].attribute ? trigger.condition.argument[1].attribute : '';
          state2 = trigger.condition.argument[1].state ? trigger.condition.argument[1].state : '';
          area2 = trigger.condition.argument[1].area ? trigger.condition.argument[1].area : '';
        } else {
          condition = 'number';
          arg2 = trigger.condition.argument[1];
        }
      } else if (trigger.condition.type === 'elapsed') {
        triggerType = 'elapsed';
        event1 = trigger.condition.argument[0].event_type;
        arg1 = trigger.condition.argument[0].argument1.class;
        attr1 = trigger.condition.argument[0].argument1.attribute ? trigger.condition.argument[0].argument1.attribute : '';
        state1 = trigger.condition.argument[0].argument1.state ? trigger.condition.argument[0].argument1.state : '';
        area1 = trigger.condition.argument[0].argument1.area ? trigger.condition.argument[0].argument1.area : '';
        if (typeof trigger.condition.argument[1] === 'object') {
          condition = 'event';
          event2 = trigger.condition.argument[1].event_type;
          arg2 = trigger.condition.argument[1].argument2.class;
          attr2 = trigger.condition.argument[1].argument2.attribute ? trigger.condition.argument[1].argument2.attribute : '';
          state2 = trigger.condition.argument[1].argument2.state ? trigger.condition.argument[1].argument2.state : '';
          area2 = trigger.condition.argument[1].argument2.area ? trigger.condition.argument[1].argument2.area : '';
        } else {
          condition = 'number';
          arg2 = trigger.condition.argument[1];
        }
      } else if (trigger.condition.type === 'enter') {
        triggerType = 'object';
        condition = 'enter';
        arg1 = trigger.condition.argument[0].class;
        attr1 = trigger.condition.argument[0].attribute ? trigger.condition.argument[0].attribute : '';
        state1 = trigger.condition.argument[0].state ? trigger.condition.argument[0].state : '';
        arg2 = trigger.condition.argument[0].area ? trigger.condition.argument[0].area : '';
      } else if (trigger.condition.type === 'leave') {
        triggerType = 'object';
        condition = 'leave';
        arg1 = trigger.condition.argument[0].class;
        attr1 = trigger.condition.argument[0].attribute ? trigger.condition.argument[0].attribute : '';
        state1 = trigger.condition.argument[0].state ? trigger.condition.argument[0].state : '';
        arg2 = trigger.condition.argument[0].area ? trigger.condition.argument[0].area : '';
      } else if (trigger.condition.type === 'cross') {
        triggerType = 'object';
        condition = 'cross';
        arg1 = trigger.condition.argument[0].class;
        attr1 = trigger.condition.argument[0].attribute ? trigger.condition.argument[0].attribute : '';
        state1 = trigger.condition.argument[0].state ? trigger.condition.argument[0].state : '';
        arg2 = trigger.condition.argument[0].line ? trigger.condition.argument[0].line : '';
      } else if (trigger.condition.type === 'attrib_change') {
        triggerType = 'object';
        condition = 'attrib_change';
        arg1 = trigger.condition.class;
        state1 = trigger.condition.state;
        area1 = trigger.condition.area;
        attr1 = trigger.condition.argument[0];
        attr2 = trigger.condition.argument[1];

      } else if (trigger.condition.type === 'state_change') {
        triggerType = 'object';
        condition = 'state_change';
        arg1 = trigger.condition.class;
        attr1 = trigger.condition.attribute;
        area1 = trigger.condition.area;
        state1 = trigger.condition.argument[0];
        state2 = trigger.condition.argument[1];
      }
      setFormData({
        name: trigger.name,
        triggerType: triggerType,
        condition: condition,
        arg1: arg1,
        attr1: attr1,
        state1: state1,
        area1: area1,
        event1: event1,
        line1: line1,
        arg2: arg2,
        attr2: attr2,
        state2: state2,
        area2: area2,
        event2: event2,
        line2: line2,
      });
      if (arg1 && arg1 !== '') {
        arg1Changed(arg1);
      }
      if (arg2 && arg2 !== '') {
        arg2Changed(arg2);
      }
    }
  }, [trigger, initialData]);
  const [aiAttrState1, setAiAttrState1] = useState({
    attributes: [],
    states: [],
    lines: []
  });
  const [aiAttrState2, setAiAttrState2] = useState({
    attributes: [],
    states: [],
    lines: []
  });

  const arg1Changed = (value) => {
    if (initialData.ai && initialData.ai.classes) {
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
      setAiAttrState1({
        attributes: a,
        states: s,
        lines: l
      });
    }
  }
  const arg2Changed = (value) => {
    if (initialData.ai && initialData.ai.classes) {
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
      setAiAttrState2({
        attributes: a,
        states: s,
        lines: l
      });
    }
  }
  const generateTrigger = (values) => {
    let arg1 = undefined;
    let arg2 = undefined;
    let type = values.triggerType;
    let arg = undefined;
    let attribute = undefined;
    let state = undefined;
    let area = undefined;
    let line = undefined;

    if (values.triggerType === 'object') {
      type = values.condition;
    }
    if (values.condition === 'attrib_change') {
      arg = values.arg1;
      state = values.state1;
      area = values.area1;
      arg1 = values.attrFrom;
      arg2 = values.attrTo;
    } else if (values.condition === 'state_change') {
      arg = values.arg1;
      attribute = values.attr1;
      area = values.area1;
      arg1 = values.stateFrom;
      arg2 = values.stateTo;
    }

    if (values.condition !== 'attrib_change' && values.condition !== 'state_change') {
      arg1 = {
        area: values.area1 ? values.area1 : '',
        class: values.arg1 ? values.arg1 : '',
        attribute: values.attr1 ? values.attr1 : '',
        state: values.state1 ? values.state1 : ''
      };
      if (values.arg2Area) {
        arg1.area = values.arg2Area;
      }
      if (values.arg2Line) {

      }
    }

    if (values.condition === 'number') {
      arg2 = values.arg2Input;
    }
    if (values.condition === 'event') {
      arg2 = {
        area: values.area2 ? values.area2 : '',
        class: values.arg2 ? values.arg2 : '',
        attribute: values.attr2 ? values.attr2 : '',
        state: values.state2 ? values.state2 : ''
      };
    }

    if (values.triggerType === 'elapsed') {
      arg1 = {
        event_type: values.event1,
        argument1: arg1
      };
      if (values.condition === 'event') {
        arg2 = {
          event_type: values.event2,
          argument2: arg2
        };
      }
    }

    let t = {
      name: values.name,
      condition: {
        type: type
      },
      action: {}
    };

    if (arg) {
      t.condition['class'] = arg;
    }
    if (attribute) {
      t.condition['attribute'] = attribute;
    }
    if (state) {
      t.condition['state'] = state;
    }
    if (area) {
      t.condition['area'] = area;
    }
    t.condition['argument'] = [arg1];
    if (arg2) {
      t.condition['argument'].push(arg2);
    }
    return t;
  }
  const handleSubmit = (event, values) => {
    if (event) {
      let tr = generateTrigger(values);
      const cb = () => {
        setIsSaving(false);
      }
      const errcb = () => {
        setIsSaving(false);
      }
      setIsSaving(true);
      if (trigger) {
        tr = {
          _id: trigger._id,
          ...tr
        };
        updateTrigger(tr, cb, errcb);
      } else {
        addTrigger(tr, cb, errcb);
      }
    }
  }
  const onArg1Changed = (event, value) => {
    if (event && initialData.ai && initialData.ai.classes) {
      arg1Changed(value);
    }
  }
  const onArg2Changed = (event, value) => {
    if (event && initialData.ai && initialData.ai.classes) {
      arg2Changed(value);
    }
  }
  const onTriggerChange = (event, value) => {
    if (event) {
      setFormData(s => ({
        ...s,
        triggerType: value,
        condition: '',
        event1: '',
        event2: ''
      }));
    }
  }
  const onEvent1Changed = (event, value) => {
    if (event) {
      setFormData(s => ({ ...s, event1: value }));
    }
  }
  const onEvent2Changed = (event, value) => {
    if (event) {
      setFormData(s => ({ ...s, event2: value }));
    }
  }
  const onConditionChanged = (event, value) => {
    if (event) {
      setFormData(s => ({ ...s, condition: value }));
      if (value === 'number') {
        setFormData(s => ({ ...s, arg2: 0 }));
      } else {
        setFormData(s => ({ ...s, arg2: '' }));
      }
    }
  }
  return (
    <React.Fragment>
      {initialData.loading ? (
        <ModalBody>
          <Spinner />
          <div>Loading...</div>
        </ModalBody>
      ) : (
          <AvForm onValidSubmit={handleSubmit}>
            <ModalHeader>{trigger ? 'Edit' : 'Add'} alert</ModalHeader>
            <ModalBody className='p-l-30 p-r-30'>
              <Row>
                <Col md={12}>
                  <AvField
                    type='text'
                    name='name'
                    label='Name of alert'
                    value={formData.name}
                    required
                  />
                </Col>
              </Row>
              {/* Trigger */}
              {/* Trigger type & condition*/}
              <Row>
                <Col md={6}>
                  <AvField
                    type='select'
                    name='triggerType'
                    label='Trigger alert by : '
                    onChange={onTriggerChange}
                    value={formData.triggerType}
                  >
                    {initialData.triggerTypes && initialData.triggerTypes.map(item => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </AvField>
                </Col>
                <Col md={6}>
                  <AvField
                    type='select'
                    name='condition'
                    label='Trigger conditions'
                    onChange={onConditionChanged}
                    value={formData.condition}
                    required
                  >
                    <option value=''>None</option>
                    {(formData.triggerType === 'count') && (initialData.countTypes && initialData.countTypes.map(item => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    )))}
                    {(formData.triggerType === 'elapsed') && (initialData.elapsedTypes && initialData.elapsedTypes.map(item => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    )))}
                    {(formData.triggerType === 'object') && (initialData.objectTypes && initialData.objectTypes.map(item => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    )))}
                  </AvField>
                </Col>
              </Row>
              <Row>
                {/* Object */}
                <Col md={6}>
                  <div className='p-l-20 p-r-20'>
                    {/* event_type for the elapsed */}
                    {(formData.triggerType === 'elapsed') && (
                      <Row>
                        <Col md={12}>
                          <AvField
                            type='select'
                            name='event1'
                            label='Event for the object'
                            onChange={onEvent1Changed}
                            value={formData.event1}
                          >
                            {(initialData.eventTypes && initialData.eventTypes.map(item => (
                              <option key={item.value} value={item.value}>{item.label}</option>
                            )))}
                          </AvField>
                        </Col>
                      </Row>
                    )}
                    {/* Object name */}
                    <Row>
                      <Col md={12}>
                        <AvField
                          type='select'
                          name='arg1'
                          label='Object'
                          value={formData.arg1}
                          onChange={onArg1Changed}
                          required
                        >
                          <option value=''>None</option>
                          {initialData.ai && initialData.ai.classes && initialData.ai.classes.map(item => (
                            <option key={item.classId} value={item.label}>{item.className}</option>
                          ))}
                        </AvField>
                      </Col>
                    </Row>
                    {/* Attribute for object */}
                    {(formData.condition !== 'attrib_change') && (
                      <Row>
                        <Col md={3}>
                          <span>Attribute</span>
                        </Col>
                        <Col md={9}>
                          <AvField
                            type='select'
                            name='attr1'
                            value={formData.attr1}
                          >
                            {aiAttrState1 && aiAttrState1.attributes.map(item => (
                              <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                          </AvField>
                        </Col>
                      </Row>
                    )}
                    {/* State for object */}
                    {(formData.condition !== 'state_change') && (
                      <Row>
                        <Col md={3}>
                          <span>State</span>
                        </Col>
                        <Col md={9}>
                          <AvField
                            type='select'
                            name='state1'
                            value={formData.state1}
                          >
                            {aiAttrState1 && aiAttrState1.states.map(item => (
                              <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                          </AvField>
                        </Col>
                      </Row>
                    )}
                    {/* Area for object */}
                    {(formData.condition !== 'enter' && formData.condition !== 'leave') && (
                      <Row>
                        <Col md={3}>
                          <span>Area</span>
                        </Col>
                        <Col md={9}>
                          <AvField
                            type='select'
                            name='area1'
                            value={formData.area1}
                          >
                            {(initialData.zl && initialData.zl.map(item => (
                              <option key={item.value} value={item.value}>{item.label}</option>
                            )))}
                          </AvField>
                        </Col>
                      </Row>
                    )}
                    {/* Line for object */}
                    {(formData.event1 === 'cross' && formData.triggerType === 'elapsed') && (
                      <Row>
                        <Col md={3}>
                          <span>Line</span>
                        </Col>
                        <Col md={9}>
                          <AvField
                            type='select'
                            name='line1'
                            value={formData.line1}
                          >
                            {(aiAttrState1.lines && aiAttrState1.lines.map(item => (
                              <option key={item.value} value={item.value}>{item.label}</option>
                            )))}
                          </AvField>
                        </Col>
                      </Row>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  { // number input
                    (formData.condition === 'number' && (formData.triggerType === 'count' || formData.triggerType === 'elapsed')) && (
                      <AvField
                        type='number'
                        name='arg2Input'
                        value={formData.arg2}
                        validate={{
                          required: { value: true, errorMessage: 'Please input the proper value' },
                          min: { value: 0 },
                          max: { value: 86400 }
                        }}
                        required
                      ></AvField>
                    )
                  }
                  { // object for the event
                    (formData.condition === 'event' && (formData.triggerType === 'count' || formData.triggerType === 'elapsed') && (
                      <div className='p-l-20 p-r-20'>
                        {/* event_type for the elapsed */}
                        {(formData.triggerType === 'elapsed') && (
                          <Row>
                            <Col md={12}>
                              <AvField
                                type='select'
                                name='event2'
                                label='Event for the object'
                                onChange={onEvent2Changed}
                                value={formData.event2}
                              >
                                {(initialData.eventTypes && initialData.eventTypes.map(item => (
                                  <option key={item.value} value={item.value}>{item.label}</option>
                                )))}
                              </AvField>
                            </Col>
                          </Row>
                        )}
                        {/* Object name */}
                        <Row>
                          <Col md={12}>
                            <AvField
                              type='select'
                              name='arg2'
                              label='Object'
                              value={formData.arg2}
                              onChange={onArg2Changed}
                              required
                            >
                              <option value=''>None</option>
                              {initialData.ai && initialData.ai.classes && initialData.ai.classes.map(item => (
                                <option key={item.classId} value={item.label}>{item.className}</option>
                              ))}
                            </AvField>
                          </Col>
                        </Row>
                        {/* Attribute for object */}
                        {(formData.condition !== 'attrib_change') && (
                          <Row>
                            <Col md={3}>
                              <span>Attribute</span>
                            </Col>
                            <Col md={9}>
                              <AvField
                                type='select'
                                name='attr2'
                                value={formData.attr2}
                              >
                                {aiAttrState2 && aiAttrState2.attributes.map(item => (
                                  <option key={item.value} value={item.value}>{item.label}</option>
                                ))}
                              </AvField>
                            </Col>
                          </Row>
                        )}
                        {/* State for object */}
                        {(formData.condition !== 'state_change') && (
                          <Row>
                            <Col md={3}>
                              <span>State</span>
                            </Col>
                            <Col md={9}>
                              <AvField
                                type='select'
                                name='state2'
                                value={formData.state2}
                              >
                                {aiAttrState2 && aiAttrState2.states.map(item => (
                                  <option key={item.value} value={item.value}>{item.label}</option>
                                ))}
                              </AvField>
                            </Col>
                          </Row>
                        )}
                        {/* Area for object */}
                        {(formData.condition !== 'enter' && formData.condition !== 'leave') && (
                          <Row>
                            <Col md={3}>
                              <span>Area</span>
                            </Col>
                            <Col md={9}>
                              <AvField
                                type='select'
                                name='area2'
                                value={formData.area2}
                              >
                                {(initialData.zl && initialData.zl.map(item => (
                                  <option key={item.value} value={item.value}>{item.label}</option>
                                )))}
                              </AvField>
                            </Col>
                          </Row>
                        )}
                        {/* Line for object */}
                        {(formData.event2 === 'cross' && formData.triggerType === 'elapsed') && (
                          <Row>
                            <Col md={3}>
                              <span>Line</span>
                            </Col>
                            <Col md={9}>
                              <AvField
                                type='select'
                                name='line2'
                                value={formData.line2}
                              >
                                {(aiAttrState2.lines && aiAttrState2.lines.map(item => (
                                  <option key={item.value} value={item.value}>{item.label}</option>
                                )))}
                              </AvField>
                            </Col>
                          </Row>
                        )}
                      </div>
                    ))
                  }
                  { // areas for the object condition
                    (formData.triggerType === 'object' && (formData.condition === 'enter' || formData.condition === 'leave') && (
                      <AvField
                        type='select'
                        name='arg2Area'
                        value={formData.arg2}
                      >
                        {initialData.zl && initialData.zl.map(item => (
                          <option key={item.value} value={item.value}>{item.label}</option>
                        ))}
                      </AvField>
                    ))
                  }
                  { // lines for the object condition
                    (formData.triggerType === 'object' && formData.condition === 'cross' && (
                      <AvField
                        type='select'
                        name='arg2Line'
                        value={formData.arg2}
                      >
                        {aiAttrState1.lines && aiAttrState1.lines.map(item => (
                          <option key={item.value} value={item.value}>{item.label}</option>
                        ))}
                      </AvField>
                    ))
                  }
                  { // attribute for the object condition
                    (formData.triggerType === 'object' && formData.condition === 'attrib_change' && (
                      <React.Fragment>
                        <AvField
                          type='select'
                          name='attrFrom'
                          label='Attribute from'
                          value={formData.attr1}
                        >
                          {aiAttrState1.attributes && aiAttrState1.attributes.map(item => (
                            <option key={item.value} value={item.value}>{item.label}</option>
                          ))}
                        </AvField>
                        <AvField
                          type='select'
                          name='attrTo'
                          label='Attribute to'
                          value={formData.attr2}
                        >
                          {aiAttrState1.attributes && aiAttrState1.attributes.map(item => (
                            <option key={item.value} value={item.value}>{item.label}</option>
                          ))}
                        </AvField>
                      </React.Fragment>
                    ))
                  }
                  { // states for the object condition
                    (formData.triggerType === 'object' && formData.condition === 'state_change' && (
                      <React.Fragment>
                        <AvField
                          type='select'
                          name='stateFrom'
                          label='State from'
                          value={formData.state1}
                        >
                          {aiAttrState1.states && aiAttrState1.states.map(item => (
                            <option key={item.value} value={item.value}>{item.label}</option>
                          ))}
                        </AvField>
                        <AvField
                          type='select'
                          name='stateTo'
                          label='State to'
                          value={formData.state2}
                        >
                          {aiAttrState1.states && aiAttrState1.states.map(item => (
                            <option key={item.value} value={item.value}>{item.label}</option>
                          ))}
                        </AvField>
                      </React.Fragment>
                    ))
                  }
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter style={{ backgroundColor: '#e5e5e5' }}>
              {(isSaving) ? (
                <Spinner />
              ) : (
                  <React.Fragment>
                    <Button type='submit' className='green-button'>{trigger ? 'Update ' : 'Save '}alert</Button>
                    <Button type='button' className='green-button' onClick={dismiss}>Cancel</Button>
                  </React.Fragment>
                )}
            </ModalFooter>
          </AvForm>
        )}
    </React.Fragment>
  )
};

export default TriggerModal;