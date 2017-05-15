import React from 'react';
import classNames from 'classnames';

function TextFilter(props) {
    const { onChange, value, placeholder } = props;

    const removeIconClass = classNames(
        'remove icon',
        { 'invisible': value === '' }
    );

    return (
        <div>
            <div className="ui icon input">
                <input className="prompt"
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={(event) => onChange(event.target.value)} />
                <i className="search icon" />
            </div>
            <i className={removeIconClass} onClick={() => onChange('')} style={{cursor: "pointer"}} />
        </div>
    );
}

TextFilter.defaultProps = {
    value: ''
};

export default TextFilter;
