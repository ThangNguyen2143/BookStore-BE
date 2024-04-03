module.exports = (sequelize, DataTypes) => {
    const WishList = sequelize.define("WishList");

    WishList.association = module =>{
      WishList.hasMany(module.Product)
    }
    return WishList;
  };