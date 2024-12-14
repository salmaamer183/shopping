import "./App.css";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Home from "./Components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "reactstrap"; //import the Reactstrap Components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ManageProducts from "./Components/ManageProducts";
import UpdateProduct from "./Components/UpdateProduct";
import Login from "./Components/Login";
import { useSelector } from "react-redux";
import Register from "./Components/Register";
import Cart from "./Components/Cart";

const App = () => {
  const email = useSelector((state) => state.users.user.email);

  return (
    <Container fluid>
      <Router>
        <Row>
          {email ? (
            <>
              <Header />
            </>
          ) : null}
        </Row>
        <Row className="main">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/manage" element={<ManageProducts />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/update/:prod_id" element={<UpdateProduct />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/cart" element={<Cart />}></Route>
          </Routes>
        </Row>
        <Row>
          <Footer />
        </Row>
      </Router>
    </Container>
  );
};

export default App;
