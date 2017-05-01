import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FileInfo from './FileInfo/FileInfo';

class File extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
    };

    render() {
        return (
            <FileInfo id={this.props.match.params.id} />
        );
    }
}

File.Info = FileInfo;

export default File;
