// GetAllOrders,
//   GetSingleOrder,
//   NewOrder,
//   UpdateOrder,
const axios = require("axios");
const dotenv = require("dotenv").config();
const ShipToken = require("../models/ShipRocketToken.js");
const User = require("../models/User.js");
const UserAddress = require("../models/UserAddress.js");
const Product = require("../models/Product.js");
const CheckOut = require("../models/CheckOutItems.js");

const verifyOrders = async (req, res, next) => {
  try {
    const data = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.ADMIN_SHOPROCKET_EMAIL_ID,
        password: process.env.ADMIN_SHOPROCKET_PASSWORD,
      }
    );
    console.log(data);
    return res.status(200).json({ data: data.data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server side error", error: error });
  }
};

const GetAllOrders = async (req, res, next) => {
  try {
    let token;
    const checkToken = await ShipToken.find();
    if (checkToken.length > 0) {
      const initialDate = new Date(checkToken[0].createdAt);
      const numberOfDaysToAdd = 9;

      const newDate = new Date(initialDate);
      newDate.setDate(initialDate.getDate() + numberOfDaysToAdd);

      if (newDate < Date.now()) {
        await GetToken(checkToken[0]._id);
        const againCheck = await ShipToken.find();
        token = againCheck;
      } else {
        token = checkToken;
      }
    } else {
      await GetToken();
      const onceAgain = await ShipToken.find();
      token = onceAgain;
    }
    // const token = await req.headers.authorization.split(" ")[1];
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://apiv2.shiprocket.in/v1/external/orders",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token[0].token}`,
      },
    };
    const data = await axios(config);

    return res.status(200).json({ data: data.data.data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Server Side error while Getting all Orders",
      error: error,
    });
  }
};

