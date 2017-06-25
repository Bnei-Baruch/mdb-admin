import React from 'react';
import PropTypes from 'prop-types';
import JWPlayer from 'react-jw-player';

const Player = props => (
  <JWPlayer
    playerId={props.playerId}
    playerScript="https://content.jwplatform.com/libraries/bgQiNcsk.js"
    {...props}
  />
);

Player.propTypes = {
  playerId: PropTypes.string.isRequired,
};

export default Player;
