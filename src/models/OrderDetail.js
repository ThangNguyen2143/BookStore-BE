
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.models.Order;
    const Product = sequelize.models.Product;
    const OrderDetail = sequelize.define("OrderDetail", {
      OrderId: {
        type: DataTypes.INTEGER,
        references: {
          model: Order, 
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
      total: {
            type: DataTypes.FLOAT,
            allowNull: false,
        }

    });
   
    return OrderDetail;
  };