import React from 'react';
import { Button } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import JWPlayer from '../../../shared/JWPlayer';
import { fileTypes, physicalFile } from '../../../../helpers/utils';

const Player = (props) => {
  const { file } = props;
  if (!file) {
    return null;
  }

  const types = fileTypes(file);

  return (
    <div>
      {
        ['audio', 'video'].includes(types.type) ?
          <JWPlayer playerId="file-details" file={physicalFile(file, true)} isAutoPlay={false}/> :
          null
      }
      <br />
      <Button
        content="Download"
        icon="download"
        color="orange"
        onClick={() => window.open(physicalFile(file), '_blank')}
      />
    </div>
  );
};

Player.propTypes = {
  file: shapes.File,
};

Player.defaultProps = {
  file: null,
};

export default Player;
