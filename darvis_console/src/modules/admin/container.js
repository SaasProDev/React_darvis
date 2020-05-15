import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Col, Nav, NavItem, NavLink, Row } from 'reactstrap';

import DashboardTemplate from '../../shared/templates/dashboardTemplate';
import Users from './users/container';
import Orgs from './organization/container';
import License from './license/container';

const AdminContainer = ({ match }) => {
  const { params } = match;

  function renderPage() {
    switch (params.type) {
      case 'users':
        return <Users />;
      case 'organizations':
        return <Orgs />;
      case 'licenses':
        return <License />;
      default:
        return null;
    }
  }

  return (
    <DashboardTemplate>
      <Row>
        <Col>
          <div>
            <Nav pills>
              <NavItem>
                <NavLink tag={Link} to="/console/admin/users" active={params.type === 'users'}>
                  Users
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/console/admin/organizations" active={params.type === 'organizations'}>
                  Organizations
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/console/admin/licenses" active={params.type === 'licenses'}>
                  Licenses
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </Col>
      </Row>
      <br />
      {renderPage()}
    </DashboardTemplate>
  );
};

export default withRouter(AdminContainer);
