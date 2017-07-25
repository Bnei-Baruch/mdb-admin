import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {fromPairs, trim} from 'lodash';

import moment from 'moment';
import {Button, Divider, Flag, Form, Header, Input, Dropdown, Segment, Select, Checkbox} from 'semantic-ui-react';
import {
    LANGUAGES,
    LANG_ENGLISH,
    LANG_HEBREW,
    LANG_RUSSIAN,
    LANG_SPANISH,
    MAJOR_LANGUAGES,
    COLLECTION_TYPE_OPTIONS, COLLECTION_TYPE, CT_CONGRESS, CT_VIDEO_PROGRAM, CT_VIRTUAL_LESSON
} from '../../helpers/consts';
import {countries} from '../../helpers/countries';
import * as shapes from '../shapes';
import {formatError, isValidPattern} from '../../helpers/utils';
import LanguageSelector from '../shared/LanguageSelector';
import './collections.css';

class NewCollectionForm extends Component {
    static propTypes = {
        create: PropTypes.func.isRequired,
        wipOfCreate: PropTypes.bool.isRequired,
        errOfCreate: PropTypes.bool,
        collection: shapes.Collection,
    };

    static defaultProps = {
        collection: null
    };

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        let i18nArr = MAJOR_LANGUAGES.map(l => ([l, {language: l, name: '', description: ''}]));

