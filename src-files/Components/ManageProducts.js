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
import { useState } from "react";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";
import { addCart, addProduct, deleteProduct } from "../Features/ProductSlice";
import { productSchemaValidation } from "../Validations/ProductValidations";
import { Link, useParams } from "react-router-dom";

const ManageProdutcs = () => {
  const products = useSelector((state) => state.products.value);
  const dispatch = useDispatch();

  //Create the state variables
  const [id, setProductName] = useState(0);
  const [price, setPrice] = useState(0);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  //For form validation using react-hook-form
  const {
    register,
    handleSubmit, // Submit the form when this is called
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchemaValidation), //Associate your Yup validation schema using the resolver
  });

  // Handle form submission
  const onSubmit = (data) => {
    try {
      // You can handle the form submission here
      let tax = 0;
      if (data.price >= 200 && data.price <= 500) {
        tax = data.price * 10;
      } else if (data.price > 501 && data.price <= 1000) {
        tax = data.price * 20;
      } else if(data.price>1000){
        tax = data.price * 0.20;
      }else{
        tax = 0;
      }

      const productData = {
        id: data.id,
        title: data.title,
        price: data.price + tax,
        images: data.image,
      };

      console.log("Form Data", data);
      alert("Validation all good.");
      dispatch(addProduct(productData));
    } catch (error) {
      console.log("Error.");
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

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
                  placeholder="Product id..."
                  {...register("id", {
                    onChange: (e) => setProductName(e.target.value),
                  })}
                />

                <p className="error">{errors.id?.message}</p>
              </div>
              <div className="form-group">
                <input
                  type="title"
                  className="form-control"
                  id="title"
                  placeholder="Title..."
                  {...register("title", {
                    onChange: (e) => setTitle(e.target.value),
                  })}
                />
                <p className="error">{errors.title?.message}</p>
              </div>
              <div className="form-group">
                <input
                  type="text"
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
                <p className="error">{errors.price?.message}</p>
              </div>
              <Button color="primary" className="button">
                Save Product
              </Button>
            </section>
          </form>
        </Col>
        <Col md={8}>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <img
                      src={product.images}
                      alt={product.title}
                      className="img-small"
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>{Math.round(product.price, 2)}</td>
                  <td>
                    <Button
                      color="danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </td>
                  <td>
                    <Link to={`/update/${product.id}`}>
                      <Button color="primary">Update</Button>
                    </Link>
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

export default ManageProdutcs;
