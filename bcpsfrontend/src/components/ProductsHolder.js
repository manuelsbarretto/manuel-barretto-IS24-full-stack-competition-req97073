import React from "react";

import classes from "./ProductsHolder.module.css";
import ProductItem from "./ProductItem";

const ProductsHolder = (props) => {
    return (
        <div className={classes.container}>
            <table data-table-theme="default zebra">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Project Name</th>
                        <th>Owner</th>
                        <th>Developers</th>
                        <th>Scrummaster</th>
                        <th>Start Date</th>
                        <th>Methodology</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {props.products.map((product) => (
                        <ProductItem
                            product={product}
                            key={product.productId}
                            onEdit={props.onEdit}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsHolder;
