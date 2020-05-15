import React from 'react';

import {
  Alert,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { AuthContextConsumer } from '../../../modules/auth/authContext';

import './styles.scss';
import { isAdmin, isOwner, isGod, isViewer, isManager, isEditor } from '../../services/role';
import SitesContext from '../../modules/sitesContext/context';

const Navigation = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  const [dropdownState, setDropdownState] = React.useState(false);

  let user = localStorage.getItem('user') || {};
  if (user) {
    user = JSON.parse(user);
  }

  function renderMainNav(selectedSite) {
    return (
      <Nav className="mr-auto" navbar>
        {(isOwner() || isManager()) && selectedSite && (
          <NavItem className="dar-navbar__item">
            <NavLink to="/console/site" activeClassName="link-active">
              Site
            </NavLink>
          </NavItem>
        )}
        {(isOwner() || isManager()) && (
          <NavItem className="dar-navbar__item">
            <NavLink to="/console/cameras" activeClassName="link-active">
              Cameras
            </NavLink>
          </NavItem>
        )}
        {(isOwner() || isManager() || isEditor()) && (
          <NavItem className="dar-navbar__item">
            <NavLink to="/console/analytics" activeClassName="link-active">
              Analytics
            </NavLink>
          </NavItem>
        )}
        {/*(isOwner() || isViewer() || isManager() || isEditor()) && (
          <NavItem className="dar-navbar__item">
            <NavLink to="/console/explore" activeClassName="link-active">
              Explore
            </NavLink>
          </NavItem>
        )*/}
        {(isOwner() || isManager()) && (
          <NavItem className="dar-navbar__item">
            <NavLink to="/console/users" activeClassName="link-active">
              Users
          </NavLink>
          </NavItem>
        )}
        {(isGod() || isAdmin()) && (
          <NavItem className="dar-navbar__item">
            <NavLink to="/console/admin/users" activeClassName="link-active">
              Admin
            </NavLink>
          </NavItem>
        )}
      </Nav>
    );
  }

  function renderEmptyNav() {
    if (isOwner()) {
      return (
        <Nav className="mr-auto" navbar>
          <Alert color="info" style={{ marginBottom: '0', padding: '0.45rem 1.25rem 0.3rem' }}>
            Select a site to move ahead
          </Alert>
        </Nav>
      );
    }

    return null;
  }

  return (
    <div className="dar-navbar">
      <Navbar className="container" color="faded" expand="md">
        <NavbarBrand href="/" className="mr-auto">
          <img className="dar-navbar__logo" src="/images/logo-full.png" alt="Darvis" />
        </NavbarBrand>
        <NavbarToggler onClick={() => setCollapsed(!collapsed)} />
        <Collapse isOpen={collapsed} navbar>
          <SitesContext.Consumer>
            {props => {
              const { selectedSite } = props;
              return <React.Fragment>{selectedSite ? renderMainNav(selectedSite) : renderEmptyNav()}</React.Fragment>;
            }}
          </SitesContext.Consumer>
          <Dropdown isOpen={dropdownState} toggle={() => setDropdownState(!dropdownState)}>
            <DropdownToggle tag="span" className="nav-link" caret>
              <img className="darvis-navbar-profile" src="/images/profile.png" alt="" />
              <span>
                &nbsp;&nbsp;
                {user.email}
                &nbsp;
              </span>
            </DropdownToggle>
            <AuthContextConsumer>
              {({ logout }) => (
                <DropdownMenu>
                  <DropdownItem tag="a" href="#" active>
                    Profile
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      logout();
                    }}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              )}
            </AuthContextConsumer>
          </Dropdown>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Navigation;
