const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();
const morgan = require("morgan");
const db = require("./Firebase");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { FieldValue } = require("firebase/firestore");
const bodyParser = require("body-parser");

const router = express.Router();

// Logging middleware
router.use(morgan("combined"));

// Endpoint to create a checkout session
router.post("/create-checkout-session", bodyParser.json(), async (req, res) => {
  const amount = req.body.amount * 100;
  const userId = req.body.userId;

  const domain = "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Add $${
                amount / 100
              } credits to your Chat With Notes By Willful Works account`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${domain}/success`,
      cancel_url: `${domain}/my-credits`,
      metadata: { userId },
    });

    res.json({ session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    //console.log("webhook ran");
    let sig, event;
    try {
      sig = req.headers["stripe-signature"];
    } catch (e) {
      // console.log("sig error", e);
    }
    try {
      stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_KEY
      );
      // Parse the verified raw event
      event = JSON.parse(req.body.toString());
    } catch (err) {
      //console.log("event error: ", err);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const amountCredited = session.amount_subtotal / 100;
      // console.log("session: ", session, "userId: ", userId);
      //  console.log("amountCredited: ", amountCredited);
      const userRef = db.collection("users").doc(userId);
      userRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
      userRef
        .update({
          credits: FieldValue.increment(amountCredited),
        })
        .then(() => {
          console.log("Credits added successfully");
        })
        .catch((error) => {
          console.error("Error adding credits: ", error);
        });
    }

    res.status(200).json({ received: true });
  }
);

function getAmountFromSession(session) {
  if (session.line_items && session.line_items[0]) {
    return session.amount_subtotal / 100;
  }
  return 0;
}

module.exports = router;
