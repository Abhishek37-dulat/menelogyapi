const CheckOut = require("../models/CheckOutItems");
const Product = require("../models/Product");
const ShipToken = require("../models/ShipRocketToken");
const Wallet = require("../models/Wallet");
const { ObjectId } = require("mongodb");

const {
  GetToken,
  ShipPlaceOrder,
  cancelOrderShipRocket,
} = require("./orderController");

const GetUserOrdersAdmin = async (req, res, next) => {
  try {
    const data = await CheckOut.find({});

    return res
      .status(200)
      .json({ msg: "Success to all admin Orders!", data: data });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get all admin Orders!", error: error });
  }
};

const GetUserOrdersAdminSingle = async (req, res, next) => {
  try {
    const data = await CheckOut.find({ _id: req.params.id });
    if (!data) {
      return res.status(400).json({ msg: "no Order Exits!" });
    }
    return res
      .status(200)
      .json({ msg: "Success to single admin Orders!", data: data });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get single admin Orders!", error: error });
  }
};

const GetUserOrders = async (req, res, next) => {
  try {
    const data = await CheckOut.find({ user_id: req.user.userExits._id });
    if (!data) {
      return res.status(400).json({ msg: "no Order Exits!" });
    }
    return res
      .status(200)
      .json({ msg: "Success to all user Orders!", data: data });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get all user Orders!", error: error });
  }
};
const GetUserSingleOrder = async (req, res, next) => {
  try {
    const data = await CheckOut.find({ _id: req.params.id });
    if (!data) {
      return res.status(400).json({ msg: "no Order Exits!" });
    }
    return res.status(200).json({ msg: "Success to user Orders!", data: data });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get user Orders!", error: error });
  }
};

const NewOrder = async (customer, dataall) => {
  try {
    const delivery_address = JSON.parse(customer.metadata.address);
    const items = JSON.parse(customer.metadata.cart);
    console.log("log1", dataall);

    if (!items) {
      return res.status(400).json({ msg: "all field are required Order !" });
    }
    const amtPromises = items?.map(async (data) => {
      let price = await Product.findById(data.product_id);
      let qn = data.qty;
      let final_amount =
        (price.product_price -
          (price.product_price * price.product_discount) / 100) *
        qn;
      return final_amount;
    });
    console.log("log2");
    const disPromises = items?.map(async (data) => {
      let pp = await Product.findById(data.product_id);
      let qn = data.qty;
      let final_amount = ((pp.product_price * pp.product_discount) / 100) * qn;
      return final_amount;
    });
    console.log("log3");
    const deliveryPromises = items?.map(async (data) => {
      let dd = await Product.findById(data.product_id);
      let qn = data.qty;
      let dl = dd.product_weight;
      let final_amount = ((dl * qn * 1000) / 500) * 26;
      return final_amount;
    });
    console.log("log4");
    const del = await Promise.all(deliveryPromises);

    const amt = await Promise.all(amtPromises);

    const dis = await Promise.all(disPromises);

    const finalDEL = del.reduce((total, amount) => total + amount, 0);
    const finalAMT = amt.reduce((total, amount) => total + amount, 0);
    const finalDIS = dis.reduce((total, amount) => total + amount, 0);
    console.log(finalDEL, finalAMT, finalDIS);

    const data = await new CheckOut({
      items: items,
      delivery_address: delivery_address,
      user_id: customer.metadata.userId,
      total_discount: finalDIS,
      delivery_charge: finalDEL,
      order_status: "new",
      total_amount: finalAMT,
      paymentStatus: dataall.payment_status,
      paymentIntentId: dataall.payment_intent,
      customerId: dataall.customer,
    });
    await data.save();

    const walletamt = await Wallet.findOne({
      user_id: customer.metadata.userId,
    });
    if (!walletamt) {
      const wallet = await Wallet({
        user_id: customer.metadata.userId,
        order_id: data._id,
        payment_status: dataall.payment_status,
        amount: 0,
      });
      await wallet.save();
    }

    console.log("///////////////////", data);
    ///////////////////
    const checkToken = await ShipToken.find();
    if (checkToken.length > 0) {
      const initialDate = new Date(checkToken[0].createdAt);
      const numberOfDaysToAdd = 9;

      const newDate = new Date(initialDate);
      newDate.setDate(initialDate.getDate() + numberOfDaysToAdd);

      if (newDate < Date.now()) {
        await GetToken(checkToken[0]._id);
        const againCheck = await ShipToken.find();
        ShipPlaceOrder(againCheck, data);
      } else {
        ShipPlaceOrder(checkToken, data);
      }
    } else {
      await GetToken();
      const onceAgain = await ShipToken.find();
      ShipPlaceOrder(onceAgain, data);
    }

    //////////////////////
  } catch (error) {
    console.log("server error add user Orders!", error);
  }
};
const UpdateOrder = async (req, res, next) => {
  try {
    const orderdata = await CheckOut.find({ _id: req.params.id });
    console.log("orderdata:::", orderdata[0]);

    if (orderdata?.length <= 0) {
      return res.status(400).json({ msg: "Order doesn't exits !" });
    }

    const data = await CheckOut.findByIdAndUpdate(
      { _id: orderdata[0]._id.toString() },
      {
        items: orderdata[0].items,
        user_id: req.user.userExits._id,
        total_discount: orderdata[0].total_discount,
        delivery_charge: orderdata[0].delivery_charge,
        order_status: "PENDING",
        total_amount: orderdata[0].total_amount,
        ShipStatus: "PENDING",
      },
      { new: true }
    );
    res.status(200).json({ msg: "OrderStatus is pending!", data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "server error update user Orders!", error: error });
  }
};

