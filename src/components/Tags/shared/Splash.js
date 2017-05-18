import React from "react";
import PropTypes from "prop-types";
import {Header, Icon} from "semantic-ui-react";

export const LoadingSplash = (props) => {
    const {text, subtext} = props;

    return <Header as="h2" icon textAlign="center">
        <Icon name="spinner" loading/>
        <Header.Content>
            {text}
            {subtext ? <Header.Subheader>{subtext}</Header.Subheader> : null}
        </Header.Content>
    </Header>;
};

LoadingSplash.propTypes = {
    text: PropTypes.node,
    subtext: PropTypes.node,
};

export const FrownSplash = (props) => {
    const {text, subtext} = props;

    return <Header as="h2" icon textAlign="center">
        <Icon name="frown" color="orange"/>
        <Header.Content>
            {text}
            {subtext ? <Header.Subheader>{subtext}</Header.Subheader> : null}
        </Header.Content>
    </Header>;
};

FrownSplash.propTypes = {
    text: PropTypes.node,
    subtext: PropTypes.node,
};
