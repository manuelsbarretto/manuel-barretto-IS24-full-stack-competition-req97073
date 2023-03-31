import React from "react";

import classes from "./Button.module.css";

const Button = (props) => {
    return (
        <button
            className={classes.button}
            type={props.type || "button"}
            onClick={props.onClick}
            id={props.id || null}
        >
            {props.children}
        </button>
    );
};

export default Button;
