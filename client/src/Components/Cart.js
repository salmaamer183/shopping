import { Container, Row, Col, Button, Input, Card, Table } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { addToCart, deleteCartItem, getCart } from "../Features/CartSlice";
import { getProducts } from "../Features/ProductSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.users.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteCartItem(id));
  };

  const handleUpdate = (id) => {
    navigate("/update/" + id);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(getCart(user._id));
    }
  }, [user]);

  // Check if cart has items before rendering the table
  if (cart == null) {
    return (
      <Container>
        <p className="display-6">Cart</p>
        <p>Your cart is empty. Please add items to the cart.</p>
      </Container>
    );
  }

  return (
    <Container>
      <p className="display-6">Cart</p>
      <Row>
        <Col md={6}>
          <Table>
            <thead>
              <tr>
                <th>Product Code</th>
                <th>Image</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th colSpan={2}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((cart) => (
                <tr key={cart._id}>
                  <td>{cart.pcode}</td>
                  <td>
                    <img
                      src={cart.image}
                      alt={cart.desc}
                      className="img-small"
                    />
                  </td>
                  <td>{cart.desc}</td>
                  <td>{Math.round(cart.price, 2)}</td>
                  <td>{cart.quantity}</td>

                  <td>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this product?"
                          )
                        ) {
                          handleDelete(cart._id);
                        }
                      }}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleUpdate(cart._id)}
                      className="btn btn-primary"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
              {/* Calculate and display total price */}
              <tr>
                <td colSpan="4" className="text-end">
                  <strong>Total Price:</strong>
                </td>
                <td colSpan="3">
                  <strong>{Math.round(cart.totalPrice, 2)}</strong>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
