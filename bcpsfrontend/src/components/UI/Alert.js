import React from "react";

import classes from "./Alert.module.css";

const Alert = (props) => {
    return <div className={classes.alert}>{props.message}</div>;
};

export default Alert;
