import React from 'react';
import { Row, Col } from 'reactstrap';

import styles from './styles.module.scss';
import HrDivider from '../../../../shared/atoms/hrDivider';
import UserField from './userField';

const UserTable = ({ users, editUser, deleteUser, addSite, editSite, deleteSite }) => {
  return (
    <div>
      <Row className={`${styles.bold} p-l-20 p-r-20`}>
        <Col sm={1}>#</Col>
        <Col sm={2} >Name</Col>
        <Col sm={3}>Email</Col>
        <Col sm={2}>Organization</Col>
        <Col sm={2}>Role</Col>
        <Col sm={1}>#</Col>
      </Row>
      {users && users.length ? (
        <React.Fragment>
          {users.map((user, i) => (
            <UserField
              user={user}
              key={user._id}
              index={i + 1}
              editUser={editUser}
              deleteUser={deleteUser}
              addSite={addSite}
              editSite={editSite}
              deleteSite={deleteSite}
            />
          ))}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Row>
            <Col sm={12}>
              <HrDivider bold={false} color="#72a7e0" />
            </Col>
          </Row>
          <div>No User Found</div>
        </React.Fragment>
      )}
    </div>
  );
};

UserTable.defaultProps = {
  editUser: () => {},
  deleteUser: () => {},
  addSite: () => {},
  editSite: () => {},
  deleteSite: () => {},
};

export default UserTable;
