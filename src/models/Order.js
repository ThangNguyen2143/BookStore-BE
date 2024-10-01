module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("Order", {
      address_receive: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state_order:{ //active, pending, success, done
        type: DataTypes.STRING,
        allowNull: false,
      },
      summary: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
    });
    Order.associate = module =>{
      Order.belongsToMany(module.Product, {
        through: module.OrderDetail,
      })
      Order.belongsTo(module.Staff)
      Order.belongsTo(module.Customer)
    }
    return Order;
  };