const DeniedUpdateOrder = async (req, res, next) => {
  try {
    const orderdata = await CheckOut.find({ _id: req.params.id });
    console.log("orderdata:::", orderdata[0]);

    if (orderdata?.length <= 0) {
      return res.status(400).json({ msg: "Order doesn't exits !" });
    }

    const data = await CheckOut.findByIdAndUpdate(
      { _id: orderdata[0]._id.toString() },
      {
        items: orderdata[0].items,
        user_id: orderdata[0].user_id,
        total_discount: orderdata[0].total_discount,
        delivery_charge: orderdata[0].delivery_charge,
        order_status: "NEW",
        total_amount: orderdata[0].total_amount,
        ShipStatus: "NEW",
      },
      { new: true }
    );
    res.status(200).json({ msg: "OrderStatus is Denied!", data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "server error update user Orders!", error: error });
  }
};

const AdminUpdateOrder = async (req, res, next) => {
  try {
    const orderdata = await CheckOut.find({ _id: req.params.id });
    console.log("orderdata:::", orderdata[0]);

    if (orderdata?.length <= 0) {
      return res.status(400).json({ msg: "Order doesn't exits !" });
    }

    const checkToken = await ShipToken.find();
    if (checkToken.length > 0) {
      const initialDate = new Date(checkToken[0].createdAt);
      const numberOfDaysToAdd = 9;

      const newDate = new Date(initialDate);
      newDate.setDate(initialDate.getDate() + numberOfDaysToAdd);

      if (newDate < Date.now()) {
        await GetToken(checkToken[0]._id);
        const againCheck = await ShipToken.find();
        const cancelData = await cancelOrderShipRocket(
          againCheck,
          orderdata[0].order_id
        );
        // console.log("cancelData:::", cancelData);
        if (cancelData.status === 200) {
          const data = await CheckOut.findByIdAndUpdate(
            { _id: orderdata[0]._id.toString() },
            {
              items: orderdata[0].items,
              user_id: orderdata[0].user_id,
              total_discount: orderdata[0].total_discount,
              delivery_charge: orderdata[0].delivery_charge,
              order_status: "CANCELED",
              total_amount: orderdata[0].total_amount,
              ShipStatus: "CANCELED",
            },
            { new: true }
          );
          const walletamt = await Wallet.findOne({
            user_id: orderdata[0].user_id,
          });
          if (walletamt) {
            const wallet = await Wallet.findOneAndUpdate(
              { user_id: orderdata[0].user_id },
              {
                user_id: orderdata[0].user_id,
                order_id: data._id,
                payment_status: "returned",
                amount: walletamt.amount + orderdata[0].total_amount,
              },
              { new: true }
            );
            console.log("Data:::", data, wallet);

            return res.status(200).json({
              msg: "order canceled successfully!",
              data: data,
              wallet: wallet,
            });
          }
        }
        if (cancelData.status === 400) {
          return res.status(400).json({ msg: "cann't cancel order!" });
        }
      } else {
        const cancelData = await cancelOrderShipRocket(
          checkToken,
          orderdata[0].order_id
        );
        // console.log("2cancelData:::", cancelData);
        if (cancelData.status === 200) {
          const data = await CheckOut.findByIdAndUpdate(
            { _id: orderdata[0]._id.toString() },
            {
              items: orderdata[0].items,
              user_id: orderdata[0].user_id,
              total_discount: orderdata[0].total_discount,
              delivery_charge: orderdata[0].delivery_charge,
              order_status: "CANCELED",
              total_amount: orderdata[0].total_amount,
              ShipStatus: "CANCELED",
            },
            { new: true }
          );
          const walletamt = await Wallet.findOne({
            user_id: orderdata[0].user_id,
          });
          if (walletamt) {
            const wallet = await Wallet.findOneAndUpdate(
              { user_id: orderdata[0].user_id },
              {
                user_id: orderdata[0].user_id,
                order_id: data._id,
                payment_status: "returned",
                amount: walletamt.amount + orderdata[0].total_amount,
              },
              { new: true }
            );
            console.log("Data:::", data, wallet);

            return res.status(200).json({
              msg: "order canceled successfully!",
              data: data,
              wallet: wallet,
            });
          }
        }
        if (cancelData.status === 400) {
          return res.status(400).json({ msg: "cann't cancel order!" });
        }
      }
    } else {
      await GetToken();
      const onceAgain = await ShipToken.find();
      const cancelData = await cancelOrderShipRocket(
        onceAgain,
        orderdata[0].order_id
      );
      // console.log("3cancelData:::", cancelData);
      if (cancelData.status === 200) {
        const data = await CheckOut.findByIdAndUpdate(
          { _id: orderdata[0]._id.toString() },
          {
            items: orderdata[0].items,
            user_id: orderdata[0].user_id,
            total_discount: orderdata[0].total_discount,
            delivery_charge: orderdata[0].delivery_charge,
            order_status: "CANCELED",
            total_amount: orderdata[0].total_amount,
            ShipStatus: "CANCELED",
          },
          { new: true }
        );
        const walletamt = await Wallet.findOne({
          user_id: orderdata[0].user_id,
        });
        if (walletamt) {
          const wallet = await Wallet.findOneAndUpdate(
            { user_id: orderdata[0].user_id },
            {
              user_id: orderdata[0].user_id,
              order_id: data._id,
              payment_status: "returned",
              amount: walletamt.amount + orderdata[0].total_amount,
            },
            { new: true }
          );
          console.log("Data:::", data, wallet);

          return res.status(200).json({
            msg: "order canceled successfully!",
            data: data,
            wallet: wallet,
          });
        }
      }
      if (cancelData.status === 400) {
        return res.status(400).json({ msg: "cann't cancel order!" });
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "server error update user Orders!", error: error });
  }
};

module.exports = {
  GetUserOrders,
  GetUserSingleOrder,
  NewOrder,
  UpdateOrder,
  GetUserOrdersAdmin,
  GetUserOrdersAdminSingle,
  AdminUpdateOrder,
  DeniedUpdateOrder,
};
