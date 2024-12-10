import { Container, Row, Col, Button, Input, Card, Table } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

const Products = () => {
  const products = useSelector((state) => state.products.value);
  const dispatch = useDispatch();

  //Create the state variables
  const [title, settitle] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  console.log(products);
  return (
    <Container>
      <p className="display-6">Products</p>
      <Row>
        <Col md={6}>
          <Table>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.images}
                      alt={product.title}
                      className="img-big" // Adjust size as needed
                    />
                  </td>
                  <td>
                    {product.title}
                    <br />
                    <td>{Math.round(product.price, 2)}</td>
                    <br />
                    <input type="number" className="qty_input" />
                    <Button>Add to Cart</Button>
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
