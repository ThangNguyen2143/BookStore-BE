module.exports = (sequelize, DataTypes) => {
    const ProductType = sequelize.define("ProductType", {
      id:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      type_name: {
        type: DataTypes.STRING,
        allowNull: false,
      }

    });
    ProductType.associate = module =>{
          ProductType.hasMany(module.Product)
    }
    return ProductType;
  };