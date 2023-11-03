fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error("Error reading images directory", err);
      return res.status(500).json({ message: "Server error" });
    }
    const imagePaths = files.map((file) => `/images/${file}`);
    const productWithData = products.map((data, index) => {
      return {
        ...data._doc,
        product_image: data.product_image.map((item) => imagePaths[0]),
      };
    });
    return res.status(200).json({
      msg: "All data fetch successfully!",
      data: productWithData,
      imagePaths: imagePaths,
    });
  });

  // // Route for updating an image (PUT operation)
app.put("/images/:imageName", (req, res) => {
  const oldImagePath = path.join(imagesDir, req.params.imageName);
  if (!fs.existsSync(oldImagePath)) {
    return res.status(404).json({ message: "Image not found" });
  }
