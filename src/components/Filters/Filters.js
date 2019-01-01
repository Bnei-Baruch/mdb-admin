import React from 'react';
import PropTypes from 'prop-types';
import chunk from 'lodash/chunk';
import { Form, Segment } from 'semantic-ui-react';

import { EMPTY_ARRAY } from '../../helpers/consts';
import { filterConfigShape } from '../shapes';

const Filters = (props) => {
  const { filters, onFilterApplication, onFilterCancel } = props;

  const filterChunks = chunk(filters, 4);
  return (
    <Segment color="blue">
      <Form>
        {
          filterChunks.map((group, idx) => (
            <Form.Group key={idx}>
              {
                group.map((filter, idx2) => (
                  <Form.Field key={idx2} width={4}>
                    <label>{filter.label}:</label>
                    <filter.component
                      name={filter.name}
                      onApply={onFilterApplication}
                      onCancel={onFilterCancel}
                      {...filter.props}
                    />
                  </Form.Field>
                ))
              }
            </Form.Group>
          ))
        }
      </Form>
    </Segment>
  );
};

Filters.propTypes = {
  namespace: PropTypes.string.isRequired,
  filters: PropTypes.arrayOf(filterConfigShape),
  onFilterApplication: PropTypes.func.isRequired,
  onFilterCancel: PropTypes.func.isRequired
};

Filters.defaultProps = {
  filters: EMPTY_ARRAY,
};

export default Filters;
