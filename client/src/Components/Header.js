import { Navbar, Nav, NavItem, NavLink } from "reactstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { persistore } from "../Store/store";
import { resetStore } from "../Store/store";
import { logout } from "../Features/UserSlice";

const Header = () => {
  const user = useSelector((state) => state.users.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlelogout = async () => {
    resetStore(); // Reset the store when logging out
    persistore.purge();
    dispatch(logout());
    //ensure that the state update from the logout action has been processed before proceeding to the next step.
    await new Promise((resolve) => setTimeout(resolve, 100));

    navigate("/"); //redirect to login page route.
  };

  return (
    <>
      <Navbar className="header">
        <Nav className="nav">
          <NavItem className="nav-item">
            <Link className="nav-link">Shopping Cart</Link>
          </NavItem>
          <NavItem className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </NavItem>
          {user.userType === "admin" && (
            <NavItem className="nav-item">
              <Link to="/manage" className="nav-link">
                Manage Products
              </Link>
            </NavItem>
          )}
          <NavItem className="nav-item">
            <Link to="/cart" className="nav-link">
              Cart
            </Link>
          </NavItem>
          <NavItem className="nav-item">
            <Link onClick={handlelogout} className="nav-link">
              Logout
            </Link>
          </NavItem>
        </Nav>
      </Navbar>
    </>
  );
};

export default Header;
