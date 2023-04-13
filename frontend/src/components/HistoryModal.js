import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

export default class HistoryModal extends Component {
  render() {
    const { toggle, itemChanges } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Change History</ModalHeader>
        <ModalBody>
          <ListGroup>
            {itemChanges.map((change, index) => (
              <ListGroupItem key={index}>
                {change.timestamp}: {change.action}
              </ListGroupItem>
            ))}
          </ListGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}