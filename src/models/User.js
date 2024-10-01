
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },{timestamps: false});
    User.associate = module =>{
      User.hasOne(module.Customer,{
        foreignKey: 'id',
        onDelete: 'CASCADE',
        as: 'user_id'
      })
    }
    
    return User;
  };