const calculateDeliveryCharge = (weight, state) => {
      let charge = 0;
  
      // Convert weight to grams for easier comparison
      const weightInGrams = weight * 1000;
  
      if (state === 'Tamil Nadu') {
          if (weightInGrams <= 250) charge = 80;
          else if (weightInGrams <= 500) charge = 95;
          else if (weightInGrams <= 1000) charge = 130;
          else if (weightInGrams <= 1500) charge = 165;
          else if (weightInGrams <= 2000) charge = 200;
          else if (weightInGrams <= 2500) charge = 235;
          else if (weightInGrams <= 3000) charge = 270;
          else if (weightInGrams <= 3500) charge = 305;
          else if (weightInGrams <= 4000) charge = 340;
          else if (weightInGrams <= 4500) charge = 375;
          else if (weightInGrams <= 5000) charge = 410;
          else if (weightInGrams <= 6000) charge = 410 + 50; // For 5–6 kg
          else if (weightInGrams <= 7000) charge = 350;      // For 6–7 kg
          else if (weightInGrams <= 8000) charge = 400;      // For 7–8 kg
          else if (weightInGrams <= 9000) charge = 450;      // For 8–9 kg
          else if (weightInGrams <= 10000) charge = 500;     // For 9–10 kg
          else charge = 500 + ((Math.ceil(weightInGrams / 1000) - 10) * 40); // Above 10 kg
      } else if (['Karnataka', 'Kerala', 'Andhra Pradesh', 'Telangana'].includes(state)) {
          if (weightInGrams <= 250) charge = 85;
          else if (weightInGrams <= 500) charge = 105;
          else if (weightInGrams <= 1000) charge = 150;
          else if (weightInGrams <= 1500) charge = 195;
          else if (weightInGrams <= 2000) charge = 240;
          else if (weightInGrams <= 2500) charge = 285;
          else if (weightInGrams <= 3000) charge = 330;
          else if (weightInGrams <= 3500) charge = 375;
          else if (weightInGrams <= 4000) charge = 420;
          else if (weightInGrams <= 4500) charge = 465;
          else if (weightInGrams <= 5000) charge = 510;
          else if (weightInGrams <= 6000) charge = 510 + 60; // For 5–6 kg
          else if (weightInGrams <= 7000) charge = 420;      // For 6–7 kg
          else if (weightInGrams <= 8000) charge = 480;      // For 7–8 kg
          else if (weightInGrams <= 9000) charge = 540;      // For 8–9 kg
          else if (weightInGrams <= 10000) charge = 600;     // For 9–10 kg
          else charge = 600 + ((Math.ceil(weightInGrams / 1000) - 10) * 50); // Above 10 kg
      } else {
          // Other states or Rest of India
          if (weightInGrams <= 250) charge = 110;
          else if (weightInGrams <= 500) charge = 140;
          else if (weightInGrams <= 1000) charge = 220;
          else if (weightInGrams <= 1500) charge = 300;
          else if (weightInGrams <= 2000) charge = 380;
          else if (weightInGrams <= 2500) charge = 460;
          else if (weightInGrams <= 3000) charge = 540;
          else if (weightInGrams <= 3500) charge = 620;
          else if (weightInGrams <= 4000) charge = 700;
          else if (weightInGrams <= 4500) charge = 780;
          else if (weightInGrams <= 5000) charge = 860;
          else if (weightInGrams <= 6000) charge = 860 + 155; // For 5–6 kg
          else if (weightInGrams <= 7000) charge = 1085;      // For 6–7 kg
          else if (weightInGrams <= 8000) charge = 1200;      // For 7–8 kg
          else if (weightInGrams <= 9000) charge = 1350;      // For 8–9 kg
          else if (weightInGrams <= 10000) charge = 1550;     // For 9–10 kg
          else charge = 1550 + ((Math.ceil(weightInGrams / 1000) - 10) * 120); // Above 10 kg
      }
  
      return charge;
  };

  module.exports = { calculateDeliveryCharge };
