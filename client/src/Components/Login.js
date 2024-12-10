import {
  Form,
  Input,
  FormGroup,
  Label,
  Container,
  Button,
  Col,
  Row,
} from "reactstrap";

/* import logo from "../Images/logo-t.png";
 */ import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../Features/UserSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Login = () => {
  const [email, setemail] = useState();
  const [password, setpassword] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Retrieve the current value of the state from the store, name of state is users with a property user
  const user = useSelector((state) => state.users.user);
  const isSuccess = useSelector((state) => state.users.isSuccess);
  const isError = useSelector((state) => state.users.isError);

  const handleLogin = () => {
    const userData = {
      email: email,
      password: password,
    };
    dispatch(login(userData));
  };

  useEffect(() => {
    if (isError) {
      navigate("/");
    } else if (isSuccess) {
      if (user && user.userType === "user") {
        navigate("/");
      } else {
        navigate("/manage");
      }
    }
  }, [user, isError, isSuccess, navigate]);

  return (
    <div>
      <Container fluid>
        <Row>
          <Col md={4} className="center">
            {/* <img src={logo} /> */}
            <h2>Jasmine's Online Shop</h2>
          </Col>
        </Row>
        <Form>
          <Row>
            <Col md={4} className="center">
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter email..."
                  type="email"
                  onChange={(e) => setemail(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="center">
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter password..."
                  type="password"
                  onChange={(e) => setpassword(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="center">
              <Button onClick={() => handleLogin()} className="button">
                Login
              </Button>
              <p className="smalltext">
                No Account? <Link to="/register">Sign Up now.</Link>
              </p>
            </Col>
          </Row>
        </Form>
        <Row>
          <Footer />
        </Row>
      </Container>
    </div>
  );
};

export default Login;
