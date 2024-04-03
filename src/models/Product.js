module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("Product", {
      id:{
        type: DataTypes.STRING, // accept string 'product0**'
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stores: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      images:{
        type: DataTypes.JSON
      }
    });
  
    Product.associate = (models) => {
      Product.belongsTo(models.ProductType,{
        onDelete: 'RESTRICT'
      });
      Product.belongsToMany(models.Receipt,{
        through: models.ReceiptDetail
      })
      Product.belongsToMany(models.Order,{
        through: models.OrderDetail
      })
    }
    return Product;
  };