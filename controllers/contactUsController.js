const Contact = require("../models/Contact");

const SingleContact = async (req, res, next) => {
  try {
    const allcontact = await Contact.findById(req.params.id);
    if (!allcontact) {
      return res
        .status(400)
        .json({ msg: "error to contact!", data: allcontact });
    }
    console.log(allcontact);
    return res
      .status(200)
      .json({ msg: "Success to get contact!", data: allcontact });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get contact!", error: error });
  }
};

const ShowContact = async (req, res, next) => {
  try {
    const allcontact = await Contact.find();
    console.log(allcontact);
    return res
      .status(200)
      .json({ msg: "Success to all contact!", data: allcontact });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get all contact!", error: error });
  }
};

const AddContact = async (req, res, next) => {
  try {
    const { email, phone, address, location } = req.body;

    if (!email || !phone || !address || !location) {
      return res
        .status(400)
        .json({ msg: "to contact please fill required filled!" });
    }
    console.log(req.body);

    const addcontact = await new Contact({
      email,
      phone,
      address,
      location,
    });
    await addcontact.save();
    return res
      .status(200)
      .json({ msg: "your contact add Successfully!", data: addcontact });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "server error add contact!", error: error });
  }
};

const UpdateContact = async (req, res, next) => {
  try {
    const contactExist = await Contact.findById(req.params.id);
    if (!contactExist) {
      return res.status(400).json({ msg: "contact not possible!" });
    }
    const { email, phone, address, location } = req.body;
    if (!email || !phone || !address || !location) {
      return res
        .status(400)
        .json({ msg: "to contact please fill required filled!" });
    }
    const updatecontact = await Contact.findOneAndUpdate(
      { _id: contactExist._id },
      {
        email,
        phone,
        address,
        location,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ msg: "your contact updated Successfully!", data: updatecontact });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error add comment!", error: error });
  }
};

const DeleteContact = async (req, res, next) => {
  try {
    const contactExist = await Contact.findOne({ _id: req.params.id });
    if (!contactExist) {
      return res.status(400).json({ msg: "not able to delete contact!" });
    }
    await Contact.findOneAndRemove({ _id: contactExist._id });
    return res
      .status(200)
      .json({ msg: "Success to delete contact!", data: contactExist });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get all contact!", error: error });
  }
};

module.exports = {
  AddContact,
  UpdateContact,
  DeleteContact,
  ShowContact,
  SingleContact,
};
