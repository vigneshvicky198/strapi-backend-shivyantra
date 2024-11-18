
const axios = require('axios');
const { errors } = require('@strapi/utils');
const { ApplicationError,NotFoundError } = errors;
//const { Application } = require('twilio/lib/twiml/VoiceResponse');
const api_url = 'https://api.shriworkscraft.com';
module.exports = {
   async beforeCreate(event) {
      const { data, where, select, populate } = event.params;
      // const productId = data.product.connect[0].id;
      const productId = data.product;
      console.log(data,'qua');
      const quantity = Number(data.Quantity) || 0;
      console.log(quantity);
      // let's do a 20% discount everytime
      console.log("Before Create");
      console.log(event.params.data.user);
      // console.log(event.params.data.user.connect[0].id);
      
      const entry = await strapi.entityService.findOne('api::product.product', productId, {
        fields: ['AvailableQuantity'],
        // populate: { category: true },
      });
      console.log(entry,'product');
      const availableQuantity = Number(entry.AvailableQuantity);
      if(quantity > availableQuantity){
        throw new Error('Product sold out');
      }
      const userId = event.params.data.user;
      const response = await axios.get(`${api_url}/api/users/${userId}?populate=carts.product`);
      console.log('carts', response.data.carts);
      const carts = response.data.carts;
	console.log(carts,'cartssssss');
      const findProductById = (productId) => {
        return carts.find(cart => cart.product.id === productId);
      };
      const result = findProductById(productId);
      console.log('IsProductAlready exist',result);
      if(result){
        console.log('oldQuantity', result.Quantity);
        const oldQuantity = Number(result.Quantity) || 0;
        console.log(oldQuantity+quantity, 'Addition');
        const entry = await strapi.entityService.update('api::cart.cart', result.id, {
          data: {
            Quantity:oldQuantity + quantity,
          },
        });
        console.log(entry,'updatedCart');
        // return badRequest('OTP is expired');
        throw new NotFoundError('The Product is already in the cart');
      }

    },
  
    afterCreate(event) {
      const { result, params } = event;
  
      // do something to the result;
    },
  };
  
  
