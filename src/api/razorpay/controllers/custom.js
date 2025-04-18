'use strict';

const axios = require('axios');
const Razorpay = require('razorpay');
const { calculateDeliveryCharge } = require('../../../utils/deliveryUtils');
const { adjustOrDeleteCarts } = require('../../../utils/adjustOrDeleteCarts');
const { generateInvoice, sendOrderEmail } = require('../../../utils/orderEmail');
// const invoice = require('../../invoice/controllers/invoice');

const api_url = 'https://api.shriworks.com'
module.exports = {
  async payment(ctx) {
    try{
      const{paymentId} = ctx.request.params;
      if (!ctx.state.user) {
        return ctx.unauthorized('You must be logged ');
      }
      const userId = ctx.state.user.id;
      const emailId = ctx.state.user.email;
      console.log('User',userId);
      const user = await axios.get(`${api_url}/api/users/${userId}`);
      console.log(user.data,'user response');
      const razorpay = await axios.get(`${api_url}/api/razorpay`);
      console.log(razorpay.data,'razorpay');
      const keyId = razorpay.data.data.attributes.KeyId;
      const keySecret = razorpay.data.data.attributes.KeySecret
      const instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
      const paymentDetails = await instance.payments.fetch(paymentId);
      console.log(paymentDetails);

      const { amount, method, status } = paymentDetails;

      const updatedAmount = Number(amount) / 100;
      const updatedStatus = (status === 'authorized' || 'captured') ? 'success' : status;

      if(status === 'captured' || 'authorized'){
        
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
        try{
          const user = await axios.get(`${api_url}/api/users/${userId}?populate[0]=carts.product`);
          cartProducts = user.data.carts.map(item => item);
          console.log('cart',cartProducts);
        }
        catch(err){
          console.log(err);
        }
	let invoiceId;
	try{
	    const res = await axios.post(`${api_url}/api/invoices`,{
      		data:{
        	user:userId,
      		}
	    })
    		invoiceId = res.data.data.id;
  	}
  	catch(err){
    	   console.log(err);
  	}


        const postProductData = async (cart) => {
          try {
            console.log(cart,'consoling each cart');
            const quant = Number(cart.Quantity);
	    console.log(quant,'quant');
            const response = await axios.post(`${api_url}/api/purchased-orders`, {
	      data:{
              product: cart.product.id,
              users_permissions_user:userId,
              Quantity:quant,
	      publishedAt:null
              }
              // Add any additional data here
            });
	    const res = await axios.put(`${api_url}/api/invoices/${invoiceId}`,{
		data:{
		 purchased_orders:response.data.data.id
		}
	    })

            const updateProductQuantity = await axios.put(`${api_url}/api/products/${cart.product.id}`,{
              data: {
                AvailableQuantity: Number(cart.product.AvailableQuantity)- Number(cart.Quantity),
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

          for (const cartItem of cartProducts) {
            await adjustOrDeleteCarts(cartItem);
          }
          
          if(cartProducts.length > 0){
            const emptyCart = await axios.post(`${api_url}/api/clear/carts`,{
              "userId":userId
            });
            console.log(emptyCart.data);
          }
          const documents = await axios.get(`${api_url}/api/invoices?sort[0]=id:DESC&pagination[page]=1&pagination[pageSize]=1`)

          const orderDetails = {
            invoiceNo: 'SW' + documents.data.data[0].id,
            date:new Date(paymentDetails.created_at),
            products: cartProducts,
            total: amount/100,
    
          };
          console.log(orderDetails.total,'amount....')
          const customerDetails = {
            name: user.data.username,
            address: user.data.Address+", " +  user.data.City+", " +  user.data.State,
            mobile: user.data.Mobile,
            total: amount/100,
	    userId: userId,
	    invoiceNo: 'SW' + documents.data.data[0].id,
          };
          console.log(paymentId,'payment id')
          const fileName = await generateInvoice(orderDetails, customerDetails, paymentId, invoiceId);
          console.log(fileName,'pdfInvoice');
        
          const sendEmail = await sendOrderEmail(emailId, fileName,customerDetails);
          console.log(sendEmail, 'emailInvoice');
    
      return ctx.send("Payment Updated successfully in the backend");
      }
      else{
        console.log('Payemnt failed');
        // const user = await strapi.entityService.findOne('plugin::users-permissions.user',userId,{
        //   populate:'carts.product'
        // });
        const user = await axios.get(`${api_url}/api/users/${userId}?populate[0]=carts.product`);
        let cartCourseIds = user.data.carts.map(item => item.id);
        let cartProducts = user.data.carts;
        console.log('cart',cartProducts);
        
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
    async order(ctx){
    const razorpayDetails = await axios.get(`${api_url}/api/razorpay`);  
      console.log(razorpayDetails.data);
      const razorpay = new Razorpay({ key_id: razorpayDetails.data.data.attributes.KeyId, key_secret: razorpayDetails.data.data.attributes.KeySecret })
  
    const {amount} = ctx.request.params;
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt#${Date.now()}`,
  };
  try {
      const order = await razorpay.orders.create(options);
      return ctx.send(order);
  } catch (error) {
    return ctx.send({error:"Error creating order"});
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
    const deliveryCharge = await calculateDeliveryCharge(totalWeight, state);
    console.log(deliveryCharge,'deliveryCharge');
    // Return the result
    ctx.send({
      totalWeight,
      state,
      deliveryCharge
    });
  },

};

