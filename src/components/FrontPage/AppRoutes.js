import React from 'react';
import { Route, Switch } from 'react-router-dom';

import File from '../File/Container';
import Files from '../Files/Container';
import ContentUnit from '../ContentUnit/Container';
import ContentUnits from '../ContentUnits/Container';
import Collection from '../Collection/Container';
import Collections from '../Collections/Container';
import Operation from '../Operation/Container';
import Operations from '../Operations/Container';
import Tags from '../Tags/TagsContainer';
import Tag from '../Tags/TagContainer';
import Persons from '../Persons/Container';
import Person from '../Person/Container';
import Publishers from '../Publishers/Container';
import Publisher from '../Publisher/Container';
import Sources from '../Sources/SourcesContainer';
import Source from '../Sources/SourceContainer';
import Labels from '../Labels/Container';
import Label from '../Label/Container';
import Welcome from './Welcome';

const AppRoutes = () => (
  <Switch>
    <Route exact path="/" component={Welcome} />
    <Route exact path="/files" component={Files} />
    <Route exact path="/files/:id" component={File} />
    <Route exact path="/content_units" component={ContentUnits} />
    <Route exact path="/content_units/:id" component={ContentUnit} />
    <Route exact path="/collections" component={Collections} />
    <Route exact path="/collections/:id" component={Collection} />
    <Route exact path="/operations" component={Operations} />
    <Route exact path="/operations/:id" component={Operation} />
    <Route exact path="/tags" component={Tags} />
    <Route exact path="/tags/:id" component={Tag} />
    <Route exact path="/sources" component={Sources} />
    <Route exact path="/sources/:id" component={Source} />
    <Route exact path="/persons" component={Persons} />
    <Route exact path="/persons/:id" component={Person} />
    <Route exact path="/publishers" component={Publishers} />
    <Route exact path="/publishers/:id" component={Publisher} />
    <Route exact path="/labels" component={Labels} />
    <Route exact path="/labels/:id" component={Label} />
    <Route render={() => <h1>Page not found</h1>} />
  </Switch>
);

export default AppRoutes;
