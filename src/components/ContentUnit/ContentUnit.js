import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentUnitInfo from './ContentUnitInfo/ContentUnitInfo';
import apiClient from '../../helpers/apiClient';

class ContentUnit extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    render() {
        return (
            <ContentUnitInfo id={this.props.match.params.id} />
        );
    }
}

ContentUnit.Info = ContentUnitInfo;

export default ContentUnit;
