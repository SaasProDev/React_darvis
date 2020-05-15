import React, { useState } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Row, Col, Button } from 'reactstrap';
import { checkLicense } from '../../shared/services/license';
import { getOrganizationByLi } from '../../shared/services/organization';
import { registerPrem, addKPIs as addKPIsService } from '../../shared/services/sites';
import { LOGGED_IN_HOME } from '../../config';

const ConfigContainer = ({ history }) => {
  const [state, setState] = useState({
    isError: false,
    step: 0,
    license: undefined,
    organization: undefined,
    user: undefined,
    site: undefined,
    invalidPassword: false,
  })

  const handleSubmit = async (event, values) => {
    try {
      if (event) {
        if (state.step === 0) {
          // check license
          const l = await checkLicense(values);
          if (!l || l === 'Invalid license') {
            setState(s => ({ ...s, isError: true }));
          } else {
            const org = await getOrganizationByLi(l._id);
            if (!org || org === 'Invalid license') {
              setState(s => ({ ...s, isError: true }));
            } else {
              setState(s => ({ ...s, license: l, organization: org, step: 1 }));
            }
          }
        } else if (state.step === 1) {
          // user password
          if (values.password !== values.confirm) {
            setState(s => ({ ...s, invalidPassword: true }));
          } else {
            const user = {
              email: values.email,
              password: values.password
            }
            setState(s => ({ ...s, user: user, step: 2 }));
          }
        } else if (state.step === 2) {
          // set user and site to the site
          let prem = {
            name: values.site,
            email: state.user.email,
            password: state.user.password,
            org: state.organization._id,
          }
          prem = await registerPrem(prem);
          setState(s => ({ ...s, site: values.site, step: 3 }));
          localStorage.setItem('user', JSON.stringify(prem.user));
          localStorage.setItem('token', prem.user.token);
          localStorage.setItem('selectedSite', JSON.stringify(prem.site));

          const ai = prem.site.ai;

          let kpis = [];
          ai.classes.map((item) => (
            kpis.push({
              name: 'Number of ' + item.className,
              type: 'count',
              interval: 1,
              object: item.className,
              where: 'all'
            })
          ));

          await addKPIsService(prem.site._id, kpis);

          // create default one kpi

        } else if (state.step === 3) {
          history.push(LOGGED_IN_HOME);
        }
      }
    } catch (e) {

    }
  }

  return (
    <div className='config-body'>
      <div className="container">
        <div className="login-wrap d-flex justify-content-center flex-wrap">
          <div>
            <img src='/images/logo-full.png' className='m-t-200' style={{ height: '150px' }} alt='placeholder' />
            <AvForm className='m-l-20 m-t-50' onValidSubmit={handleSubmit}>
              {/* License validate */}
              {(state.step === 0) && (
                <React.Fragment>
                  <Row>
                    <Col md={{ size: 11, offset: 1 }}>
                      <div className='center-item'>
                        <h5>Please enter a valid license key to continue</h5>
                      </div>
                    </Col>
                  </Row>
                  <Row className='m-t-20'>
                    <Col md={5}>
                      <h4 style={{ textAlign: 'right' }} className='m-t-3'>License key : </h4>
                    </Col>
                    <Col md={7}>
                      <AvField
                        type='text'
                        name='license'
                        validate={{
                          required: { value: true, errorMessage: 'Please enter a valid key' },
                          minLength: { value: 7, errorMessage: 'Key must be 7 characters' },
                          maxLength: { value: 7, errorMessage: 'Key must be 7 characters' }
                        }}
                      />
                    </Col>
                  </Row>
                </React.Fragment>
              )}
              {(state.step === 0 && state.isError) && (
                <Row>
                  <Col md={{ size: 5, offset: 5 }}>
                    <h6 style={{ color: '#f00' }}>Invalid license</h6>
                  </Col>
                </Row>
              )}
              {/* user email and password (owner) */}
              {(state.step === 1) && (
                <React.Fragment>
                  <Row>
                    <Col md={12}>
                      <div className='center-item'>
                        <h5>Please enter account information for a site administrator</h5>
                      </div>
                    </Col>
                  </Row>
                  <Row className='m-t-20'>
                    <Col md={4}>
                      <h4 style={{ textAlign: 'right' }} className='m-t-3'>Email : </h4>
                    </Col>
                    <Col md={{size: 7}}>
                      <AvField type='email' name='email' required />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <h4 style={{ textAlign: 'right' }} className='m-t-3'>Password : </h4>
                    </Col>
                    <Col md={7}>
                      <AvField
                        type='password'
                        name='password'
                        onChange={() => { setState(s => ({ ...s, invalidPassword: false })) }}
                        required />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <h4 style={{ textAlign: 'right' }} className='m-t-3'>Confirm : </h4>
                    </Col>
                    <Col md={7}>
                      <AvField
                        type='password'
                        name='confirm'
                        onChange={() => { setState(s => ({ ...s, invalidPassword: false })) }}
                        required />
                    </Col>
                  </Row>
                </React.Fragment>
              )}
              {(state.step === 1 && state.invalidPassword) && (
                <Row>
                  <Col md={{ size: 5, offset: 5 }}>
                    <h6 style={{ color: '#f00' }}>Passwords do not match</h6>
                  </Col>
                </Row>
              )}
              {/* site name */}
              {(state.step === 2) && (
                <Row>
                  <Col md={5}>
                    <h4 style={{ textAlign: 'right' }} className='m-t-3'>Site name : </h4>
                  </Col>
                  <Col md={7}>
                    <AvField
                      type='text'
                      name='site'
                      validate={{
                        required: { value: true, errorMessage: 'Please enter a valid name' },
                        minLength: { value: 3, errorMessage: 'Your name must be between 3 and 50 characters' },
                        maxLength: { value: 50, errorMessage: 'Your name must be between 3 and 50 characters' }
                      }}
                    />
                  </Col>
                </Row>
              )}
              {/* Welcome */}
              {(state.step === 3) && (
                <Row>
                  <Col md={12}>
                    <div className='center-item'>
                      <h4>
                        Welcome, you are now administrator of {state.site}
                      </h4>
                    </div>
                  </Col>
                </Row>
              )}
              <Row className='m-t-10'>
                <Col md={{ size: 4, offset: 5 }}>
                  <Button type='submit' className='green-button w-full' size='lg'>Next</Button>
                </Col>
              </Row>
            </AvForm>
          </div>

        </div>
      </div>
    </div>
  )
};

export default ConfigContainer;