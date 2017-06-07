import React, {Component} from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Divider, Grid} from "semantic-ui-react";
import {actions, selectors} from "../../redux/modules/sources";
import {FrownSplash, LoadingSplash} from "../shared/Splash";
import SourceInfoForm from "./SourceInfoForm";
import SourceI18nForm from "./SourceI18nForm";
import SourceChildren from "./SourceChildren";

class SourceContainer extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        fetchItem: PropTypes.func.isRequired,
        fetchAll: PropTypes.func.isRequired,
        getWIP: PropTypes.func.isRequired,
        source: PropTypes.object,
    };

    static defaultProps = {
        source: null
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

        // TODO: Maybe we can skip this call if we know for sure that our children are already in the store
        this.props.fetchAll();
    }

    render() {
        const {getWIP, source} = this.props,
            wip = getWIP('fetchItem');

        if (!!source) {
            return <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column width={8}>
                        <SourceInfoForm {...this.props}/>
                        <Divider horizontal hidden/>
                        <SourceI18nForm {...this.props}/>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <SourceChildren {...this.props}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>;
        } else {
            return  wip ?
                <LoadingSplash text="Loading source details" subtext="Hold on tight..."/> :
                <FrownSplash text="Couldn't find source"
                             subtext={<span>Try the <Link to="/sources">sources hierarchy</Link>...</span>}/>;
        }
    }
}

const mapState = (state, props) => ({
    source: selectors.getSourceById(state.sources)(parseInt(props.match.params.id, 10)),
    getSourceById: selectors.getSourceById(state.sources),
    hierarchy: selectors.getHierarchy(state.sources),
    getWIP: selectors.getWIP(state.sources),
    getError: selectors.getError(state.sources),
});

function mapDispatch(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapState, mapDispatch)(SourceContainer);
