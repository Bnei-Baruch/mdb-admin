import React, {Component} from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {actions, selectors} from "../../redux/modules/content_units";
import {FrownSplash, LoadingSplash} from "../shared/Splash";
import ContentUnitInfo from "./ContentUnitInfo";

class ContentUnitContainer extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        fetchItem: PropTypes.func.isRequired,
        getWIP: PropTypes.func.isRequired,
        unit: PropTypes.object,
        fetchFiles: PropTypes.func.isRequired
    };

    static defaultProps = {
        unit: null
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
        this.props.fetchFiles(id);
    }

    render() {
        const {getWIP, unit} = this.props,
            wip = getWIP('fetchItem');

        if (!!unit) {
            return <ContentUnitInfo {...this.props}/>;
        } else {
            return wip ?
                <LoadingSplash text="Loading content unit details" subtext="Hold on tight..."/> :
                <FrownSplash text="Couldn't find content unit"
                             subtext={<span>Try the <Link to="/content_units">content units list</Link>...</span>}/>;
        }
    }
}

const mapState = (state, props) => ({
    unit: selectors.getContentUnitById(state.content_units)(parseInt(props.match.params.id, 10)),
    getWIP: selectors.getWIP(state.content_units),
    getError: selectors.getError(state.content_units),
});

function mapDispatch(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapState, mapDispatch)(ContentUnitContainer);
