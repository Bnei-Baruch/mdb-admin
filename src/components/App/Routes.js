import React from 'react';
import { Route, Switch } from 'react-router-dom';
import FileContainer from '../File/FileContainer';
import Files from '../Files/Files';
import ContentUnit from '../ContentUnit/Container';
import ContentUnits from '../ContentUnits/ContentUnits';
import Collection from '../Collection/Container';
import Collections from '../Collections/Collections';
import Operation from '../Operation/Operation';
import Operations from '../Operations/Operations';
import TagsContainer from '../Tags/TagsContainer';
import TagContainer from '../Tags/TagContainer';
import SourcesContainer from '../Sources/SourcesContainer';
import SourceContainer from '../Sources/SourceContainer';
import Welcome from '../Welcome/Welcome';
import Design from '../Design/Design';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Welcome} />
    <Route exact path="/files" component={Files} />
    <Route exact path="/files/:id" component={FileContainer} />
    <Route exact path="/content_units" component={ContentUnits} />
    <Route exact path="/content_units/:id" component={ContentUnit} />
    <Route exact path="/collections" component={Collections} />
    <Route exact path="/collections/:id" component={Collection} />
    <Route exact path="/operations" component={Operations} />
    <Route exact path="/operations/:id" component={Operation} />
    <Route exact path="/tags" component={TagsContainer} />
    <Route exact path="/tags/:id" component={TagContainer} />
    <Route exact path="/sources" component={SourcesContainer} />
    <Route exact path="/sources/:id" component={SourceContainer} />
    <Route exact path="/design" component={Design} />
    <Route render={() => <h1>Page not found</h1>} />
  </Switch>
);

export default Routes;
