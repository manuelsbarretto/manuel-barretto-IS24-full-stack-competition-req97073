import React, { useState, useEffect } from "react";

import classes from "./AddProduct.module.css";
import Button from "./UI/Button";
import Card from "./UI/Card";

let initialValues = {
    productName: "",
    productOwnerName: "",
    developers: "",
    scrumMasterName: "",
    startDate: "",
    methodology: "",
};

const AddProduct = (props) => {
    const initialFormValues =
        props.editProduct != null ? props.editProduct : initialValues;

    const [errorsList, setErrorsList] = useState([]);
    const [formValues, setFormValues] = useState(initialFormValues);
    const [formValid, setFormValid] = useState(0);

    useEffect(() => {
        setFormValues(initialFormValues);
    }, [props.editProduct]);

    const productHandler = (event) => {
        event.preventDefault();
        let validationErrors = validateField(formValues);
        if (validationErrors == 0) {
            if (props.editProduct != null) {
                props.onEditProduct(formValues);
            } else {
                props.onAddProduct(formValues);
            }
            setFormValues(initialFormValues);
        }
    };

    const errorHandler = () => {
        return 1;
    };

    const onChangeHandler = (event) => {
        setFormValues((prevState) => {
            return {
                ...prevState,
                [event.target.name]: event.target.value,
            };
        });
    };

    const validateField = (formValues) => {
        let fieldErrors = 0;

        for (const property in formValues) {
            if (formValues[property].length <= 0) {
                setErrorsList((prevState) => {
                    return {
                        ...prevState,
                        [property]: "Is Required",
                    };
                });
                fieldErrors += 1;
            } else {
                setErrorsList((prevState) => {
                    return {
                        ...prevState,
                        [property]: "",
                    };
                });
            }
        }

        fieldErrors == 0 ? setFormValid(1) : setFormValid(0);

        return fieldErrors;
    };

    const handleFormClose = (event) => {
        props.onFormClose();
    };

    return (
        <React.Fragment>
            <Card className={classes.input} id="formElement">
                <h2 className={classes.heading}>
                    {props.isEdit ? "Edit" : "Add"} Product
                </h2>
                <form onSubmit={productHandler}>
                    <div className={classes.flexer}>
                        <div>
                            <label htmlFor="productName">Product Name</label>
                            <input
                                type="text"
                                name="productName"
                                value={formValues.productName}
                                onChange={onChangeHandler}
                                className={`${
                                    errorsList["productName"] &&
                                    errorsList["productName"].length > 0
                                        ? classes.haserror
                                        : ""
                                }`}
                            />
                        </div>
                        <div>
                            <label htmlFor="productOwnerName">Owner</label>
                            <input
                                type="text"
                                name="productOwnerName"
                                value={formValues.productOwnerName}
                                onChange={onChangeHandler}
                                className={`${
                                    errorsList["productOwnerName"] &&
                                    errorsList["productOwnerName"].length > 0
                                        ? classes.haserror
                                        : ""
                                }`}
                            />
                        </div>
                        <div>
                            <label htmlFor="developers">Developers</label>
                            <input
                                type="text"
                                name="developers"
                                value={formValues.developers}
                                onChange={onChangeHandler}
                                className={`${
                                    errorsList["developers"] &&
                                    errorsList["developers"].length > 0
                                        ? classes.haserror
                                        : ""
                                }`}
                            />
                        </div>
                    </div>
                    <div className={classes.flexer}>
                        <div>
                            <label htmlFor="scrumMasterName">
                                Scrum Master
                            </label>
                            <input
                                type="text"
                                name="scrumMasterName"
                                value={formValues.scrumMasterName}
                                onChange={onChangeHandler}
                                className={`${
                                    errorsList["scrumMasterName"] &&
                                    errorsList["scrumMasterName"].length > 0
                                        ? classes.haserror
                                        : ""
                                }`}
                            />
                        </div>
                        {props.isEdit ? (
                            ""
                        ) : (
                            <div>
                                <label htmlFor="startDate">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formValues.startDate.replaceAll(
                                        "/",
                                        "-"
                                    )}
                                    onChange={onChangeHandler}
                                    className={`${
                                        errorsList["startDate"] &&
                                        errorsList["startDate"].length > 0
                                            ? classes.haserror
                                            : ""
                                    }`}
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="methodology">Methodology</label>
                            <select
                                name="methodology"
                                id="methodology"
                                onChange={onChangeHandler}
                                className={`${
                                    errorsList["methodology"] &&
                                    errorsList["methodology"].length > 0
                                        ? classes.haserror
                                        : ""
                                }`}
                                value={`${formValues.methodology}`}
                            >
                                <option value="">Select One</option>
                                <option value="Agile">Agile</option>
                                <option value="Waterfall">Waterfall</option>
                            </select>
                        </div>
                    </div>
                    <div className={classes.mildflex}>
                        <div className={classes.buttonHolder}>
                            <Button type="submit">
                                {props.isEdit ? "Edit" : "Add"} Product
                            </Button>
                        </div>
                        <div className={classes.buttonHolder}>
                            <Button onClick={handleFormClose}>Close</Button>
                        </div>
                    </div>
                </form>
            </Card>
        </React.Fragment>
    );
};

export default AddProduct;
