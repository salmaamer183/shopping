import Shop from "./Products";
import { Container, Row, Col } from "reactstrap"; //import the Reactstrap Components
import { useSelector, useDispatch } from "react-redux";
import Products from "./Products";
import banner from "../Images/banner.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const user = useSelector((state) => state.users.user); //from Redux Store
  const email = useSelector((state) => state.users.user.email);
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email]);
  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          {/*<img src="https://placehold.co/1400x300/png" className="banner" />*/}
          <img src={banner} className="banner" />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Products />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
