import "./App.css";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Home from "./Components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "reactstrap"; //import the Reactstrap Components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cart from "./Components/ManageProducts";
import ManageProducts from "./Components/ManageProducts";
import UpdateProduct from "./Components/UpdateProduct";

const App = () => {
  return (
    <Container fluid>
      <Router>
        <Row>
          <Header />
        </Row>
        <Row className="main">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/manage" element={<ManageProducts />}></Route>
            <Route path="/update/:prod_id" element={<UpdateProduct />}></Route>
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
