import React, { useState, useEffect } from "react";
import classes from "./App.module.css";
import AddProduct from "./components/AddProduct";
import Header from "./components/Header";
import ProductsHolder from "./components/ProductsHolder";
import Button from "./components/UI/Button";

const App = (props) => {
    const [formDisplay, setFormDisplay] = useState(0);
    const [productData, setProductData] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [isEdit, setIsEdit] = useState(0);
    const [searchState, setSearchState] = useState({
        developers: "",
        scrummastername: "",
    });

    useEffect(() => {
        const searchQueryString =
            "?" + new URLSearchParams(searchState).toString();

        fetch("http://localhost:8000/api/products" + searchQueryString)
            .then((response) => response.json())
            .then((json) => {
                if (json.errors) {
                    console.log(json.errors);
                }
                if (json.status === "Success") {
                    setProductData(json.products);
                }
            })
            .catch((error) => console.error(error));
    }, [searchState]);

    const formCloseHandler = () => {
        setFormDisplay(0);
    };

    const addProductHandler = (data) => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        };

        fetch("http://localhost:8000/api/products", requestOptions)
            .then((response) => response.json())
            .then((json) => {
                if (json.errors) {
                    console.log(json.errors);
                }
                if (json.status === "Success") {
                    setProductData(json.products);
                }
            })
            .catch((error) => console.error(error));
    };

    const editProductHandler = (data) => {
        if (data.productId) {
            if (typeof data.developers === "object") {
                data.developers = data.developers.join(", ");
            }
            const requestOptions = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(data),
            };
            const path = "http://localhost:8000/api/products/" + data.productId;
            fetch(path, requestOptions)
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    if (json.errors) {
                        console.log(json.errors);
                    }
                    if (json.status === "Success") {
                        setFormDisplay(0);
                        setProductData(json.products);
                        setIsEdit(1);
                        setEditProduct(null);
                    }
                })
                .catch((error) => console.error(error));
        }
    };

    const formVisibilityHandler = () => {
        setIsEdit(0);
        setFormDisplay(1);
        setEditProduct(null);
    };

    const onEditHandler = (data) => {
        // Scroll to Form
        const formElement = document.getElementById("form-element");
        let position = formElement.getBoundingClientRect();
        window.scrollTo(position.left, position.top + window.scrollY - 180);
        setFormDisplay(0);
        setEditProduct(data);
        setIsEdit(1);
        setFormDisplay(1);
    };

    const handleSearchChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setSearchState((prevState) => {
            return {
                ...searchState,
                [name]: value,
            };
        });
    };

    return (
        <div className={classes.App}>
            <Header />
            <div className={classes.pullright}>
                <Button onClick={formVisibilityHandler}>Add Product</Button>
            </div>
            <div id="form-element">
                {formDisplay === 1 && (
                    <AddProduct
                        onFormClose={formCloseHandler}
                        onAddProduct={addProductHandler}
                        onEditProduct={editProductHandler}
                        editProduct={editProduct}
                        isEdit={isEdit}
                    />
                )}
            </div>
            <form id="search-element" className={classes.formflex}>
                <div>
                    <label htmlFor="devSearch">Scrum Master Search</label>
                    <input
                        type="text"
                        name="scrummastername"
                        value={searchState.scrummastername}
                        onChange={handleSearchChange}
                    />
                </div>
                <div>
                    <label htmlFor="devSearch">Developer Search</label>
                    <input
                        type="text"
                        name="developers"
                        value={searchState.developers}
                        onChange={handleSearchChange}
                    />
                </div>
            </form>
            <p className={classes.totalsHolder}>
                <b>{productData.length}</b> Products Retrieved
            </p>
            <ProductsHolder onEdit={onEditHandler} products={productData} />
        </div>
    );
};

export default App;
