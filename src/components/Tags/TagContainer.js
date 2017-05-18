import React, {Component} from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Divider, Grid} from "semantic-ui-react";
import {actions, selectors} from "../../redux/modules/tags";
import {FrownSplash, LoadingSplash} from "./shared/Splash";
import TagInfoForm from "./TagInfoForm";
import TagI18nForm from "./TagI18nForm";
import TagChildren from "./TagChildren";

class TagContainer extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        fetchItem: PropTypes.func.isRequired,
        fetchAll: PropTypes.func.isRequired,
        getWIP: PropTypes.func.isRequired,
        tag: PropTypes.object,
    };

    static defaultProps = {
        tag: null
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
        const {getWIP, tag} = this.props,
            wip = getWIP('fetchItem');

        if (!!tag) {
            return <Grid container>
                <Grid.Row columns={2}>
                    <Grid.Column width={8}>
                        <TagInfoForm {...this.props}/>
                        <Divider horizontal hidden/>
                        <TagI18nForm {...this.props}/>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <TagChildren {...this.props}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>;
        } else {
            return <Grid container>
                <Grid.Row>
                    <Grid.Column>
                        {
                            wip ?
                                <LoadingSplash text="Loading tag details" subtext="Hold on tight..."/> :
                                <FrownSplash text="Couldn't find tag"
                                             subtext={<span>Try the <Link to="/tags">tags hierarchy</Link>...</span>}/>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        }
    }
}

const mapState = (state, props) => ({
    tag: selectors.getTagById(state.tags)(parseInt(props.match.params.id, 10)),
    getTagById: selectors.getTagById(state.tags),
    hierarchy: selectors.getHierarchy(state.tags),
    getWIP: selectors.getWIP(state.tags),
    getError: selectors.getError(state.tags),
});

function mapDispatch(dispatch) {
    return bindActionCreators(actions, dispatch);
}

export default connect(mapState, mapDispatch)(TagContainer);
