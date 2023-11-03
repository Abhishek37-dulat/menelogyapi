const axios = require("axios");
const crypto = require("crypto");
const { string } = require("joi");

const phonePe = async (req, res) => {
  try {
    const data = {
      merchantId: "MERCHANTUAT",
      merchantTransactionId: Date.now().toString(),
      merchantUserId: "MUID123",
      amount: 10000,
      redirectUrl: "http://localhost:3001/paymentsuccess", // Replace with your redirect URL
      redirectMode: "POST",
      callbackUrl: "http://localhost:3001/paymentsuccess", // Replace with your callback URL
      mobileNumber: "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const encode = Buffer.from(JSON.stringify(data)).toString("base64");
    const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
    const saltIndex = 1;
    // console.log("salt: ", saltKey);
    // console.log("encode: ", encode);

    const stringToHash = `${encode}/pg/v1/pay${saltKey}`;
    // console.log(stringToHash);
    const sha256 = crypto
      .createHash("sha256")
      .update(stringToHash)
      .digest("hex");

    const finalXHeader = `${sha256}###${saltIndex}`;
    // console.log("finalXHeader : ", finalXHeader);

    const response = await axios.post(
      "https://api-preprod.phonepe.com/apis/merchant-simulator/pg/v1/pay",
      {
        request: encode,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": finalXHeader,
        },
      }
    );

    const rData = response.data;
    // console.log(rData.data.instrumentResponse.redirectInfo.url);

    // Redirect to the URL received in the response
    res.send(rData.data.instrumentResponse.redirectInfo.url);
  } catch (error) {
    if (error.response) {
      // PhonePe server responded with an error status
      console.error("PhonePe Error:", error.response.data);
    } else if (error.request) {
      // The request was made but didn't receive a response
      console.error("No response received from PhonePe server");
    } else {
      // Something else went wrong
      console.error("Error:", error.message);
    }

    // Respond with an error status to the client
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { phonePe };
