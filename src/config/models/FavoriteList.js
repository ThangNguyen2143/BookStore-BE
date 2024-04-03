module.exports = (sequelize, DataTypes) => {
    const FavoriteList = sequelize.define("FavoriteList");

    FavoriteList.association = module =>{
      FavoriteList.hasMany(module.Product)
    }
    return FavoriteList;
  };