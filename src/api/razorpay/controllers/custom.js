'use strict';

const api_url = 'https://api.shriworkscraft.com';
const axios = require('axios');
const Razorpay = require('razorpay');
const { calculateDeliveryCharge } = require('../../../utils/deliveryUtils');
const { adjustOrDeleteCarts } = require('../../../utils/adjustOrDeleteCarts');

module.exports = {
  async payment(ctx) {
    try{
      const{paymentId} = ctx.request.params;
      console.log(ctx.state.user,'Jwt');
      if (!ctx.state.user) {
        return ctx.unauthorized('You must be logged in to view a movie');
      }
      const userId = ctx.state.user.id;
      console.log('User',userId);

      const instance = new Razorpay({
        key_id: 'rzp_test_A9JFjJag9kiyMe',
        key_secret: 'hZYfU73aWeT9JWBqnhs4z6eb'
    });
      const paymentDetails = await instance.payments.fetch(paymentId);
      console.log(paymentDetails);

      const { amount, method, status } = paymentDetails;

      const updatedAmount = Number(amount) / 100;
      const updatedStatus = (status === 'authorized') ? 'success' : status;

      if(status === 'authorized'){
        
        const payment = await strapi.entityService.create('api::transaction.transaction', {
          data: {
            PaymentId: paymentId,                               
            Amount: updatedAmount.toString(),
            Payment_Method: method,
            Status: updatedStatus,
            publishedAt: Date.now(),
            users_permissions_user: userId,
          }
        });
        let cartProducts=[];
	console.log(api_url,'api url');
        try{
          const user = await axios.get(`${api_url}/api/users/${userId}?populate[0]=carts.product`);
	  console.log(user.data,'user');
          cartProducts = user.data.carts.map(item => item);
          console.log('cart',cartProducts);
        }
        catch(err){
          console.log(err);
        }

        const postProductData = async (cart) => {
          try {
            console.log(cart,'consoling each cart');
            const response = await axios.post(`${api_url}/api/purchased-orders`, {
	      "data": {
   		 "product": cart.product.id,
    		 "users_permissions_user": userId,
    		 "Quantity": cart.Quantity
	      }
            });
	    const cartQuantity = Number(cart.Quantity);
            const productQuantity = Number(cart.product.AvailableQuantity);
  	    const updateProductQuantity = await axios.put(`${api_url}/api/products/${cart.product.id}`,{
              "data": {
                "AvailableQuantity": Number(cart.product.AvailableQuantity) - Number(cart.Quantity),
              }
            });
            console.log(updateProductQuantity.data,'quantity updated');   
              
              console.log('Success:', response.data);
              return response.data;
            } catch (error) {
              console.error('Error posting product:', error.message);
            }
          };
          if(Array.isArray(cartProducts) && cartProducts.length > 0){
            try {
              console.log('Working purcahse update');
              const results = await Promise.all(
                cartProducts.map(productId => postProductData(productId))
              );
              console.log('All products posted successfully', results);
            } catch (error) {
              console.error('Error posting all products:', error);
            };
          }
          else{
            return ctx.send('There is no cart');
          }

           try {
   	     const user = await axios.get(`${api_url}/api/users/${userId}?populate[0]=carts.product`);
             const cartProducts = user.data.carts.map(item => item);

             // Iterate through each cart product and adjust if needed
             for (const cartItem of cartProducts) {
              await adjustOrDeleteCarts(cartItem);
             }
           } catch (err) {
              console.error('Error fetching user carts:', err);
           }
          
          if(cartProducts.length > 0){
            const emptyCart = await axios.post(`${api_url}/api/clear/carts`,{
              "userId":userId
            });
            console.log(emptyCart.data);
          }
    
      return ctx.send("Payment Updated successfully in the backend");
      }
      else{
        console.log('Payemnt failed');
        // const user = await strapi.entityService.findOne('plugin::users-permissions.user',userId,{
        //   populate:'carts.product'
        // });
        const user = await axios.get(`${api_url}/api/users/${userId}?populate[0]=carts.product`);
        let cartCourseIds = user.data.carts.map(item => item.id);
        console.log('cart',cartCourseIds);
        
        const payment = await strapi.entityService.create('api::transaction.transaction', {
          data: {
              PaymentId: paymentId,                               
              Amount: updatedAmount.toString(),
              Payment_Method: method,
              Status: updatedStatus,
              publishedAt: Date.now(),
              users_permissions_user: userId,
          }
      });
      return ctx.send("Payment Failed");
      }
    }catch(err){
      console.error(err);
    }
  },
  async calculateDeliveryCharge(ctx) {
    const { userId,state } = ctx.params;

    // Fetch all carts associated with the user
    const carts = await strapi.entityService.findMany('api::cart.cart', {
      // fields: ['user'],
      filters: { user: userId },
      populate: { product: true },
    });  
    console.log(carts); 
    if (!carts || carts.length === 0) {
      return ctx.throw(404, 'No carts found for the user');
    }

    // Calculate total weight of all products across the user's carts
    let totalWeight = 0;
    carts.forEach((cart) => {
      totalWeight += cart.product.Weight * cart.Quantity;  // Assuming 'weight' is in kg and available on each product
    });
    console.log(totalWeight);
    const deliveryCharge = calculateDeliveryCharge(totalWeight, state);

    // Return the result
    ctx.send({
      totalWeight,
      state,
      deliveryCharge
    });
  },

};

