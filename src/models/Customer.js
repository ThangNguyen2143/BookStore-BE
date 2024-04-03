module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define("Customer", {
      custom_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year_of_birth: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_card: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      state_account: {
        type: DataTypes.STRING
      }
    });
    Customer.associate = module =>{
      Customer.belongsTo(module.User)
    }
    return Customer;
  };