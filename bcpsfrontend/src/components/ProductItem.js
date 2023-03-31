import React from "react";
import Button from "./UI/Button";

import classes from "./ProductItem.module.css";

const ProductItem = (props) => {
    const editHandler = (event) => {
        props.onEdit(props.product);
    };

    return (
        <tr>
            <td>{props.product.productId}</td>
            <td>{props.product.productName}</td>
            <td>{props.product.productOwnerName}</td>
            <td>{props.product.developers.join(", ")}</td>
            <td>{props.product.scrumMasterName}</td>
            <td>{props.product.startDate}</td>
            <td>{props.product.methodology}</td>
            <td className={classes.center}>
                <Button id={props.product.productId} onClick={editHandler}>
                    Edit
                </Button>
            </td>
        </tr>
    );
};

export default ProductItem;
