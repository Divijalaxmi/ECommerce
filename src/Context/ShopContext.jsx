// import React, { createContext } from 'react'
// export const ShopContext = createContext(null);
// import all_product from '../Components/Assets/all_product';
// import { useState } from 'react';
// const getDefaultCart = ()=>{
//     let cart={};
//     for (let index = 0; index < all_product.length+1; index++) {
//         cart[index] = 0;
        
//     }
//     return cart;
// }

// const ShopContextProvider = (props) => {
    
//     const [cartItems, setCartItems] = useState(getDefaultCart());

//     const addToCart = (itemId) => {
//         setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
//         console.log(cartItems);
//     }
//     const removeFromCart = (itemId)=>{
//         setCartItems((prev)=>({
//             ...prev,[itemId]:prev[itemId]-1
//         }))
//     }
//     const contextValue={all_product,cartItems,addToCart,removeFromCart};
//     return(
//         <ShopContext.Provider value={contextValue} >{props.children}</ShopContext.Provider>
//     )
// }

// export default ShopContextProvider
import React, { createContext, useState, useEffect } from 'react';
import all_product from '../Components/Assets/all_product.js';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < all_product.length; index++) {
    cart[index] = 0; // Initialize each product's quantity to 0
  }
  return cart;
};

const ShopContextProvider = (props) => {
  // Get cart data from localStorage if available
  const savedCart = JSON.parse(localStorage.getItem('cartItems'));
  const [cartItems, setCartItems] = useState(savedCart || getDefaultCart());

  // Update cartItems in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      updatedCart[itemId] = updatedCart[itemId] + 1;
      return updatedCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 0) {
        updatedCart[itemId] = updatedCart[itemId] - 1;
      }
      return updatedCart;
    });
  };
  const getTotalCartAmount = ()=>{
    let totalAmount = 0;
    for(const item in cartItems){
        if(cartItems[item]>0){
            let itemInfo = all_product.find((product)=>product.id===Number(item))
            totalAmount+=(itemInfo.new_price*cartItems[item])
        }
    }
    return totalAmount;
  }
  const getTotalCartItems = ()=>{
    let totalItem = 0;
    for(const item in cartItems){
        if(cartItems[item]>0){
            totalItem+=cartItems[item];
        }
    }
    return totalItem;
  }
  const contextValue = { getTotalCartItems,getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;