import React from 'react';
import { shallow, mount } from 'enzyme';
import { Column } from 'react-virtualized';
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

    it('searchs without crashing', () => {
        const search = (params = {}, isNewSearch = false, startIndex = 0, stopIndex = 10) => {
            return new Promise(resolve => {
                resolve(range(startIndex, stopIndex).map(index => ({ id: index })));
            });
        };

        let total = 0;
        let resultItems = [];

        const wrapper = mount(<InfiniteSearch columns={columns} resultItems={[]} params={{}} total={total} search={search} />);

        search().then(data => {
            resultItems.push(data);
            total = resultItems.length;
        });

        wrapper.setProps({ total, resultItems });


    });
});
