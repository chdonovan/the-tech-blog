const { Model, DataTypes } = require('sequelize');  
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class Blogger extends Model {
  // password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

Blogger.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 15]
      }
    }
  },
  {
    hooks: {
      async beforeCreate(newBloggerData) {
        newBloggerData.password = await bcrypt.hash(newBloggerData.password, 10);
        return newBloggerData;
      },
      async beforeUpdate(updatedBloggerData) {
        updatedBloggerData.password = await bcrypt.hash(updatedBloggerData.password, 10);
        return updatedBloggerData;
      }
    },
    sequelize,
    timestamps: false, 
    freezeTableName: true, 
    underscored: true,
    modelName: 'blogger'
  }
);

module.exports = Blogger;