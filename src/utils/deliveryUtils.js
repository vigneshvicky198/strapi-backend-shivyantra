const axios = require("axios");

const calculateDeliveryCharge = async (weight, state) => {
    // Convert weight to grams
    const weightInGrams = weight * 1000;
    console.log(weightInGrams);

    // Fetch delivery charge data from Strapi API
    const response = await axios.get('https://api.shriworks.com/api/delivery-charges?populate=*');
    // const { data } = await response.json();
    console.log(response.data.data, 'delivery charges');
    // let delivery = [];
    // delivery = data;
    // Find the record for the given state
    let stateData = response.data.data.find(item => item.attributes.State === state);
	
   // if (!stateData) return "State not found in the delivery charge table";
   if (!stateData){
        stateData = response.data.data.find(item => item.attributes.State === 'otherStates');
        console.log(stateData, 'otherstates');
    }
    // Match the weight group using enumeration
    const weightGroup = stateData.attributes.WeightGroups.find(group => {
        const weightLimit = group.Weight;

        if (weightLimit.startsWith("Upto")) {
            const limitInGrams = parseInt(weightLimit.match(/\d+/)[0], 10);
            console.log(parseInt(weightLimit.match(/\d+/)[0], 10),'upto');
            return weightInGrams <= limitInGrams;
        } else if (weightLimit.startsWith("Above")) {
            const limitInGrams = parseInt(weightLimit.match(/\d+/)[0], 10);
            console.log('above');
            return weightInGrams > limitInGrams;
        }
    
        // return false; // Fallback if weightLimit format doesn't match
    });
    console.log(weightGroup,'weight');
    if (!weightGroup) return 0;

    // Calculate the charge
    let charge = weightGroup.baseRate;
    if (weightGroup.Weight === "Above 10000 Gms" && weightGroup.additionalRatePerKg) {
        const extraWeightInKg = Math.ceil((weightInGrams - 10000) / 1000); // Extra weight above 10 kg
        charge += extraWeightInKg * weightGroup.additionalRatePerKg;
    }
    console.log(charge,'charge');
    return charge;
};
module.exports = { calculateDeliveryCharge };
