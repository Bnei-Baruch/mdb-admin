import React from 'react';
import PropTypes from 'prop-types';
import chunk from "lodash/chunk";
import { Form, Segment } from 'semantic-ui-react';
import { filterConfigShape } from '../shapes';

const Filters = (props) => {
    const { filters, namespace } = props
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
                                        <filter.Component  
                                            namespace={namespace} 
                                            name={filter.name}
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
    filters: PropTypes.arrayOf(filterConfigShape)
};

export default Filters;