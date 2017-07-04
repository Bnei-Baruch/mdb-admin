import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Column, Menu} from 'react-virtualized';
import { Grid, Header, Icon, Label, List, Menu, Modal, Segment } from 'semantic-ui-react';
import ContentTypeFilter from '../Filters/ContentTypeFilter';
import ContentSourceFilter from '../Filters/ContentSourceFilter';
import InfiniteSearch from '../InfiniteSearch/InfiniteSearch';
import apiClient from '../../helpers/apiClient';
import {CONTENT_TYPE_BY_ID, LANG_HEBREW, LANG_ENGLISH, LANG_RUSSIAN} from '../../helpers/consts';
import searcher from '../../hoc/searcher';

const InfiniteContentUnitSearcher = searcher({
    name: 'content_units',
    request: params => apiClient.get('/rest/content_units/', {params}),
    searchOnMount: true
})(InfiniteSearch);


const ItemLinkRenderer = ({cellData, dataKey}) =>
    <Link to={`/content_units/${cellData}`}>{cellData}</Link>;

const NameRenderer = (lang) => ({cellData}) => !!cellData && !!cellData[lang] && cellData[lang].name;

const FilmDateRenderer = ({cellData}) => !!cellData && cellData.film_date;

const ContentTypeRenderer = ({cellData}) => CONTENT_TYPE_BY_ID[cellData];

const IndexCellRenderer = ({rowIndex}) => rowIndex;

export const columns = [
    <Column key="index"
            label='Index'
            cellRenderer={IndexCellRenderer}
            dataKey='index'
            width={60}/>,
    <Column key="id"
            label='ID'
            dataKey='id'
            cellRenderer={ItemLinkRenderer}
            width={80}/>,
    <Column key="uid"
            label='UID'
            dataKey='uid'
            width={80}/>,
    <Column key="type"
            label='Type'
            dataKey='type_id'
            cellRenderer={ContentTypeRenderer}
            width={160}/>,
    <Column key="hebName"
            label='Heb Name'
            dataKey='i18n'
            width={80}
            cellRenderer={NameRenderer(LANG_HEBREW)}
            flexGrow={1}
            className="rtl-dir"/>,
    <Column key="enName"
            label='En Name'
            dataKey='i18n'
            width={80}
            cellRenderer={NameRenderer(LANG_ENGLISH)}
            flexGrow={1}/>,
    <Column key="ruName"
            label='Ru Name'
            dataKey='i18n'
            width={80}
            cellRenderer={NameRenderer(LANG_RUSSIAN)}
            flexGrow={1}/>,
    <Column key="filmDate"
            label='Film Date'
            dataKey='properties'
            cellRenderer={FilmDateRenderer}
            width={80}
            flexGrow={1}/>
];

const filters = [
    {
        name: 'content_type',
        label: 'Content Types',
        Filter: ContentTypeFilter
    }, {
        name: 'content_source',
        label: 'Content Sources',
        Filter: ContentSourceFilter
    }
];

export default class ContentUnits extends Component {

    showModal = () => this.setState({ modalOpen: true });
    hideModal = () => this.setState({ modalOpen: false });
    render() {
        return (
            <div>

                <Menu attached borderless size="large">
                    <Menu.Item header>
                        <Header content="Tags Hierarchy" size="medium" color="blue" />
                    </Menu.Item>
                    <Menu.Menu position="right">
                        <Menu.Item onClick={this.showModal}>
                            <Icon name="plus" />
                            New Root
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>

                <InfiniteContentUnitSearcher
                    columns={columns}
                    searchPlaceholder="Search content units..."
                    filters={filters}
                />

                <Modal
                    closeIcon
                    size="small"
                    open={modalOpen}
                    onClose={this.hideModal}
                >
                    <Modal.Header>Create New Root Tag</Modal.Header>
                    <Modal.Content>
                        <NewTagForm {...this.props} />
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}
