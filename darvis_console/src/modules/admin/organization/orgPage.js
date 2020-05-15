import React from 'react';
import { Button, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ConfirmationContext from '../../../shared/modules/confirmationModal/context';

const OrgPage = ({ orgs, editAction, deleteOrg }) => {
  if (orgs && orgs.length) {
    return (
      <Table borderless responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Site</th>
            <th>License Name</th>
            <th>Valid Till</th>
          </tr>
        </thead>
        <tbody>
          {orgs.map((org, i) => (
            <tr key={org._id}>
              <th scope="row">{i + 1}</th>
              <td>{org.name}</td>
              <td>
                <a href={org.site} rel="noopener noreferrer" target="_blank">
                  {org.site}
                </a>
              </td>
              <td>{org.license.name}</td>
              <td>{org.license && org.license.expiry && new Date(org.license.expiry).toDateString()}</td>
              <td>
                <Button size="sm" onClick={() => editAction(org)}>
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
                          item: org.name,
                          callback: () => {
                            setLoader(true);
                            deleteOrg(org._id, () => resetConfirmationModal(), () => setLoader(false));
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

  return <div>No Organization found</div>;
};

export default OrgPage;
