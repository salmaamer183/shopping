import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import PostModel from "./Models/ProductModel.js";
import bcrypt from "bcrypt";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import * as ENV from "./config.js";
import ProductModel from "./Models/ProductModel.js";
import CartModel from "./Models/CartModel.js";

const app = express();
app.use(express.json());

//Middleware
const corsOptions = {
  origin: ENV.CLIENT_URL, //client URL local
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

const connectString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_CLUSTER}/${ENV.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(connectString);

// Serve static files from the 'uploads' directory

// Convert the URL of the current module to a file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name from the current file path
const __dirname = dirname(__filename);

// Set up middleware to serve static files from the 'uploads' directory
// Requests to '/uploads' will serve files from the local 'uploads' folder
app.use("/uploads", express.static(__dirname + "/uploads"));

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
// Create multer instance
const upload = multer({ storage: storage });

app.post("/registerUser", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const hashedpassword = await bcrypt.hash(password, 10);

    const product = new UserModel({
      name: name,
      email: email,
      password: hashedpassword,
    });

    await product.save();
    res.send({ product: product, msg: "Added." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//POST API-login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; //using destructuring
    //search the product
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(500).json({ error: "User not found." });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    //if everything is ok, send the product and message
    res.status(200).json({ user, message: "Success." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST API-logout
app.post("/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

//POST API - add Product
app.post("/addProduct", async (req, res) => {
  try {
    const pcode = req.body.pcode;
    const desc = req.body.desc;
    const price = req.body.price;
    const image = req.body.image;
    const stocks = req.body.stocks;

    const product = new PostModel({
      pcode: pcode,
      desc: desc,
      price: price,
      image: image,
      stocks: stocks,
    });

    await product.save();
    res.send({ product: product, msg: "Added." }); //send to the client the JSON object
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//GET API - getProducts
app.get("/getProducts", async (req, res) => {
  try {
    const products = await ProductModel.find({}).sort({ pcode: 1 });

    const countProducts = await ProductModel.countDocuments({});

    res.send({ products: products, count: countProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.put(
  "/updateUserProfile/:email/",
  upload.single("profilePic"), // Middleware to handle single file upload
  async (req, res) => {
    const email = req.params.email;
    const name = req.body.name;
    const password = req.body.password;
    const userType = req.body.userType;

    console.log(req.body);
    try {
      // Find the product by email in the database
      const productToUpdate = await UserModel.findOne({ email: email });

      // If the product is not found, return a 404 error
      if (!productToUpdate) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if a file was uploaded and get the filename
      let profilePic = null;
      if (req.file) {
        profilePic = req.file.filename; // Filename of uploaded file
        // Update profile picture if a new one was uploaded but delete first the old image
        if (productToUpdate.profilePic) {
          const oldFilePath = path.join(
            __dirname,
            "uploads",
            productToUpdate.profilePic
          );
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log("Old file deleted successfully");
            }
          });
          productToUpdate.profilePic = profilePic; // Set new profile picture path
        }
      } else {
        console.log("No file uploaded");
      }

      // Update product's name
      productToUpdate.name = name;
      //if there is a value of userType in the request assign the new value
      if (userType) productToUpdate.userType = userType;

      // Hash the new password and update if it has changed
      if (password !== productToUpdate.password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        productToUpdate.password = hashedPassword;
      } else {
        productToUpdate.password = password; // Keep the same password if unchanged
      }

      // Save the updated product information to the database
      await productToUpdate.save();

      // Send the updated product data and a success message as a response
      res.send({ product: productToUpdate, msg: "Updated." });
    } catch (err) {
      // Handle any errors during the update process
      res.status(500).json({ error: err.message });
    }
  }
);
//GET API - getPost
app.get("/getUsers", async (req, res) => {
  try {
    // Fetch all users from the "UserModel" collection, sorted by createdAt in descending order
    const users = await UserModel.find({}).sort({ name: 1 });

    const userPost = await UserModel.countDocuments({});

    res.send({ users: users, count: userPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.delete("/deleteProduct/:id/", async (req, res) => {
  const id = req.params.id;

  try {
    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product" });
  }
});

//GET API - for retrieving a single product
app.get("/getProduct/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Find the product by _id
    const product = await ProductModel.findById(id);
    res.send({ product: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//POST API - add Product
app.put("/updateProduct/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const pcode = req.body.pcode;
    const desc = req.body.desc;
    const price = req.body.price;
    const image = req.body.image;
    const stocks = req.body.stocks;

    // Find the product by email in the database
    const productToUpdate = await ProductModel.findOne({ _id: id });

    // If the product is not found, return a 404 error
    if (!productToUpdate) {
      return res.status(404).json({ error: "Product not found" });
    }

    productToUpdate.pcode = pcode;
    productToUpdate.desc = desc;
    productToUpdate.price = price;
    productToUpdate.image = image;
    productToUpdate.stocks = stocks;

    await productToUpdate.save();
    res.send({ product: productToUpdate, msg: "Product Update." }); //send to the client the JSON object
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

/*CART APIS */

// Add item to cart
app.post("/addToCart", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    // Fetch product details
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(product);
    // Find or create cart for the user
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = new CartModel({ userId, items: [] });
    }

    // Check if the item already exists in the cart
    const existingItem = cart.items.find((item) =>
      item.productId.equals(productId)
    );
    if (existingItem) {
      // Update quantity and total
      existingItem.quantity += Number(quantity);
      existingItem.total = existingItem.quantity * product.price;
    } else {
      // Add new item to the cart
      cart.items.push({
        productId: product._id,
        pcode: product.pcode,
        desc: product.desc,
        price: product.price,
        image: product.image,
        quantity: quantity,
        total: product.price * quantity,
      });
    }

    // Save the updated cart
    await cart.save();
    res.status(200).json({ cart, message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//GET API - getCart
app.get("/getCart/:userId", async (req, res) => {
  const { userId } = req.params; // Get userId from route parameters

  try {
    const cart = await CartModel.findOne({ userId: userId });

    // Count the total number of items in the cart
    const itemCount = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    // Send the cart data along with the item count
    res.send({ cart: cart, count: itemCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.delete("/deleteCartItem/:id", async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the cart that contains the item
    const cart = await CartModel.findOne({ "items._id": itemId });

    if (!cart) {
      return res.status(404).json({ error: "Cart Item not found" });
    }

    // Find the item to be removed
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Cart Item not found in the cart" });
    }

    // Update the total price
    const item = cart.items[itemIndex];
    cart.totalPrice -= item.total;

    // Remove the item from the items array
    cart.items.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ msg: "Cart item deleted successfully", cart });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the cart item" });
  }
});

const port = ENV.PORT || 3001;

app.listen(port, () => {
  console.log(`You are connected at port: ${port}`);
});
