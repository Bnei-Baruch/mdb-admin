import React, {Component} from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {actions, selectors} from "../../redux/modules/files";
import {FrownSplash, LoadingSplash} from "../shared/Splash";
import FileInfo from "./FileInfo";

class FileContainer extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        fetchItem: PropTypes.func.isRequired,
        getWIP: PropTypes.func.isRequired,
        file: PropTypes.object,
    };

    static defaultProps = {
        file: null
    };

    componentDidMount() {
        const id = this.props.match.params.id;
        this.askForData(id);
    }

    componentWillReceiveProps(nextProps) {
        const id = this.props.match.params.id,
            nId = nextProps.match.params.id;
        if (id !== nId) {
            this.askForData(nId);
        }
    }

    askForData(id) {
        this.props.fetchItem(id);
    }

    render() {
        const {getWIP, file} = this.props,
            wip = getWIP('fetchItem');

        if (!!file) {
            return <FileInfo {...this.props}/>;
        } else {
            return wip ?
                <LoadingSplash text="Loading file details" subtext="Hold on tight..."/> :
                <FrownSplash text="Couldn't find file"
                             subtext={<span>Try the <Link to="/files">files list</Link>...</span>}/>;
        }
    }
}

const mapState = (state, props) => ({
    file: selectors.getFileById(state.files)(parseInt(props.match.params.id, 10)),
    getWIP: selectors.getWIP(state.files),
    getError: selectors.getError(state.files),
});

function mapDispatch(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapState, mapDispatch)(FileContainer);
