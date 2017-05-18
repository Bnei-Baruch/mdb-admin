import React from "react";
import PropTypes from "prop-types";
import {Dropdown} from "semantic-ui-react";
import {LANG_HEBREW, LANG_MULTI, LANG_UNKNOWN, LANGUAGE_OPTIONS} from "../../../helpers/consts";


const LanguageSelector = (props) => {
    const options = LANGUAGE_OPTIONS.filter(x => !props.exclude.includes(x.value));

    return <Dropdown item labeled scrolling
                     text="Add Language"
                     defaultValue={props.defaultValue}
                     options={options}
                     onChange={(e, {value}) => props.onSelect(value)}/>;
};

LanguageSelector.propTypes = {
    onSelect: PropTypes.func.isRequired,
    defaultValue: PropTypes.string,
    exclude: PropTypes.array,
};

LanguageSelector.defaultProps = {
    defaultValue: LANG_HEBREW,
    exclude: [LANG_MULTI, LANG_UNKNOWN],
};

export default LanguageSelector;
