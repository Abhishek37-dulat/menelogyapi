const Seo = require("../models/Seo.js");

const GetSeoItem = async (req, res, next) => {
  try {
    const seo = await Seo.findOne({ content_id: req.params.id });
    console.log(seo);
    return res.status(200).json({ msg: "Success to Seo item!", data: seo });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get Seo Item!", error: error });
  }
};

const GetSeoItemAll = async (req, res, next) => {
  try {
    const seo = await Seo.find();
    console.log(seo);
    return res.status(200).json({ msg: "Success to Seo item!", data: seo });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error get Seo Item!", error: error });
  }
};

const AddSeoItem = async (req, res, next) => {
  try {
    const {
      content_id,
      seo_title,
      canonical_tag,
      description,
      seo_schema,
      keywords,
    } = req.body;
    if (
      !content_id ||
      !seo_title ||
      !canonical_tag ||
      !description ||
      !seo_schema ||
      !keywords
    ) {
      return res.status(400).json({ msg: "all filled required" });
    }
    const addseo = await new Seo({
      content_id,
      seo_title,
      canonical_tag,
      description,
      seo_schema,
      keywords,
    });
    console.log(addseo);
    await addseo.save();
    return res.status(200).json({ msg: "added successfully!", data: addseo });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "server error add one seo Item!", error: error });
  }
};

const UpdateSeoItem = async (req, res, next) => {
  try {
    const seoExist = await Seo.findById(req.params.id);
    if (!seoExist) {
      return res.status(400).json({ msg: "Seo doesn't exist!" });
    }
    const {
      content_id,
      seo_title,
      canonical_tag,
      description,
      seo_schema,
      keywords,
    } = req.body;
    if (
      !content_id ||
      !seo_title ||
      !canonical_tag ||
      !description ||
      !seo_schema ||
      !keywords
    ) {
      return res.status(400).json({
        msg: "all filled required",
      });
    }
    const seo = await Seo.findByIdAndUpdate(
      { _id: req.params.id },
      {
        content_id,
        seo_title,
        canonical_tag,
        description,
        seo_schema,
        keywords,
      },
      { new: true }
    );
    console.log(seo);
    return res.status(200).json({ msg: "updated successfully!", data: seo });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "server error add one seo Item!", error: error });
  }
};

module.exports = {
  GetSeoItem,
  UpdateSeoItem,
  AddSeoItem,
  GetSeoItemAll,
};
