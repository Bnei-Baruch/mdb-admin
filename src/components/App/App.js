import React, { Component } from 'react';
import { Button, Icon, Menu } from 'semantic-ui-react'
import { Router, NavLink, Route } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory';
import File from '../File/File';
import Files from '../Files/Files';
import ContentUnit from '../ContentUnit/ContentUnit';
import ContentUnits from '../ContentUnits/ContentUnits';
import Collection from '../Collection/Collection';
import Collections from '../Collections/Collections';
import Operation from '../Operation/Operation';
import Operations from '../Operations/Operations';
import Welcome from '../Welcome/Welcome';
import './App.css';

const history = createBrowserHistory({
    basename: process.env.NODE_ENV === 'production' ? '/admin/' : ''
});

class App extends Component {

    state = {
        activeItemsVisible: false,
        activeItems: []
    };

    componentDidMount() {
        this._unlistenHistoryChanged = history.listen(this.historyChanged);
        this.historyChanged(history.location);
    }

    componentWillUnmount() {
        this._unlistenHistoryChanged();
    }

    historyChanged = (location) => {
        if (!!location.pathname.match(/files\/\d+/) &&
            !this.state.activeItems.includes(location.pathname)) {
            this.setState({
                activeItems: [
                    ...this.state.activeItems,
                    location.pathname
                ],
                activeItemsVisible: true,
            });
        }
    };

    activeItemText = (item) => {
        return item.match(/files\/(\d+)/)[1];
    };

    removeActiveItem = (item) => {
        if (this.state.activeItems.includes(item)) {
            const newActiveItems = this.state.activeItems.slice();
            newActiveItems.splice(newActiveItems.indexOf(item), 1);
            this.setState({
                activeItems: newActiveItems,
                activeItemsVisible: !!newActiveItems.length,
            });
        }
    };

    toggleActiveItems = () => this.setState({ activeItemsVisible: !this.state.activeItemsVisible });

    render() {
        const { activeItemsVisible } = this.state;
        return (
            <Router history={history}>
                <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
                    <Menu pointing>
                      <Menu.Item as={NavLink} to="/" exact>Welcome</Menu.Item>
                      <Menu.Item as={NavLink} to="/collections">Collections</Menu.Item>
                      <Menu.Item as={NavLink} to="/content_units">Content Units</Menu.Item>
                      <Menu.Item as={NavLink} to="/files">Files</Menu.Item>
                      <Menu.Item as={NavLink} to="/operations">Operations</Menu.Item>
                      <Menu.Menu position='right'>
                          <Button icon size='mini'
                                  style={{margin: 5}}
                                  onClick={this.toggleActiveItems}>
                            <Icon name='history' />
                          </Button>
                      </Menu.Menu>
                    </Menu>
                    <div style={{display: 'flex', flexDirection: 'row', flex: '1 0 auto'}}>
                        <div style={{display: 'flex', flexDirection: 'column', flex: '1 0 auto'}}>
                            <Route exact path="/" component={Welcome}/>
                            <Route exact path="/files" component={Files}/>
                            <Route exact path="/files/:id" component={File}/>
                            <Route exact path="/content_units" component={ContentUnits}/>
                            <Route exact path="/content_units/:id" component={ContentUnit}/>
                            <Route exact path="/collections" component={Collections}/>
                            <Route exact path="/collections/:id" component={Collection}/>
                            <Route exact path="/operations" component={Operations}/>
                            <Route exact path="/operations/:id" component={Operation}/>
                        </div>
                        <div style={{
                            display: activeItemsVisible ? 'block' : 'none',
                            width: '150px'
                        }}>
                             <Menu fluid vertical tabular='right'>
                                 {
                                     this.state.activeItems.map(i =>
                                        <Menu.Item as={NavLink} key={i} to={i}>
                                            File #{this.activeItemText(i)}
                                            <i className='remove icon' onClick={() => this.removeActiveItem(i)}/>
                                        </Menu.Item>
                                 )}
                             </Menu>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
