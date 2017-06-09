import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Flag, Header, Input, Message, Segment, Table, Menu} from "semantic-ui-react";
import classNames from "classnames";
import LanguageSelector from "../shared/LanguageSelector";
import {formatError} from "../../helpers/utils";
import {ALL_LANGUAGES, LANGUAGES, RTL_LANGUAGES, LANG_MULTI, LANG_UNKNOWN} from "../../helpers/consts";

class ContentUnitI18nForm extends Component {

    static propTypes = {
        updateI18n: PropTypes.func.isRequired,
        getWIP: PropTypes.func.isRequired,
        getError: PropTypes.func.isRequired,
        unit: PropTypes.object,
    };

    static defaultProps = {
        unit: {
            i18n: {}
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            i18n: {...props.unit.i18n},
            submitted: false,
            errors: {}
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.unit.i18n !== nextProps.unit.i18n) {
            this.setState({i18n: nextProps.unit.i18n, errors: {}});
        }
    }

    addLanguage = (language) => {
        let i18n = this.state.i18n;
        i18n[language] = {language, label: ""};
        this.setState({i18n});
    };

    removeLanguage = (language) => {
        let i18n = this.state.i18n;
        delete i18n[language];
        this.setState({i18n});
    };

    onLabelChange = (e, {value}) => {
        let i18n = this.state.i18n;
        i18n[e.target.name].label = value;
        this.setState({i18n});
    };

    handleSubmit = () => {
        const {unit, updateI18n} = this.props;
        const i18n = this.state.i18n,
            data = Object.keys(i18n).map(x => i18n[x]);
        updateI18n(unit.id, data);

        this.setState({submitted: true});
    };

    renderI18ns() {
        const i18n = this.state.i18n,
            keys = Object.keys(i18n)
                .sort((a, b) => ALL_LANGUAGES.indexOf(a) - ALL_LANGUAGES.indexOf(b));

        if (keys.length === 0) {
            return <Message size="tiny">No translations found</Message>;
        } else {
            return <Table basic compact>
                <Table.Body>
                    {keys.map(k =>
                        <Table.Row key={k}>
                            <Table.Cell collapsing>
                                <Flag name={LANGUAGES[k].flag}/>
                                {LANGUAGES[k].text}
                            </Table.Cell>
                            <Table.Cell>
                                <Input fluid
                                       transparent
                                       className={classNames({"bb-input": true, "rtl-dir": RTL_LANGUAGES.includes(k)})}
                                       name={k}
                                       value={i18n[k].label}
                                       onChange={this.onLabelChange}
                                       required/>
                            </Table.Cell>
                            <Table.Cell collapsing>
                                <Button circular compact
                                        size="mini"
                                        icon="remove"
                                        color="red"
                                        inverted
                                        onClick={e => this.removeLanguage(k)}/>
                            </Table.Cell>
                        </Table.Row>)
                    }
                </Table.Body>
            </Table>;
        }
    }

    render() {
        const {getWIP, getError} = this.props,
            wip = getWIP('updateI18n'),
            err = getError('updateI18n');

        const {i18n, submitted} = this.state,
            exclude = [LANG_MULTI, LANG_UNKNOWN].concat(Object.keys(i18n));

        return <div>
            <Menu attached borderless size="large">
                <Menu.Item header>
                    <Header content="Translations" size="medium" color="blue" />
                </Menu.Item>
                <Menu.Menu position="right">
                    <LanguageSelector exclude={exclude} onSelect={this.addLanguage}/>
                </Menu.Menu>
            </Menu>

            <Segment attached>
                {this.renderI18ns()}
            </Segment>

            <Segment clearing attached="bottom" size="tiny">
                {submitted && err ?
                    <Header inverted
                            content={formatError(err)}
                            color="red"
                            icon="warning sign"
                            floated="left"
                            style={{marginTop: "0.2rem", marginBottom: "0"}}/>
                    : null}
                <Button primary
                        content="Save"
                        size="tiny"
                        floated="right"
                        loading={wip}
                        disabled={wip}
                        onClick={this.handleSubmit}/>
            </Segment>
        </div>;
    };
}

export default ContentUnitI18nForm;
