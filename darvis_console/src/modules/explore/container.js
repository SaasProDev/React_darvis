import React from 'react';
import { Row, Col } from 'reactstrap';

import DashboardTemplate from '../../shared/templates/dashboardTemplate';
import Card from '../../shared/molecules/card';
import GreyCard from '../../shared/molecules/greyCard';

const CameraSetup = () => {
  return (
    <DashboardTemplate>
      <Row>
        <Col md="9">
          <Row>
            <Col>
              <Card>
                Berlin Fairground
                <img className="img-fluid" src="/images/berlin_map_ground.png" alt="fairground-map" />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col md="3">
          <GreyCard online>
            {{
              header: (
                <React.Fragment>
                  <span>Site:</span> Messe-Berlin
                </React.Fragment>
              ),
              thead: (
                <tr>
                  <th />
                  <th>Status</th>
                  <th>Uptime</th>
                </tr>
              ),
              tbody: (
                <React.Fragment>
                  <tr>
                    <td className="grey-card__cell--1">AI</td>
                    <td className="color--green">OK</td>
                    <td>88%</td>
                  </tr>
                  <tr>
                    <td className="grey-card__cell--1">DE</td>
                    <td className="color--green">OK</td>
                    <td>98%</td>
                  </tr>
                  <tr>
                    <td className="grey-card__cell--1">Cams</td>
                    <td className="color--green">58</td>
                    <td>65%</td>
                  </tr>
                  <tr>
                    <td className="grey-card__cell--1">License</td>
                    <td className="color--green">valid</td>
                    <td />
                  </tr>
                </React.Fragment>
              ),
            }}
          </GreyCard>
        </Col>
      </Row>
    </DashboardTemplate>
  );
};

export default CameraSetup;
