import React, { useEffect } from 'react';
import { Button } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import { fileTypes, physicalFile } from '../../../../helpers/utils';
import { JWPLAYER_ID } from '../../../../helpers/consts';

const Player = (props) => {
  const { file } = props;
  if (!file) {
    return null;
  }

  const types = fileTypes(file);
  useEffect(() => {
    const src = physicalFile(file, true);
    window.jwplayer(JWPLAYER_ID).setup({ file: src, preload: 'auto' });
  }, [file]);

  return (
    <div>
      {['audio', 'video'].includes(types.type) && <div id={JWPLAYER_ID} />}
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
