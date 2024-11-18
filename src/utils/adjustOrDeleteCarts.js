const axios = require('axios');
const api_url = 'https://api.shriworkscraft.com';


const adjustOrDeleteCarts = async (cartItem) => {
    try {
      // API call to fetch all carts containing the same product
      const response = await axios.get(`${api_url}/api/carts?filters[product][id][$eq]=${cartItem.product.id}`);
      let otherCarts = response.data.data;
      
      // Filter out the current cart from the other carts array
      otherCarts = otherCarts.filter(otherCart => otherCart.id !== cartItem.id);
      
      // Total quantity of product across all carts (including current cart)
      //let totalQuantityInCarts = otherCarts.reduce((sum, cart) => sum + Number(cart.quantity), 0);
      let totalQuantityInCarts = otherCarts.reduce((sum, cart) => {
  	const quantity = Number(cart.attributes.Quantity); // Convert to number
        console.log(cart,'cartQuantity');
  	return sum + quantity; // Add only valid numbers	
	}, 0);
       console.log(typeof totalQuantityInCarts);
      // Available stock for the product
      const availableStock = Number(cartItem.product.AvailableQuantity); // Assuming this is in cartItem.product
      console.log('total quantity',totalQuantityInCarts);
      console.log('available quantity', availableStock);
      // If total quantity exceeds available stock
      if (totalQuantityInCarts > availableStock) {
        let quantityToRemove = totalQuantityInCarts - availableStock;
        console.log('quantity to remove',quantityToRemove);
        // Sort the carts based on their quantity (you could also sort by creation date or other criteria)
        otherCarts = otherCarts.sort((a, b) => b.quantity - a.quantity);

        // Iterate through the other carts and reduce quantity or delete as needed
        for (const otherCart of otherCarts) {
          if (quantityToRemove <= 0) break; // Stop if we have balanced the stock
  
          // Check if we can reduce the quantity of this cart or need to delete it
	  const cartQuantity = Number(otherCart.attributes.Quantity);
	  console.log(otherCart.attributes.Quantity);
          if (cartQuantity <= quantityToRemove) {
            // Delete the entire cart if its quantity is less than or equal to what we need to remove
            await axios.delete(`${api_url}/api/carts/${otherCart.id}`);
            console.log(`Deleted cart with id ${otherCart.id} as part of quantity adjustment.`);
            quantityToRemove -= otherCart.quantity;
          } else {
            // Reduce the quantity of this cart instead of deleting
            const newQuantity = otherCart.quantity - quantityToRemove;
            await axios.put(`${api_url}/api/carts/${otherCart.id}`, { Quantity: newQuantity });
            console.log(`Updated cart with id ${otherCart.id}, reduced quantity to ${newQuantity}.`);
            quantityToRemove = 0; // No more need to remove
          }
        }
      } else {
        console.log(`No need to delete or adjust carts. Total quantity is within available stock.`);
      }
    } catch (error) {
      console.error(`Error adjusting or deleting carts for product with id ${cartItem.product.id}:`, error);
    }
  };
  module.exports = { adjustOrDeleteCarts };
