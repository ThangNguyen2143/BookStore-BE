const cloudinary = require("cloudinary");
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = function uploads(file, folder){
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({
          public_id: result.public_id,
          url: result.url,
        });
      },

      {
        resource_type: "auto",
        folder: "Mangaer-store/"+folder,
      }
    );
  });
};

module.exports = cloudinary;
