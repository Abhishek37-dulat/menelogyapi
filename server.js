const morgan = require("morgan");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const ConnectionDB = require("./database/db.js");
const userRoute = require("./routes/userRoutes.js");
const adminRoute = require("./routes/adminRoutes.js");
const productRoute = require("./routes/productRoutes.js");
const commentRoute = require("./routes/commentRoutes.js");
const saveRoute = require("./routes/saveRoutes.js");
const cartRoute = require("./routes/cartRouters.js");
const CatRoutes = require("./routes/CategoriesRoutes.js");
const colorRoutes = require("./routes/colorRoutes.js");
const path = require("path");
const orderRoute = require("./routes/orderRoutes.js");
const userAddressRoute = require("./routes/userAddressRoutes.js");
const UserCheckOutRoute = require("./routes/checkOutItemRoutes.js");
const profileRouter = require("./routes/profileRouters.js");
const paymentRoute = require("./routes/PaymentRoutes.js");
const phonepayRoute = require("./routes/phonepayRoute.js");
const bannerRoute = require("./routes/bannerRoutes.js");
const postRoute = require("./routes/postRoutes.js");
const walletRoute = require("./routes/walletRoutes.js");
const blogRoute = require("./routes/blogRoutes.js");
const Stripe = require("stripe");
const { NewOrder } = require("./controllers/userOrderController.js");
const seoRoute = require("./routes/seoRoutes.js");
const contactRoute = require("./routes/contactRoutes.js");

dotenv.config();

const PORT = process.env.PORT || 5666;
const MONGODB_URL = process.env.MONGODB_URL;
const imagesDir = path.join(__dirname, "./uploads");
const stripe = Stripe(process.env.STRIP_KEY);

app.use(cors());
let endpointSecret;
endpointSecret = process.env.WEB_HOOK_SECRET;

// Serve the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Handle other routes by serving index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];

  let data;
  let eventType;

  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      // console.log("Webhook verified.");
      console.log("Webhook verified.", event);
      res.status(200).send(event);
    } catch (err) {
      // console.log(err);
      res.status(400).send(`Webhook Error: ${err.message}`);
      // console.log("Webhook not verified.");
      return;
    }
    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
    // console.log(req.body);
  }
  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        NewOrder(customer, data);
        console.log("");
      })
      .catch((err) => console.log(err));
  }

  // Handle the event
  // switch (event.type) {
  //   case "payment_intent.succeeded":
  //     const paymentIntentSucceeded = event.data.object;
  //     break;
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }
  // res.send();
  res.send().end();
});
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.get("/", async (req, res) => {
  try {
    console.log("Hair Product All");
    res.send("Hair Product All");
  } catch (error) {
    console.log(error);
  }
});
app.use(morgan("dev"));
app.use("/images", express.static(imagesDir));
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/product", productRoute);
app.use("/comment", commentRoute);
app.use("/save", saveRoute);
app.use("/cart", cartRoute);
app.use("/checkout", UserCheckOutRoute);
app.use("/categories", CatRoutes);
app.use("/colors", colorRoutes);
app.use("/order", orderRoute);
app.use("/useraddress", userAddressRoute);
app.use("/profile", profileRouter);
app.use("/banner", bannerRoute);
app.use("/posts", postRoute);
app.use("/api", paymentRoute);
app.use("/blog", blogRoute);
app.use("/phonepay", phonepayRoute);
app.use("/wallet", walletRoute);
app.use("/contact", contactRoute);
app.use("/seo", seoRoute);
app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_ID })
);

// ------------------------------------------------------------------------------

app.post("/create-checkout-session", async (req, res) => {
  // console.log(
  //   "req.body.orderDetails: ",
  //   req.body.orderDetails,
  //   parseInt(req.body.orderDetails.delivery_charges)
  // );
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId.toString(),
      cart: JSON.stringify(req.body.orderDetails.items).toString(),
      address: JSON.stringify(
        req.body.orderDetails.delivery_address
      ).toString(),
    },
  });
  console.log("customer.id :  ", customer.id);
  const line_items = req.body.orderDetails.items?.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item?.product_id,
        },
        unit_amount: parseInt(item?.price) * 100,
      },
      quantity: parseInt(item?.qty),
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],

    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: parseInt(req.body.orderDetails?.delivery_charges) * 100,
            currency: "inr",
          },
          display_name: "Shipping Charges",
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items: line_items,
    customer: customer?.id,
    mode: "payment",
    success_url: `${process.env.WEB_HTTP}/paymentsuccess`,
    cancel_url: `${process.env.WEB_HTTP}/cart`,
  });

  res.send({ url: session.url });
});

// // This is your Stripe CLI webhook secret for testing your endpoint locally.

// ---------------------------------------------------------------------

ConnectionDB(MONGODB_URL);

app.listen(PORT, () => {
  console.log("Listening to PORT: ", PORT);
});
