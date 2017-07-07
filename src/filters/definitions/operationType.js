import { createFilterDefinition } from './util';

const operationType = {
  name: 'operation_type',
  valueToApiParam: value => ({ operation_type: value }),
};

export default createFilterDefinition(operationType);
