import React from 'react';
import PropTypes from 'prop-types';
import { Statistic, Grid, Icon, Loader } from 'semantic-ui-react';

function SearchHeader(props) {
    const {
        searching,
        total,
    } = props;

    return (
        <Grid divided reversed="computer">
            <Grid.Row columns="16">
                <Grid.Column width={1} textAlign="left">
                    { searching
                        ? <Loader inline active />
                        : <Icon name={total === 0 ? 'frown' : 'checkmark'} color={total === 0 ? 'red' : 'green'} size="big" />
                    }
                </Grid.Column>
                <Grid.Column width={3} textAlign="right">
                    <Statistic
                        horizontal
                        label={searching ? 'Searching...' : 'Results'}
                        value={searching ? '' : total}
                        size="tiny"
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

SearchHeader.propTypes = {
    searching: PropTypes.bool,
    total: PropTypes.number
};

SearchHeader.defaultProps = {
    searching: false,
    total: 0
};

export default SearchHeader;
