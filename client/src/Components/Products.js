import { Container, Row, Col, Button, Input, Card, Table } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { addToCart } from "../Features/CartSlice";
import { getProducts } from "../Features/ProductSlice";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const products = useSelector((state) => state.products.allProducts);
  const user = useSelector((state) => state.users.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Create the state variables

  const [quantity, setQuantity] = useState(0);

  //console.log(products);

  const handleAddtoCart = (productId) => {
    if (!quantity) {
      alert("Quantity is required!");
    } else {
      const cartData = {
        userId: user._id,
        productId: productId,
        quantity: quantity,
      };
      dispatch(addToCart(cartData));
      alert("Item added to cart.");
    }
  };

  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    } else {
      dispatch(getProducts());
    }
  }, [user]);
  return (
    <Container>
      <p className="display-6">Products</p>
      <Row>
        <Col md={6}>
          <Table>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.desc}
                      className="img-big" // Adjust size as needed
                    />
                  </td>
                  <td>
                    {product.desc}
                    <br />
                    <td>{Math.round(product.price, 2)} OMR</td>
                    <br />
                    <input
                      type="number"
                      className="qty_input"
                      required
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                    <Button
                      type="submit"
                      onClick={() => handleAddtoCart(product._id)}
                    >
                      Add to Cart
                    </Button>
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

export default Products;
