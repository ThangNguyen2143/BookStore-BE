module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define("Staff", {
      staff_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      staff_email:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      staff_phone:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      staff_status:{
        type: DataTypes.STRING,
      }
    });
    Staff.associate = module =>{
      Staff.belongsTo(module.User)
      Staff.belongsTo(module.Position)
    }
    return Staff;
  };