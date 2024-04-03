module.exports = (sequelize, DataTypes) => {
    const Receipt = sequelize.define("Receipt", {
      collaboration:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      summary: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
    });
    Receipt.associate = module =>{
      Receipt.belongsToMany(module.Product, {
        through: module.ReceiptDetail,
      })
      Receipt.belongsTo(module.Staff)
    }
    return Receipt;
  };