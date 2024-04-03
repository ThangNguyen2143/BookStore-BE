module.exports = (sequelize, DataTypes) => {
    const Publicshing = sequelize.define("Publicshing", {
      publicshing_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      publicshing_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      publicshing_hotline: {
        type: DataTypes.STRING,
      }
    });
    return Publicshing;
  };