        return {
            type_id: COLLECTION_TYPE[CT_CONGRESS].value,
            isActive: false,
            pattern: '',
            i18n: fromPairs(i18nArr),
            submitted: false,
            errors: {},
            start_day: moment().format("YYYY-MM-DD"),
            end_day: moment().add(1, 'days').format("YYYY-MM-DD"),
            country: '',
            city: '',
            full_address: '',
            default_language: LANG_HEBREW
        };
    }


    changeTypeId = (e, {value}) => this.setState({type_id: value});
    toggleActive = () => this.setState({isActive: !this.state.isActive});

    onPatternChange = (e, {value}) => {
        const errors = this.state.errors;
        if (isValidPattern(value)) {
            delete errors.pattern;
        } else {
            errors.pattern = true;
        }

        this.setState({pattern: value, errors});
    };

    onI18nChange = (e, {value}, language) => {
        const {errors, i18n} = this.state;
        if (errors.i18n && value.trim() !== '') {
            delete errors.i18n;
        }
        i18n[language].name = value;

        this.setState({errors, i18n});
    };

    onCountryChange = (e, {value}) => {
        const errors = this.state.errors;
        delete errors.country;

        this.setState({country: value, errors});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.isValid()) {
            return;
        }
        const {i18n, type_id} = this.state;

        this.props.create({type_id, properties: this.prepareDataByTypeId(), i18n});
        this.setState({submitted: true});
    };

    prepareDataByTypeId = () => {
        const parent = this.props.collection;
        const {pattern, start_day, end_day, country, city, full_address, type_id, default_language} = this.state;

        let properties = {
            parent_id: parent ? parent.id : null,
            pattern: pattern,
        };
        switch (type_id) {
            case COLLECTION_TYPE[CT_CONGRESS].value:
                Object.assign(properties, {start_day, end_day, country, city, full_address});
                break;
            case COLLECTION_TYPE[CT_VIDEO_PROGRAM].value:
            case COLLECTION_TYPE[CT_VIRTUAL_LESSON].value:
                properties.default_language = default_language;
                break;
        }
        return properties;
    };

    isValid = () => {
        const {type_id, pattern, start_day, end_day, country, city, errors} = this.state;
        if (Object.keys(errors).filter((key) => !errors[key]).length !== 0) {
            return false;
        }
        let requiredFields = {pattern};
        if (type_id === COLLECTION_TYPE[CT_CONGRESS].value) {
            requiredFields = Object.assign(requiredFields, {start_day, end_day, country});
        }
        let _errors = Object.keys(requiredFields).filter(key => !trim(requiredFields[key])).map(key => {
            return [key, true];
        });

        if (_errors.length > 0) {
            this.setState({errors: fromPairs(_errors)});
            return false;
        }
        return true;
    };

    renderCongressFields = () => {
        const {city, start_day, end_day, address, errors} = this.state;
        const dayPickerStartProps = {
            disabledDays: {
                after: moment(end_day).toDate(),
            },
        };
        const dayPickerEndProps = {
            disabledDays: {
                before: moment(start_day).toDate(),
            },
        };
        return (
            <div>
                <Form.Group widths="equal">
                    <Form.Field error={!!errors.start_day}>
                        <label htmlFor="start_day">Start day*</label>
                        <DayPickerInput
                            style={{width: '100%', zIndex: 1000}}
                            placeholder="YYYY-MM-DD"
                            format="YYYY-MM-DD"
                            value={moment(start_day).format("YYYY-MM-DD")}
                            onDayChange={val => {
                                delete errors.start_day;
                                this.setState({start_day: val, errors})
                            }}
                            dayPickerProps={dayPickerStartProps}/>
                    </Form.Field>
                    <Form.Field error={!!errors.end_day}>
                        <label htmlFor="end_day">End day*</label>
                        <DayPickerInput
                            style={{width: '100%', zIndex: 1000}}
                            placeholder="YYYY-MM-DD"
                            format="YYYY-MM-DD"
                            value={moment(end_day).format("YYYY-MM-DD")}
                            onDayChange={val => {
                                delete errors.end_day;
                                this.setState({end_day: val})
                            }}
                            dayPickerProps={dayPickerEndProps}/>
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field error={!!errors.country}>
                        <label htmlFor="country">Country*</label>
                        <Dropdown
                            placeholder='Select Country'
                            fluid
                            search
                            selection
                            onChange={this.onCountryChange}
                            options={countries}/>
                    </Form.Field>
                    <Form.Field error={!!errors.city}>
                        <label htmlFor="city">City</label>
                        <Input id="city"
                               placeholder="City"
                               value={city}
                               onChange={(e, {value}) => this.setState({city: value})}/>
                    </Form.Field>
                </Form.Group>
                <Form.Field>
                    <label htmlFor="end_day">Address</label>
                    <Input id="address"
                           placeholder="Address"
                           value={address}
                           onChange={(e, {value}) => this.setState({address: value})}/>
                </Form.Field>
            </div>
        );
    };

    renderDefaultLanguage = () => {
        const default_language = this.state.default_language;
        return (
            <div>
                <Flag name={LANGUAGES[default_language].flag}/>
                {LANGUAGES[default_language].text}
                <LanguageSelector
                    exclude={[default_language]}
                    onSelect={ l => {
                        this.setState({default_language: l})
                    }}
                    text="Select default language"/>
            </div>
        );

    };

    renderByType = () => {
        const {type_id} = this.state;
        switch (type_id) {
            case COLLECTION_TYPE[CT_CONGRESS].value:
                return (this.renderCongressFields());
            case COLLECTION_TYPE[CT_VIDEO_PROGRAM].value:
            case COLLECTION_TYPE[CT_VIRTUAL_LESSON].value:
                return this.renderDefaultLanguage();
            default:
                return null;
        }
    };

    render() {
        const {wipOfCreate, errOfCreate} = this.props;
        const {submitted, errors, isActive, pattern, i18n} = this.state;
        return (
            <Segment.Group>
                <Segment basic>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Field widths={7}>
                                <label htmlFor="type_id">Collection type</label>
                                <Select id="type_id"
                                        onChange={this.changeTypeId}
                                        placeholder='Select collection type'
                                        options={COLLECTION_TYPE_OPTIONS}/>
                            </Form.Field>
                            <Form.Field widths={7} error={!!errors.pattern}>
                                <label htmlFor="pattern">Pattern</label>
                                <Input
                                    id="pattern"
                                    placeholder="Pattern"
                                    value={pattern}
                                    onChange={this.onPatternChange}/>
                                <small className="helper">
                                    Used in physical file names.
                                    English words separated with &lsquo;-&rsquo;
                                </small>
                            </Form.Field>
                            <Form.Field widths={2} error={!!errors.sctive}>
                                <label htmlFor="active">active</label>
                                <Checkbox id="active" checked={isActive} onChange={this.toggleActive}/>
                            </Form.Field>
                        </Form.Group>
                        <Divider horizontal section>Translations</Divider>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label htmlFor="he.name"><Flag name="ru"/>Hebrew</label>
                                <Input
                                    id="he.name"
                                    placeholder="Label in Hebrew"
                                    value={i18n[LANG_HEBREW].name}
                                    onChange={(e, x) => this.onI18nChange(e, x, LANG_HEBREW)}
                                    />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="ru.name"><Flag name="ru"/>Russian</label>
                                <Input
                                    id="ru.name"
                                    placeholder="Label in Russian"
                                    value={i18n[LANG_RUSSIAN].name}
                                    onChange={(e, x) => this.onI18nChange(e, x, LANG_RUSSIAN)}
                                    />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label htmlFor="en.name"><Flag name="us"/>English</label>
                                <Input
                                    id="en.name"
                                    placeholder="Label in English"
                                    value={i18n[LANG_ENGLISH].name}
                                    onChange={(e, x) => this.onI18nChange(e, x, LANG_ENGLISH)}
                                    />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="es.name"><Flag name="es"/>Spanish</label>
                                <Input
                                    id="es.name"
                                    placeholder="Label in Spanish"
                                    value={i18n[LANG_SPANISH].name}
                                    onChange={(e, x) => this.onI18nChange(e, x, LANG_SPANISH)}
                                    />
                            </Form.Field>
                        </Form.Group>
                        {this.renderByType()}
                    </Form>
                </Segment>

                <Segment clearing attached="bottom" size="tiny">
                    {submitted && errOfCreate ?
                        <Header
                            inverted
                            content={formatError(errOfCreate)}
                            color="red"
                            icon="warning sign"
                            floated="left"
                            size="tiny"
                            style={{marginTop: '0.2rem', marginBottom: '0'}}
                            />
                        : null}
                    <Button
                        primary
                        content="Save"
                        size="tiny"
                        floated="right"
                        loading={wipOfCreate}
                        disabled={wipOfCreate}
                        onClick={this.handleSubmit}
                        />
                </Segment>
            </Segment.Group>
        );
    }
}

export default NewCollectionForm;
