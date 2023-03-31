import React, { useState, useEffect } from "react";
import classes from "./App.module.css";
import AddProduct from "./components/AddProduct";
import Header from "./components/Header";
import ProductsHolder from "./components/ProductsHolder";
import Button from "./components/UI/Button";
import Alert from "./components/UI/Alert";

const App = (props) => {
    const [formDisplay, setFormDisplay] = useState(0);
    const [productData, setProductData] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [isEdit, setIsEdit] = useState(0);
    const [searchState, setSearchState] = useState({
        developers: "",
        scrummastername: "",
    });
    const [alertState, setAlertState] = useState({
        set: false,
        message: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setAlertState((prevState) => {
                return {
                    ...prevState,
                    set: false,
                };
            });
        }, 2000);
    }, [alertState]);

    useEffect(() => {
        const identifier = setTimeout(() => {
            setLoading(true);
            const searchQueryString =
                "?" + new URLSearchParams(searchState).toString();

            fetch("http://localhost:3000/api/products" + searchQueryString)
                .then((response) => response.json())
                .then((json) => {
                    if (json.errors) {
                        console.log(json.errors);
                    }
                    if (json.status === "Success") {
                        setProductData(json.products);
                        setAlertState((prevState) => {
                            return {
                                ...prevState,
                                set: true,
                                message: json.message,
                            };
                        });
                    }
                    setLoading(false);
                })
                .catch((error) => console.error(error));
        }, 500);

        return () => {
            clearTimeout(identifier);
        };
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

        setLoading(true);
        fetch("http://localhost:3000/api/products", requestOptions)
            .then((response) => response.json())
            .then((json) => {
                if (json.errors) {
                    console.log(json.errors);
                }
                if (json.status === "Success") {
                    setProductData(json.products);
                    setAlertState((prevState) => {
                        return {
                            ...prevState,
                            set: true,
                            message: json.message,
                        };
                    });
                }
                setLoading(false);
            })
            .catch((error) => console.error(error));
    };

    const editProductHandler = (data) => {
        if (data.productId) {
            if (typeof data.developers === "object") {
                console.log(data.developers);
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
            const path = "http://localhost:3000/api/products/" + data.productId;
            setLoading(true);
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
                        setAlertState((prevState) => {
                            return {
                                ...prevState,
                                set: true,
                                message: json.message,
                            };
                        });
                    }
                    setLoading(false);
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
                ...prevState,
                [name]: value,
            };
        });
    };

    const Loader = () => (
        <div className={classes.divLoader}>
            <svg
                className={classes.svgLoader}
                viewBox="0 0 100 100"
                width="10em"
                height="10em"
            >
                <path
                    stroke="none"
                    d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
                    fill="#51CACC"
                    transform="rotate(179.719 50 51)"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        calcMode="linear"
                        values="0 50 51;360 50 51"
                        keyTimes="0;1"
                        dur="1s"
                        begin="0s"
                        repeatCount="indefinite"
                    ></animateTransform>
                </path>
            </svg>
        </div>
    );

    return (
        <div className={classes.App}>
            {loading ? <Loader /> : null}
            <Header />
            {alertState.set ? <Alert message={alertState.message} /> : null}

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
