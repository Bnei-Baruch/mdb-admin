const thumbnail = {
    url: 'https://kabbalahmedia.info/assets/api/thumbnail/YTYQZPs0',
    filename: 'YTYQZPs0'
};

const candidates = [
    {
        url: 'https://kabbalahmedia.info/assets/api/thumbnail/GZkrNgfO',
        filename: 'GZkrNgfO'
    },
    {
        url: 'https://kabbalahmedia.info/assets/api/thumbnail/YTYQZPs0',
        filename: 'YTYQZPs0'
    },
    {
        url: 'https://kabbalahmedia.info/assets/api/thumbnail/2KXiyQpL',
        filename: '2KXiyQpL'
    },
    {
        url: 'https://kabbalahmedia.info/assets/api/thumbnail/Cl7em6k8',
        filename: 'Cl7em6k8'
    },
    {
        url: 'https://kabbalahmedia.info/assets/api/thumbnail/LJZMXGRv',
        filename: 'LJZMXGRv'
    },
    {
        url: 'https://kabbalahmedia.info/assets/api/thumbnail/lDmPBUcE',
        filename: 'lDmPBUcE'
    },
];

const thumbnailPathRegExp = new RegExp('^/thumbnail/[^\/]*')
const isFetchThumbnail = (op, url) => op === 'get' && url.startsWith('/thumbnail');
const fetchThumbnailMock = (op, url) => thumbnail

const isSetThumbnail = (op, url) => op === 'post' && url.startsWith('/thumbnail');
const setThumbnailMock = (op, url, body) => body

const isFetchThumbnailCandidates = (op, url) => op === 'get' && url.startsWith('/thumbnail/candidates')
const fetchThumbnailCandidates = (op, url, body) => candidates

export default [
    [isSetThumbnail, setThumbnailMock],
    [isFetchThumbnail, fetchThumbnailMock],
    [isFetchThumbnailCandidates, fetchThumbnailCandidates],
]
