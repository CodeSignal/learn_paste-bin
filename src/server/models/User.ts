import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';

export class User extends Model {
  declare id: number;
  declare username: string;
  declare password: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: DataTypes.STRING,
  password: DataTypes.STRING
}, {
  sequelize,
  modelName: 'User'
});