const ShipPlaceOrder = async (token, details) => {
  console.log("details: ", details);
  try {
    //   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const paymentData = {
      merchantId: "MERCHANTUAT",
      merchantTransactionId: "MT7850590068188104",
      merchantUserId: "MUID123",
      amount: 10000,
      redirectUrl: "https://webhook.site/redirect-url",
      redirectMode: "POST",
      callbackUrl: "https://webhook.site/callback-url",
      mobileNumber: "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const options = {
      method: "POST",
      url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      data: paymentData,
    };

    await axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    const UserDetails = await User.findById(details.user_id);
    const userAddress = await UserAddress.find({ user_id: UserDetails._id });
    const productDetailsPromises = details?.items?.map(async (item) => {
      return await Product.findById(item.product_id);
    });
    const productDetails = await Promise.all(productDetailsPromises);
    const orderItems = details?.items?.map((detail, index) => {
      return {
        name: `${productDetails[index].product_title}`,
        sku: `${detail._id}`,
        units: `${detail.qty}`,
        selling_price: `${
          productDetails[index].product_price -
          (productDetails[index].product_price *
            productDetails[index].product_discount) /
            100
        }`,
        discount: `${productDetails[index].product_discount}`,
        tax: "",
        hsn: "",
      };
    });
    const final_L = productDetails.map((data, index) => {
      return data.product_length * details?.items[index].qty;
    });
    const sumL = final_L.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const final_B = productDetails.map((data, index) => {
      return data.product_breadth * details?.items[index].qty;
    });
    const sumB = final_B.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const final_H = productDetails.map((data, index) => {
      return data.product_height * details?.items[index].qty;
    });
    const sumH = final_H.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const final_w = productDetails.map((data, index) => {
      return data.product_weight * details?.items[index].qty;
    });
    const sumW = final_w.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const unixTimestamp = Date.now();
    const dateObject = new Date(unixTimestamp);

    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObject.getDate().toString().padStart(2, "0");
    const hours = dateObject.getHours().toString().padStart(2, "0");
    const minutes = dateObject.getMinutes().toString().padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

    const dataDetails = {
      order_id: `${Date.now()}`,
      order_date: `${formattedDate}`,
      pickup_location: "none",
      channel_id: "",
      comment: "comment",
      billing_customer_name: `${UserDetails.first_name}`,
      billing_last_name: `${UserDetails.last_name}`,
      billing_address: `${details.delivery_address.address}`,
      billing_address_2: "",
      billing_city: `${details.delivery_address.city}`,
      billing_pincode: `${details.delivery_address.pin_code}`,
      billing_state: `${details.delivery_address.state}`,
      billing_country: "india",
      billing_email: `${UserDetails.email}`,
      billing_phone: `${UserDetails.phone}`,
      shipping_is_billing: true,
      shipping_customer_name: "",
      shipping_last_name: "",
      shipping_address: "",
      shipping_address_2: "",
      shipping_city: "",
      shipping_pincode: "",
      shipping_country: "",
      shipping_state: "",
      shipping_email: "",
      shipping_phone: "",
      order_items: orderItems,
      payment_method: "Prepaid",
      shipping_charges: "",
      giftwrap_charges: "",
      transaction_charges: "",
      total_discount: Math.floor(details.total_discount),
      sub_total: Math.floor(details.total_amount),
      length: sumL,
      breadth: sumB,
      height: sumH,
      weight: sumW,
    };

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token[0].token}`,
      },
      data: dataDetails,
    };
    const placeOrders = await axios(config);
    console.log("placeorder: ", placeOrders.data);

    const changeStatus = await CheckOut.findById(details._id);
    if (!changeStatus) {
      res
        .status(400)
        .json({ msg: "error while handling changestatus in placeing order!" });
    }
    const updatedStatus = await CheckOut.findByIdAndUpdate(
      { _id: details._id },
      {
        items: details.items,
        user_id: details.user_id,
        total_discount: details.total_discount,
        delivery_charge: details.delivery_charge,
        order_status: placeOrders.data.status,
        total_amount: details.total_amount.toFixed(2),
        order_id: placeOrders.data.order_id,
        shipment_id: placeOrders.data.shipment_id,
        ShipStatus: placeOrders.data.status,
      },
      { new: true }
    );
    console.log("updated Data: ", updatedStatus);
    // return res.status(200).json({ msg: "order Status!", data: updatedStatus });
  } catch (error) {
    console.log(error);
  }
};

const cancelOrderShipRocket = async (token, id) => {
  try {
    let idDetails = JSON.stringify({
      ids: [id],
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://apiv2.shiprocket.in/v1/external/orders/cancel",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token[0].token}`,
      },
      data: idDetails,
    };

    const data = await axios(config);

    return data;
  } catch (error) {
    return error.response;
  }
};

const GetToken = async (iiid) => {
  var axios = require("axios");
  var data = JSON.stringify({
    email: process.env.ADMIN_SHOPROCKET_EMAIL_ID,
    password: process.env.ADMIN_SHOPROCKET_PASSWORD,
  });

  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://apiv2.shiprocket.in/v1/external/auth/login",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const tokenRes = await axios(config);
    if (iiid) {
      await ShipToken.findOneAndRemove({ _id: iiid });
      console.log(tokenRes.data);
      const details = await new ShipToken({
        ship_id: tokenRes.data.id,
        first_name: tokenRes.data.first_name,
        last_name: tokenRes.data.last_name,
        email: tokenRes.data.email,
        company_id: tokenRes.data.company_id,
        created_at: tokenRes.data.created_at,
        token: tokenRes.data.token,
      });
      await details.save();
    } else {
      const details = await new ShipToken({
        ship_id: tokenRes.data.id,
        first_name: tokenRes.data.first_name,
        last_name: tokenRes.data.last_name,
        email: tokenRes.data.email,
        company_id: tokenRes.data.company_id,
        created_at: tokenRes.data.created_at,
        token: tokenRes.data.token,
      });
      await details.save();
    }
    // console.log(details);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  verifyOrders,
  GetAllOrders,
  ShipPlaceOrder,
  GetToken,
  cancelOrderShipRocket,
};
