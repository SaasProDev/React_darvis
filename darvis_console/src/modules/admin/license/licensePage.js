import React from 'react';
import { Table, Badge, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ConfirmationContext from '../../../shared/modules/confirmationModal/context';

const LicensePage = ({ licenses, editAction, deleteLicense }) => {
  if (licenses && licenses.length) {
    return (
      <Table borderless responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Allowed Users</th>
            <th>Is Active</th>
            <th>Created</th>
            <th>Expiry</th>
          </tr>
        </thead>
        <tbody>
          {licenses.map((license, i) => (
            <tr key={license._id}>
              <th scope="row">{i + 1}</th>
              <td>{license.name}</td>
              <td align="center">{license.allowedUsers}</td>
              <td>{license.isActive ? <Badge color="primary">Yes</Badge> : <Badge color="danger">No</Badge>}</td>
              <td>{license.created && new Date(license.created).toDateString()}</td>
              <td>{license.expiry && new Date(license.expiry).toDateString()}</td>
              <td>
                <Button size="sm" onClick={() => editAction(license)}>
                  <FontAwesomeIcon icon="edit" />
                </Button>{' '}
                <ConfirmationContext.Consumer>
                  {({ setConfirmationModal, resetConfirmationModal, setLoader }) => (
                    <Button
                      size="sm"
                      onClick={() =>
                        setConfirmationModal(s => ({
                          ...s,
                          visible: true,
                          item: license.name,
                          callback: () => {
                            setLoader(true);
                            deleteLicense(license._id, () => resetConfirmationModal(), () => setLoader(false));
                          },
                        }))
                      }
                      color="danger"
                    >
                      <FontAwesomeIcon icon="trash" />
                    </Button>
                  )}
                </ConfirmationContext.Consumer>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  return <div>No license found</div>;
};

export default LicensePage;
