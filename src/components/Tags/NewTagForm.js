import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Divider, Flag, Form, Header, Input, Message, Segment} from "semantic-ui-react";
import {isValidPattern, formatError} from "../../helpers/utils";
import {LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, MAJOR_LANGUAGES} from "../../helpers/consts";

class NewTagForm extends Component {
    static propTypes = {
        create: PropTypes.func.isRequired,
        getWIP: PropTypes.func.isRequired,
        getError: PropTypes.func.isRequired,
        tag: PropTypes.object,
    };

    static defaultProps = {
        tag: null
    };

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            description: "",
            pattern: "",
            labels: {
                [LANG_HEBREW]: "",
                [LANG_RUSSIAN]: "",
                [LANG_ENGLISH]: "",
                [LANG_SPANISH]: "",
            },
            submitted: false,
            errors: {},
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if (!this.validate()) {
            return;
        }

        const parent = this.props.tag;
        let {pattern, description, labels} = this.state;
        description = description.trim();
        let i18n = {};
        Object.keys(labels)
            .map(x => ({language: x, label: labels[x].trim()}))
            .filter(x => x.label !== "")
            .forEach(x => i18n[x.language] = x);

        this.props.create(parent ? parent.id : null, pattern, description, i18n);

        this.setState({submitted: true});
    };

    onDescriptionChange = (e, {value}) => {
        this.setState({description: value});
    };

    onPatternChange = (e, {value}) => {
        let errors = this.state.errors;
        if (isValidPattern(value)) {
            delete errors["pattern"];
        } else {
            errors.pattern = true;
        }

        this.setState({pattern: value, errors});
    };

    onLabelChange = (e, {value}, language) => {
        let errors = this.state.errors;
        if (errors.labels && value.trim() !== "") {
            delete errors["labels"];
        }

        this.setState({errors, labels: {...this.state.labels, [language]: value}});
    };

    validate() {
        const {pattern, labels} = this.state;
        let errors = {};

        if (!isValidPattern(pattern)) {
            errors.pattern = true;
        }

        if (MAJOR_LANGUAGES.every(x => labels[x].trim() === "")) {
            errors.labels = true;
        }

        this.setState({errors});

        return !errors.pattern && !errors.labels;
    }


    render() {
        const {getWIP, getError} = this.props,
            wip = getWIP('create'),
            err = getError('create');
        const {description, pattern, labels, submitted, errors} = this.state;

        return <Segment.Group>
            <Segment basic>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field error={Boolean(errors.pattern)}>
                        <label>Pattern</label>
                        <Input placeholder="Pattern"
                               value={pattern}
                               onChange={this.onPatternChange}/>
                        <small className="helper">Used in physical file names. English words separated with '-'</small>
                    </Form.Field>

                    <Form.Field >
                        <label>Description</label>
                        <Input placeholder="Description"
                               value={description}
                               onChange={this.onDescriptionChange}/>
                        <small className="helper">A short description about this tag</small>
                    </Form.Field>

                    <Divider horizontal section>Translations</Divider>

                    <Form.Group widths="equal">
                        <Form.Field>
                            <label><Flag name="il"/>Hebrew</label>
                            <Input placeholder="Label in Hebrew"
                                   value={labels[LANG_HEBREW]}
                                   onChange={(e, x) => this.onLabelChange(e, x, LANG_HEBREW)}/>
                        </Form.Field>
                        <Form.Field>
                            <label><Flag name="ru"/>Russian</label>
                            <Input placeholder="Label in Russian"
                                   value={labels[LANG_RUSSIAN]}
                                   onChange={(e, x) => this.onLabelChange(e, x, LANG_RUSSIAN)}/>
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths="equal">
                        <Form.Field>
                            <label><Flag name="us"/>English</label>
                            <Input placeholder="Label in English"
                                   value={labels[LANG_ENGLISH]}
                                   onChange={(e, x) => this.onLabelChange(e, x, LANG_ENGLISH)}/>
                        </Form.Field>
                        <Form.Field>
                            <label><Flag name="es"/>Spanish</label>
                            <Input placeholder="Label in Spanish"
                                   value={labels[LANG_SPANISH]}
                                   onChange={(e, x) => this.onLabelChange(e, x, LANG_SPANISH)}/>
                        </Form.Field>
                    </Form.Group>

                    {errors.labels ? <Message negative content="At least one translation is required"/> : null}
                </Form>
            </Segment>

            <Segment clearing attached="bottom" size="tiny">
                {submitted && err ?
                    <Header inverted
                            content={formatError(err)}
                            color="red"
                            icon="warning sign"
                            floated="left"
                            size="tiny"
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
        </Segment.Group>;
    }
}

export default NewTagForm;
