import React from "react";
import {Button, Dropdown, Grid, Header, Menu, Segment, Label} from "semantic-ui-react";
import {LANGUAGE_OPTIONS} from "../../helpers/consts";


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

// const center = <Header as='h2' icon textAlign='center'>
//     <Icon name='users' circular/>
//     <Header.Content>
//         Friends
//         <Header.Subheader>
//             I love all my friends in ten #8
//         </Header.Subheader>
//     </Header.Content>
// </Header>;

const center = <Grid>
    <Grid.Column stretched width={12}>
        <Segment>
            This is an stretched grid column. This segment will always match the tab height
        </Segment>
    </Grid.Column>

    <Grid.Column width={4}>
        <Menu fluid vertical tabular='right'>
            <Menu.Item name='bio' active>
                <Header size="small" textAlign="right">
                    <Header.Content >
                        <Label circular color="teal" size="tiny" content={189}/>
                        &nbsp;
                        נושאי שיעור מיוחדים
                        <Header.Subheader>
                            I love all my friends in ten #8
                        </Header.Subheader>
                    </Header.Content>
                </Header>
            </Menu.Item>
            <Menu.Item name='pics'/>
            <Menu.Item name='companies'/>
            <Menu.Item name='links'/>
        </Menu>
    </Grid.Column>
</Grid>;

const bottom = <Segment clearing attached="bottom" size="tiny">
    <Header inverted
            style={{"margin-top": "0.2rem", "margin-bottom": "0"}}
            icon="warning sign"
            color="red"
            floated="left"
            content="Something bad happened"/>
    <Button primary
            loading={false}
            disabled={false}
            content="Save"
            size="tiny"
            floated="right"/>
</Segment>;

const renderCurrent = () => {
    return <div>
        <Header as="h3" attached="top" color="blue">
            Header Title
        </Header>
        <Segment attached>
            {center}
        </Segment>
        {bottom}
    </div>;
};


const renderSegmentGroup = () => {
    return <Segment.Group>
        <Segment clearing>
            <Header size="medium" color="blue" floated="left">
                Header Title
            </Header>
            <Button.Group floated="right" color="green" size="tiny">
                <Dropdown labeled button scrolling
                    // style={{float: "right"}}

                          className="icon"
                          icon="plus"
                          text="Language"
                          options={LANGUAGE_OPTIONS}/>
            </Button.Group>
        </Segment>
        <Segment attached>
            {center}
        </Segment>
        {bottom}
    </Segment.Group>;
};


const renderMenu = () => {
    return <div>
        <Menu attached borderless size='large'>
            <Menu.Item header>
                <Header size="medium" color="blue">
                    Header Title
                </Header>
            </Menu.Item>

            <Menu.Menu position="right">
                <Dropdown item labeled scrolling
                          text='Add Language'
                          options={LANGUAGE_OPTIONS}/>
            </Menu.Menu>
        </Menu>
        <Segment attached>
            {center}
        </Segment>
        {bottom}
    </div>;
};


const Design = () => {
    let contents = [
        <Header as="h2" content="Menu"/>,
        renderMenu(),
        <Header as="h2" content="current"/>,
        renderCurrent(),
        <Header as="h2" content="Segment group"/>,
        renderSegmentGroup(),
    ];

    // return renderInGrid(contents);
    return renderInGrid([center]);
};

export default Design;
