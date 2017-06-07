import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Divider, Flag, Form, Header, Input, Message, Segment } from "semantic-ui-react";
import { isValidPattern, formatError } from "../../helpers/utils";
import { LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, MAJOR_LANGUAGES } from "../../helpers/consts";

class NewSourceForm extends Component {
    static propTypes = {
        create  : PropTypes.func.isRequired,
        getWIP  : PropTypes.func.isRequired,
        getError: PropTypes.func.isRequired,
        source  : PropTypes.object,
    };

    static defaultProps = {
        source: null
    };

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        let i18n = {};
        MAJOR_LANGUAGES.forEach(l=>i18n[l] = { label: "", description: null });
        return {
            description: "",
            pattern    : "",
            i18n       : i18n,
            submitted  : false,
            errors     : {},
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if (!this.validate()) {
            return;
        }

        const parent = this.props.source;
        let { pattern, description, i18n } = this.state;
        description  = description.trim();
        let _i18n    = {};
        Object.keys(i18n)
            .filter(x => i18n[x].label !== "")
            .forEach(x => {
                _i18n[x] = {
                    label      : i18n[x].label.trim(),
                    description: i18n[x].description ? i18n[x].description.trim() : i18n[x].description,
                    language   : x
                }
            });

        this.props.create(parent ? parent.id : null, pattern, description, _i18n);

        this.setState({ submitted: true });
    };

    onDescriptionChange = (e, { value }) => {
        this.setState({ description: value });
    };

    onPatternChange = (e, { value }) => {
        let errors = this.state.errors;
        if (isValidPattern(value)) {
            delete errors["pattern"];
        } else {
            errors.pattern = true;
        }

        this.setState({ pattern: value, errors });
    };

    onLabelChange = (e, { value }, language) => {
        let { errors, i18n } = this.state;
        if (errors.labels && value.trim() !== "") {
            delete errors["labels"];
        }
        i18n[language].label = value;
        this.setState({ errors, i18n: i18n });
    };

    onI18nDescriptionChange = (e, { value }, language) => {
        const i18n                 = this.state.i18n;
        i18n[language].description = value;
        this.setState({ i18n: i18n });
    };

    validate() {
        const { pattern, i18n } = this.state;
        let errors = {};

        if (!isValidPattern(pattern)) {
            errors.pattern = true;
        }

        if (MAJOR_LANGUAGES.every(x => i18n[x] && i18n[x].label.trim() === "")) {
            errors.labels = true;
        }

        this.setState({ errors });

        return !errors.pattern && !errors.labels;
    }

    renderTranslations() {
        const { i18n } = this.state;
        const translations = [{
            lang : LANG_HEBREW,
            label: "Hebrew",
            flag : "il"

        }, {
            lang : LANG_RUSSIAN,
            label: "Russian",
            flag : "ru"

        }, {
            lang : LANG_ENGLISH,
            label: "English",
            flag : "us"

        }, {
            lang : LANG_SPANISH,
            label: "Spanish",
            flag : "es"
        }];
        return translations.map(t=>
            <Form.Field key={t.lang}>
                <label><Flag name={t.flag} />{t.label}</label>
                <Input placeholder={"Label in " + t.label}
                       value={i18n[t.lang].label}
                       onChange={(e, x) => this.onLabelChange(e, x, t.lang)} />
                <Input placeholder={"Description in " + t.label}
                       value={i18n[t.lang].description}
                       onChange={(e, x) => this.onI18nDescriptionChange(e, x, t.lang)} />
            </Form.Field>
        ).map((t, index, arr)=> {
            if (index % 2 === 0) {
                return <Form.Group widths="equal" key={index}>{t} {arr[index + 1]}</Form.Group>
            }
        });
    }

    render() {
        const { getWIP, getError } = this.props,
              wip = getWIP('create'),
              err = getError('create');
        const { description, pattern, submitted, errors } = this.state;

        return <Segment.Group>
            <Segment basic>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field error={Boolean(errors.pattern)}>
                        <label>Pattern</label>
                        <Input placeholder="Pattern"
                               value={pattern}
                               onChange={this.onPatternChange} />
                        <small className="helper">Used in physical file names. English words separated with '-'</small>
                    </Form.Field>

                    <Form.Field >
                        <label>Description</label>
                        <Input placeholder="Description"
                               value={description}
                               onChange={this.onDescriptionChange} />
                        <small className="helper">A short description about this source</small>
                    </Form.Field>

                    <Divider horizontal section>Translations</Divider>
                    {this.renderTranslations()}
                    {errors.labels ? <Message negative content="At least one translation is required" /> : null}
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
                            style={{marginTop: "0.2rem", marginBottom: "0"}} />
                    : null}
                <Button primary
                        content="Save"
                        size="tiny"
                        floated="right"
                        loading={wip}
                        disabled={wip}
                        onClick={this.handleSubmit} />
            </Segment>
        </Segment.Group>;
    }
}

export default NewSourceForm;
