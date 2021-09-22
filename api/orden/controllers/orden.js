'use strict';
const stripe = require("stripe")("sk_test_51JZgh5I8wN4gxyyhHOsgEUiR9wg364mkbRo80AonuMpakIg7eF3HvRIA6kg500BL6q54tNHVMEfYekXZFRiT5JKL00Rtb7m2aV")
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx) {
        const {token, products, idUser, addressShipping} = ctx.request.body;
        let totalPayment = 0;
        products.forEach(product => {
            totalPayment = totalPayment + product.price;
        });

        const charge = await stripe.charges.create({
            amount: totalPayment * 100,
            currency: "eur",
            source: token.id,
            description: `ID Usuario: ${idUser}`,
        });

        const createOrder = [];
        for await(const product of products) {
            const data = {
                producto: product.id,
                users_permissions_user: idUser,
                totalPayment,
                idPayment: charge.id,
                addressShipping
            };

            const validData = await strapi.entityValidator.validateEntityCreation(
                strapi.models.orden,
                data
            );

            const entry = await strapi.query("orden").create(validData);
            createOrder.push(entry);
        }
        return createOrder;
    }
};
