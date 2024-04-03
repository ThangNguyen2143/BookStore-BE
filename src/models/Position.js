
module.exports = (sequelize, DataTypes) => {
    
    const Position = sequelize.define("Position", {
      
      titile: {
            type: DataTypes.STRING, // ['saler','boss','admin']
            allowNull: false,
        }

    });
   
    return Position;
  };