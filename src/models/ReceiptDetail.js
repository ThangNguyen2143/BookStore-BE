
module.exports = (sequelize, DataTypes) => {
    const Receipt = sequelize.models.Receipt;
    const Product = sequelize.models.Product;
    const ReceiptDetail = sequelize.define("ReceiptDetail", {
      ReceiptId: {
        type: DataTypes.INTEGER,
        references: {
          model: Receipt, 
          key: 'id'
        }
      },
      ProductId: {
        type: DataTypes.STRING,
        references: {
          model: Product, 
          key: 'id'
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price_import:{
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      price_export:{
        type: DataTypes.FLOAT,
        allowNull: false,
      }
    });
   
    return ReceiptDetail;
  };