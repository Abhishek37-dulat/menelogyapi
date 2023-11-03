const mongoose = require("mongoose");

const seoSchema = mongoose.Schema(
  {
    content_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    seo_title: {
      type: String,
      require: true,
    },
    canonical_tag: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    seo_schema: {
      type: String,
    },

    keywords: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Seo = mongoose.model("Seo", seoSchema);

module.exports = Seo;
