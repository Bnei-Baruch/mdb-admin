import React from "react";
import {Header, Image} from "semantic-ui-react";
import logo from "./KL_Tree_256.png";

const Welcome = () => {
    return <div>
        <br/>
        <Image src={logo} centered/>
        <br/>
        <Header textAlign="center" as="h2" content="Welcome to the BB Archive Admin!"/>
    </div>;
};

export default Welcome;
