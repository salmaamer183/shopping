import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Container,
  Row,
  Col,
  Table,
} from "reactstrap";
import { useEffect, useState } from "react";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../Features/ProductSlice";
import { productSchemaValidation } from "../Validations/ProductValidations";
import { Link, useParams, useNavigate } from "react-router-dom";

const ManageProducts = () => {
  const user = useSelector((state) => state.users.user);
  const products = useSelector((state) => state.products.allProducts);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(user);
  //Create the state variables
  const [pcode, setPcode] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [stocks, setStocks] = useState(0);
  //For form validation using react-hook-form
  const {
    register,
    handleSubmit, // Submit the form when this is called
    formState: { errors, reset },
  } = useForm({
    resolver: yupResolver(productSchemaValidation), //Associate your Yup validation schema using the resolver
  });
  // console.log("Validation Errors", errors);

  // Handle form submission
  const onSubmit = (data) => {
    try {
      // You can handle the form submission here
      let tax = 0;
      if (data.price >= 200 && data.price <= 500) {
        tax = data.price * 0.1;
      } else if (data.price > 501 && data.price <= 1000) {
        tax = data.price * 0.2;
      } else if (data.price > 1000) {
        tax = data.price * 0.5;
      } else {
        tax = 0;
      }

      const productData = {
        pcode: data.pcode,
        desc: data.desc,
        price: data.price + tax,
        image: data.image,
        stocks: data.stocks,
      };

      console.log("Form Data", data);
      dispatch(addProduct(productData));
      alert("Product Added.");
    } catch (error) {
      console.log("Error.");
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  const handleUpdate = (id) => {
    navigate("/update/" + id);
  };

  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    } else {
      dispatch(getProducts()); // Dispatch getProducts action
    }
  }, [user, dispatch, navigate]);
  return (
    <Container fluid>
      <Row>
        <Col md={12} className="adminPage">
          <img src=""></img>
          <p className="display-6">Admin Page</p>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <h4>Add Product</h4>

          {/* Execute first the submitForm function and if validation is good execute the handleSubmit function */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div></div>
            <section>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Product Code..."
                  {...register("pcode", {
                    onChange: (e) => setPcode(e.target.value),
                  })}
                />

                <p className="error">{errors.pcode?.message}</p>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="desc"
                  placeholder="Product Description..."
                  {...register("desc", {
                    onChange: (e) => setDesc(e.target.value),
                  })}
                />
                <p className="error">{errors.desc?.message}</p>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  placeholder="Price..."
                  {...register("price", {
                    onChange: (e) => setPrice(e.target.value),
                  })}
                />
                <p className="error">{errors.price?.message}</p>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="image"
                  placeholder="Image URL..."
                  {...register("image", {
                    onChange: (e) => setImage(e.target.value),
                  })}
                />
                <p className="error">{errors.image?.message}</p>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="form-control"
                  id="stock"
                  placeholder="Number of stocks..."
                  {...register("stocks", {
                    onChange: (e) => setStocks(e.target.value),
                  })}
                />
                <p className="error">{errors.stocks?.message}</p>
              </div>
              <Button color="primary" className="button btn" type="submit">
                Save Product
              </Button>
              <Button color="info" className="button clear" type="reset">
                Ckear
              </Button>
            </section>
          </form>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Code</th>
                <th>Image</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stocks</th>

                <th colSpan={2}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.pcode}</td>
                  <td>
                    <img
                      src={product.image}
                      alt={product.desc}
                      className="img-small"
                    />
                  </td>
                  <td>{product.desc}</td>
                  <td>{Math.round(product.price, 2)}</td>
                  <td>{product.stocks}</td>
                  <td>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this product?"
                          )
                        ) {
                          handleDelete(product._id);
                        }
                      }}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleUpdate(product._id)}
                      className="btn btn-primary"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ManageProducts;
