import React from 'react';
import { Route, Routes } from 'react-router-dom';

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
  <Routes >
    <Route path="/" element={<Welcome />} />
    <Route path="/files" element={<Files />} />
    <Route path="/files/:id" element={<File />} />
    <Route path="/content_units" element={<ContentUnits />} />
    <Route path="/content_units/:id" element={<ContentUnit />} />
    <Route path="/collections" element={<Collections />} />
    <Route path="/collections/:id" element={<Collection />} />
    <Route path="/operations" element={<Operations />} />
    <Route path="/operations/:id" element={<Operation />} />
    <Route path="/tags" element={<Tags />} />
    <Route path="/tags/:id" element={<Tag />} />
    <Route path="/sources" element={<Sources />} />
    <Route path="/sources/:id" element={<Source />} />
    <Route path="/persons" element={<Persons />} />
    <Route path="/persons/:id" element={<Person />} />
    <Route path="/publishers" element={<Publishers />} />
    <Route path="/publishers/:id" element={<Publisher />} />
    <Route path="/labels" element={<Labels />} />
    <Route path="/labels/:id" element={<Label />} />
    <Route path="*" element={<h1>Page not found</h1>} />
  </Routes>
);

export default AppRoutes;
