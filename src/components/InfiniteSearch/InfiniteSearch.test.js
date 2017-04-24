import React from 'react';
import { shallow, mount } from 'enzyme';
import { Column, Table } from 'react-virtualized';
import range from 'lodash/range';
import InfiniteSearch from './InfiniteSearch';

const columns = [
    <Column key="index"
            label='Index'
            cellRenderer={({rowIndex}) => rowIndex}
            dataKey='index'
            width={60} />
];

describe('basic', () => {
    it('shallow renders without crashing', () => {
        shallow(<InfiniteSearch columns={columns} resultItems={[]} params={{}} total={0} search={() => {}} />);
    });

    it('mounts without crashing', () => {
        mount(<InfiniteSearch columns={columns} resultItems={[]} params={{}} total={0} search={() => {}} />);
    });
});
