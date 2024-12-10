import { createSlice } from "@reduxjs/toolkit";
import { ProductsData } from "../ProductsData";

//const initialState = { value: [] }; //list of cart is an object with empty array as initial value
const initialState = { value: ProductsData }; //Assign the data from the exampleData

export const productSlice = createSlice({
  name: "products", //name of the state
  initialState, // initial value of the state
  reducers: {
    addProduct: (state, action) => {
      //state is the current value of the state, action is triggered outside the reducer and provides a value as payload
      state.value.push(action.payload); //the payload is the value coming from the component, add the payload to the state
    },
    deleteProduct: (state, action) => {
      //create a new array with the value that excludes the cart with the email value from the action payload, and assign the new array to the state.
      state.value = state.value.filter((cart) => cart.id !== action.payload);
    },
    updateProduct: (state, action) => {
      state.value.map((product) => {
        //iterate the  array and compare the email with the email from the payload
        if (product.id === action.payload.id) {
          product.title = action.payload.title;
          product.price = action.payload.price;
        }
      });
    },
  },
});

export const { addProduct, deleteProduct, updateProduct } = productSlice.actions; //export the function

export default productSlice.reducer;
