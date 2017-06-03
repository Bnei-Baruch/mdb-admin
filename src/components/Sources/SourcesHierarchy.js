import React, {Component} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {Grid, Header, Icon, Label, List, Menu, Modal, Segment} from "semantic-ui-react";
import NewSourceForm from "./NewSourceForm";
import {FrownSplash, LoadingSplash} from "../shared/Splash";
import {extractI18n} from "../../helpers/utils";

class SourcesHierarchy extends Component {

    static propTypes = {
        getSourceById: PropTypes.func.isRequired,
        getWIP: PropTypes.func.isRequired,
        getError: PropTypes.func.isRequired,
        hierarchy: PropTypes.object,
    };

    static defaultProps = {
        hierarchy: {
            roots: [],
            childMap: new Map()
        }
    };

    constructor(props) {
        super(props);

        const roots = props.hierarchy.roots;
        this.state = {
            modalOpen: false,
            shownRoot: roots.length > 0 ? roots[0] : null,
        }
    }

    componentWillReceiveProps(nextProps) {
        // Hide modal if we're finished.
        // We're finished if wip is true in current props and false in next props without an error
        const wip = this.props.getWIP('create'),
            nWip = nextProps.getWIP('create'),
            nErr = nextProps.getError('create');
        if (wip && !nWip && !nErr) {
            this.hideModal();
        }

        // Set shown root once we have the hierarchy available
        if (this.state.shownRoot === null && nextProps.hierarchy.roots.length > 0) {
            this.setState({shownRoot: nextProps.hierarchy.roots[0]});
        }
    }

    showModal = () => this.setState({modalOpen: true});
    hideModal = () => this.setState({modalOpen: false});

    renderNode(node) {
        const {getSourceById, hierarchy} = this.props;
        const children = hierarchy.childMap.get(node.id),
            hasChildren = Array.isArray(children) && children.length > 0,
            label = extractI18n(node.i18n, ['name'])[0];

        return <List.Item key={node.id}>
            <List.Content>
                <List.Header>
                    <Link to={`/sources/${node.id}`}>{label}</Link>
                    &nbsp;&nbsp;
                    {hasChildren ? <Label circular color="teal" size="tiny">{children.length}</Label> : null}
                </List.Header>
                <List.Description>{node.description}</List.Description>
            </List.Content>
        </List.Item>
    };

    renderHierarchy() {
        const {getSourceById, hierarchy, getWIP} = this.props,
            wip = getWIP('fetchAll'),
            isEmpty = hierarchy.roots.length === 0 && hierarchy.childMap.size === 0;

        if (isEmpty) {
            return wip ?
                <LoadingSplash text="Loading sources hierarchy" subtext="With you in a second..."/> :
                <FrownSplash text="No sources found in DB" subtext="Come on, go ahead and add some !"/>;
        }

        const root = getSourceById(this.state.shownRoot);

        return <Grid>
            <Grid.Row>
                {/* main content */}
                <Grid.Column stretched width={12}>
                    <List relaxed divided className="rtl-dir">
                        {
                            hierarchy.childMap.get(root.id)? hierarchy.childMap.get(root.id).map(x => this.renderNode(getSourceById(x))): null
                        }
                    </List>
                </Grid.Column>

                {/* menu */}
                <Grid.Column width={4}>
                    <Menu fluid vertical tabular='right'>
                        {
                            hierarchy.roots.map(x => {
                                const node = getSourceById(x),
                                    children = hierarchy.childMap.get(x),
                                    hasChildren = Array.isArray(children) && children.length > 0,
                                    label = extractI18n(node.i18n, ['name'])[0];
                                return <Menu.Item key={x}
                                                  as="div"
                                                  active={x === root.id}
                                                  onClick={() => this.setState({shownRoot: x})}>
                                    <Header size="small" textAlign="right">
                                        <Header.Content>
                                            <Label circular
                                                   color="teal"
                                                   size="tiny"
                                                   content={hasChildren ? children.length : 0}/>
                                            <Link to={`/sources/${x}`}>{label}</Link>
                                            <Header.Subheader>
                                                {node.description}
                                            </Header.Subheader>
                                        </Header.Content>
                                    </Header>
                                </Menu.Item>;
                            })
                        }
                    </Menu>
                </Grid.Column>
            </Grid.Row>
        </Grid>;
    };

    render() {
        const modalOpen = this.state.modalOpen;

        return <div>
            <Menu attached borderless size="large">
                <Menu.Item header>
                    <Header content="Sources Hierarchy" size="medium" color="blue"/>
                </Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item onClick={this.showModal}>
                        <Icon name="plus"/>
                        New Root
                    </Menu.Item>
                </Menu.Menu>
            </Menu>

            <Segment attached>
                {this.renderHierarchy()}
            </Segment>

            <Modal closeIcon
                   size="small"
                   open={modalOpen}
                   onClose={this.hideModal}>
                <Modal.Header>Create New Root Source</Modal.Header>
                <Modal.Content>
                    <NewSourceForm {...this.props}/>
                </Modal.Content>
            </Modal>
        </div>;
    }
}

export default SourcesHierarchy;
