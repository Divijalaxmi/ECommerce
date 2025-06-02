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

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300+1; index++) {
    cart[index] = 0; // Initialize each product's quantity to 0
  }
  return cart;
};

const ShopContextProvider = (props) => {

  const [all_product,setAll_Product] = useState([]);
  
  // Get cart data from localStorage if available
  const savedCart = JSON.parse(localStorage.getItem('cartItems'));
  const [cartItems, setCartItems] = useState(savedCart || getDefaultCart());
  // const [all_product, setAll_Products] = useState([]);
  // const [cartItems, setCartItems] = useState(() => {
  //   try {
  //     const savedCart = JSON.parse(localStorage.getItem('cartItems'));
  //     return savedCart || getDefaultCart();
  //   } catch {
  //     return getDefaultCart();
  //   }
  // });



  useEffect(()=>{
    fetch('http://localhost:4000/allproducts')
    .then((response)=>response.json())
    .then((data)=>setAll_Product(data))

    if(localStorage.getItem('auth-token')){
      fetch('http://localhost:4000/getcart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',
        },
        body:"",
      }).then((response)=>response.json())
      .then((data)=>setCartItems(data));
    }
    else{
      setCartItems(getDefaultCart());
    }
  },[]);
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
    if(localStorage.getItem('auth-token')){
      fetch('http://localhost:4000/addtocart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',
        },
        body:JSON.stringify({"itemId":itemId}),
      })
      .then((response)=>response.json())
      .then((data)=>console.log(data));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 0) {
        updatedCart[itemId] = updatedCart[itemId] - 1;
      }
      return updatedCart;
    });
    if(localStorage.getItem('auth-token')){
      fetch('http://localhost:4000/removefromcart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',
        },
        body:JSON.stringify({"itemId":itemId}),
      })
      .then((response)=>response.json())
      .then((data)=>console.log(data));
    }
  };
  // const getTotalCartAmount = ()=>{
  //   let totalAmount = 0;
  //   for(const item in cartItems){
  //       if(cartItems[item]>0){
  //           let itemInfo = all_product.find((product)=>product.id===Number(item))
  //           totalAmount+=(itemInfo.new_price*cartItems[item])
  //       }
  //   }
  //   return totalAmount;
  // }
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const id in cartItems) {
      if (cartItems[id] > 0) {
        const product = all_product.find((product) => product.id === Number(id));
        if (product) {
          totalAmount += product.new_price * cartItems[id];
        } else {
          console.warn(`Product with id ${id} not found in all_product`);
        }
      }
    }
    return totalAmount;
  };
  
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