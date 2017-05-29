import React, {Component} from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {actions, selectors} from "../../redux/modules/collections";
import {FrownSplash, LoadingSplash} from "../shared/Splash";
import CollectionInfo from "./CollectionInfo";

class CollectionContainer extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        fetchItem: PropTypes.func.isRequired,
        getWIP: PropTypes.func.isRequired,
        collection: PropTypes.object,
    };

    static defaultProps = {
        collection: null
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
        const {getWIP, collection} = this.props,
            wip = getWIP('fetchItem');

        if (!!collection) {
            return <CollectionInfo {...this.props}/>;
        } else {
            return wip ?
                <LoadingSplash text="Loading collection details" subtext="Hold on tight..."/> :
                <FrownSplash text="Couldn't find collection"
                             subtext={<span>Try the <Link to="/collections">collections list</Link>...</span>}/>;
        }
    }
}

const mapState = (state, props) => ({
    collection: selectors.getCollectionById(state.collections)(parseInt(props.match.params.id, 10)),
    getWIP: selectors.getWIP(state.collections),
    getError: selectors.getError(state.collections),
});

function mapDispatch(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapState, mapDispatch)(CollectionContainer);
