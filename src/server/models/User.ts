import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';
import { Role } from '../../types.js';

export class User extends Model {
  declare id: number;
  declare username: string;
  declare password: string;
  declare role: string; // new field for user role
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  role: {
    type: DataTypes.ENUM(Role.USER.toString(), Role.ADMIN.toString()),
    defaultValue: Role.USER.toString(),
  }
}, {
  sequelize,
  modelName: 'User'
});
