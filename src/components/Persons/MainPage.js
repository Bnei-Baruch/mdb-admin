import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Icon, Label, Menu, Modal } from 'semantic-ui-react';

import { EMPTY_ARRAY } from '../../helpers/consts';
import { formatError } from '../../helpers/utils';
import * as shapes from '../shapes';
import Pagination from '../shared/Pagination';
import ResultsPageHeader from '../shared/ResultsPageHeader';
import CreatePersonForm from '../shared/Forms/Persons/CreatePersonForm';
import PersonsList from './List';

class PersonsMainPage extends Component {

  static propTypes = {
    pageNo: PropTypes.number,
    total: PropTypes.number,
    items: PropTypes.arrayOf(shapes.Person),
    wip: PropTypes.bool,
    err: shapes.Error,
    create: PropTypes.func.isRequired,
    wipOfCreate: PropTypes.bool,
    errOfCreate: shapes.Error,
    onPageChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: EMPTY_ARRAY,
    pageNo: 1,
    total: 0,
    wip: false,
    err: null,
    wipOfCreate: false,
    errOfCreate: null
  };

  state = {
    newPerson: false,
  };

  componentWillReceiveProps(nextProps) {
    const { wipOfCreate } = this.props;
    const nWip            = nextProps.wipOfCreate;
    const nErr            = nextProps.errOfCreate;
    if (wipOfCreate && !nWip && !nErr) {
      this.toggleNewPerson();
    }
  }

  toggleNewPerson = () =>
    this.setState({ newPerson: !this.state.newPerson });

  render() {
    const { newPerson } = this.state;

    const
      {
        pageNo,
        total,
        items,
        wip,
        wipOfCreate,
        err,
        errOfCreate,
        onPageChange,
        create,
        currentLanguage
      } = this.props;

    return (
      <div>
        <Menu borderless size="large">
          <Menu.Item header>
            <Header content="Persons" size="medium" color="blue" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item onClick={this.toggleNewPerson}>
              <Icon name="plus" />
              New Person
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <Grid>
          <Grid.Row>
            <Grid.Column>
              <div style={{ textAlign: 'right' }}>
                {
                  wip ?
                    <Label
                      color="yellow"
                      icon={{ name: 'spinner', loading: true }}
                      content="Loading"
                    /> :
                    null
                }
                {
                  err ?
                    <Header
                      inverted
                      content={formatError(err)}
                      color="red"
                      icon="warning sign"
                      floated="left"
                    /> :
                    null
                }
                <ResultsPageHeader pageNo={pageNo} total={total} />
                &nbsp;&nbsp;
                <Pagination pageNo={pageNo} total={total} onChange={onPageChange} />
              </div>
              <PersonsList items={items} currentLanguage={currentLanguage} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Modal
          closeIcon
          size="small"
          open={newPerson}
          onClose={this.toggleNewPerson}
        >
          <Modal.Header>Create New Person</Modal.Header>
          <Modal.Content>
            <CreatePersonForm wip={wipOfCreate} err={errOfCreate} create={create} />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default PersonsMainPage;
