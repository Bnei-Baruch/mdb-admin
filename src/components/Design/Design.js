import React from "react";
import {Grid, Header} from "semantic-ui-react";
import Player from "../Player/JWPlayer";


const renderInGrid = content => {
    return <Grid container>
        {
            content.map((x, i) =>
                <Grid.Row key={i}>
                    <Grid.Column width={16}>
                        {x}
                    </Grid.Column>
                </Grid.Row>
            )}
    </Grid>;
};

const Design = () => {
    let contents = [
        <Header as="h2" content="Menu"/>,
        <Player file="http://files.kabbalahmedia.info/files/heb_o_norav_2017-05-21_lesson_achana_n1_p0.mp4"/>
    ];

    // return renderInGrid(contents);
    return renderInGrid(contents);
};

export default Design;