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
import { updateProduct } from "../Features/ProductSlice";
import { productSchemaValidation } from "../Validations/ProductValidations";
import { createRoutesFromChildren, Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const products = useSelector((state) => state.products.allProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { prod_id } = useParams();
  console.log(prod_id);

  // Function to search for a product by ID
  const findProductById = (prod_id) => {
    return products.find((product) => product._id == prod_id);
  };
  //This is the product object that is to be updated as return by the find
  const productToUpdate = findProductById(prod_id);

  console.log(productToUpdate);
  //Set the value from the productoupdate object as initial value of the state
  const [pcode, setPcode] = useState(productToUpdate.pcode);
  const [desc, setDesc] = useState(productToUpdate.desc);
  const [price, setPrice] = useState(productToUpdate.price);
  const [image, setImage] = useState(productToUpdate.image);
  const [stocks, setStocks] = useState(productToUpdate.stocks);

  //For form validation using react-hook-form
  const {
    register,
    handleSubmit, // Submit the form when this is called
    formState: { errors },
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
      dispatch(updateProduct({ productData, prod_id }));
      alert("Product Updated.");
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div></div>
            <section>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Product Code..."
                  value={pcode}
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
                  value={desc}
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
                  value={price}
                  {...register("price", {
                    onChange: (e) => setPrice(e.target.value),
                  })}
                />
                <p className="error">{errors.price?.message}</p>
              </div>
              <div className="form-group">
                <img src={image} className="userImage center" alt="User" />

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
                <p className="error">{errors.image?.message}</p>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="form-control"
                  id="stock"
                  placeholder="Number of stocks..."
                  value={stocks}
                  {...register("stocks", {
                    onChange: (e) => setStocks(e.target.value),
                  })}
                />
                <p className="error">{errors.stocks?.message}</p>
              </div>
              <Button color="primary" className="button" type="submit">
                Save Product
              </Button>
            </section>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateProduct;
