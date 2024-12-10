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
import {
  updateProduct,
} from "../Features/ProductSlice";
import { productSchemaValidation } from "../Validations/ProductValidations";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const products = useSelector((state) => state.products.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { prod_id } = useParams();

  // Function to search for a product by ID
  const  findProductById= (productId) => {
    return products.find((product) => product.id == productId);
  }
  //This is the product object that is to be updated as return by the find
  const productToUpdate = findProductById(prod_id);

  console.log(productToUpdate);
  //Set the value from the productoupdate object as initial value of the state
  const [id, setProductName] = useState(productToUpdate.id);
  const [price, setPrice] = useState(productToUpdate.price);
  const [title, setTitle] = useState(productToUpdate.title);
  const [image, setImage] = useState(productToUpdate.images);
  //For form validation using react-hook-form
  const {
    register,
    handleSubmit, // Submit the form when this is called
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchemaValidation), //Associate your Yup validation schema using the resolver
  });

  // Handle form submission
  const handleUpdate = (data) => {
    try {
      // You can handle the form submission here
      let tax = 0;
      if (data.price<200){
        tax = 0;
      }
      else if (data.price >= 200 && data.price <= 500) {
        tax = data.price * 10;
      } else if (data.price > 501 && data.price <= 1000) {
        tax = data.price * 20;
      } else {
        tax = data.price * 0.25;
      }

      const productData = {
        id: data.id,
        title: data.title,
        price: data.price + tax,
        images: data.image,
      };

      console.log("Form Data", data);
      alert("Product Updated.");
      dispatch(updateProduct(productData));
      navigate("/manage"); //redirect to the /manage route
    } catch (error) {
      console.log("Error.");
    }
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
          <h4>Update Product</h4>

          {/* Execute first the submitForm function and if validation is good execute the handleSubmit function */}
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div></div>
            <section>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Product id..."
                  value={id}
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
                  value={title}
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
                  value={price}
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
                  value={image}
                  {...register("image", {
                    onChange: (e) => setImage(e.target.value),
                  })}
                />
                <p className="error">{errors.price?.message}</p>
              </div>
              <Button color="primary" className="button">
                Update Product
              </Button>
            </section>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateProduct;
