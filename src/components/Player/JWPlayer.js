import React from "react";
import JWPlayer from "react-jw-player";

const Player = props => {
    const playerId = Math.random().toString(36);
    return <JWPlayer
        playerId={playerId} // bring in the randomly generated playerId
        playerScript='https://content.jwplatform.com/libraries/bgQiNcsk.js'
        {...props}
    />
};

export default Player;
