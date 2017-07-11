import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import trim from 'lodash/trim';
import {Button, Divider, Flag, Form, Header, Input, Dropdown, Segment, Select, Checkbox} from 'semantic-ui-react';
import {
    LANG_ENGLISH,
    LANG_HEBREW,
    LANG_RUSSIAN,
    LANG_SPANISH,
    MAJOR_LANGUAGES,
    COLLECTION_TYPE_OPTIONS, CT_CONGRESS, CT_VIDEO_PROGRAM, CT_VIRTUAL_LESSON
} from '../../helpers/consts';
import {countries} from '../../helpers/countries';
import * as shapes from '../shapes';
import {formatError, isValidPattern} from '../../helpers/utils';

class NewCollectionForm extends Component {
    static propTypes = {
        create: PropTypes.func.isRequired,
        getWIP: PropTypes.func.isRequired,
        getError: PropTypes.func.isRequired,
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
        return {
            typeId: CT_CONGRESS,
            isActive: '',
            pattern: '',
            labels: {
                [LANG_HEBREW]: ''
            },
            submitted: false,
            errors: {},
            start_day: moment().format("YYYY-MM-DD"),
            end_day: null,
            country: '',
            city: '',
            full_address: '',
        };
    }


    changeTypeId = (e, {value}) => this.setState({typeId: value});
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

    onCountryChange = (e, {value}) => {
        const errors = this.state.errors;
        delete errors.country;
        this.setState({country: value, errors});
    };

    handleSubmit = () => {
        if (!this.isValid()) {
            return;
        }
    };

    isValid = ()=> {
        const {typeId, pattern, start_day,end_day, country,city, errors} = this.state;
        if (Object.keys(errors).filter((key)=>!errors[key]).length !== 0) {
            return false;
        }
        let requiredFields = {pattern};
        if (typeId === CT_CONGRESS) {
            requiredFields = Object.assign(requiredFields, {start_day, end_day, country});
        }
        let _errors = {};
        Object.keys(requiredFields).filter(key=>!trim(requiredFields[key])).forEach(key=> {
            _errors[key] = true;
        });

        if (Object.keys(_errors).length > 0) {
            this.setState({errors: _errors});
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
    }

    renderDefaultLanguage = () => {
        /*
         default_language

         */

    }

    renderByType = () => {
        const {typeId} = this.state;
        switch (typeId) {
            case CT_CONGRESS:
                return (this.renderCongressFields());
            case CT_VIDEO_PROGRAM:
            case CT_VIRTUAL_LESSON:
                return this.renderDefaultLanguage();
            default:
                return null;
        }


    };

    render() {

        const {wip, err} = this.props;
        const {submitted, errors, isActive, pattern, labels} = this.state;
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
                                <label htmlFor="he.name"><Flag name="il"/>Hebrew</label>
                                <Input
                                    id="he.name"
                                    placeholder="Label in Hebrew"
                                    value={labels[LANG_HEBREW]}
                                    onChange={(e, x) => this.onLabelChange(e, x, LANG_HEBREW)}
                                    />
                            </Form.Field>
                        </Form.Group>
                        {this.renderByType()}
                    </Form>
                </Segment>

                <Segment clearing attached="bottom" size="tiny">
                    {submitted && err ?
                        <Header
                            inverted
                            content={formatError(err)}
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
                        loading={wip}
                        disabled={wip}
                        onClick={this.handleSubmit}
                        />
                </Segment>
            </Segment.Group>
        )
    }
}

export default NewCollectionForm;
