import { cond, stubTrue, noop }from 'lodash/fp'
import thumbnailMocks from 'thumbnails'

const mocks = [ ...thumbnailMocks ]

const getMock = cond([
    ...mocks,
    [stubTrue, noop]
]) 

export default getMock