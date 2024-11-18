module.exports = {
    async removeCartItem(ctx) {
        const { cartId } = ctx.request.body;
	console.log(cartId,'cart id');
        const entry = await strapi.entityService.findOne('api::cart.cart', cartId);
        // console.log(entry);
        const cartQuantity = Number(entry.Quantity);
        if(cartQuantity > 1){
            const entry = await strapi.entityService.update('api::cart.cart', cartId, {
                data: {
                  Quantity: cartQuantity - 1,
                },
              });
              console.log(entry,'decreased');
              ctx.send({ message: 'Cart quantity decremented successfully'});
        }
        else{
            const entry = await strapi.entityService.delete('api::cart.cart', cartId);
            ctx.send({ message: 'Cart deleted successfully' });
        }
    },
     async clearTotalCart(ctx) {
        const { userId } = ctx.request.body;
        console.log(userId);
        try {
            // Find all carts related to the user
            const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
              populate: ['carts'], // Make sure the carts relation is populated
            });
            console.log(user);
            if (user && user.carts && user.carts.length > 0) {
              // Get the cart IDs
              const cartIds = user.carts.map(cart => cart.id);
        
              // Delete all the carts related to the user
              await Promise.all(cartIds.map(id => 
                strapi.entityService.delete('api::cart.cart', id)
              ));
            }
        
            return ctx.send({ message: 'All carts cleared successfully' });
          } catch (error) {
            return ctx.badRequest('Failed to clear carts', { error });
          }
    },
     async clearOneCart(ctx) {
        const { cartId } = ctx.request.body;
        const entry = await strapi.entityService.delete('api::cart.cart',cartId);
        return ctx.send({ message: 'Cart cleared successfully' });
    },
}
