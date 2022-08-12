const express = require("express");
const app = express();
// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51LMtfiCruvk9OWrHU65M9yuGtrzoExsk6niAl0YRBKkxCP6PCSOcaEqbnc1UYINPkbCbxRqqZ3mjArNFdpZOsBgU00v4JVcqp3"
);

app.use(express.static("public"));
app.use(express.json());

const subscriptionPlans = [
  { id: "1", name: "Starter", price: 50 },
  { id: "2", name: "Standard", price: 99 },
  { id: "3", name: "Premium", price: 199 },
];

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  const selectedPlan = subscriptionPlans.filter(
    (plan) => plan.id === items[0].id
  );
  console.log(selectedPlan);
  return selectedPlan[0].price * items[0].quantity * 100;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  console.log(items);
  const orderAmount = calculateOrderAmount(items);
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: orderAmount,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));
