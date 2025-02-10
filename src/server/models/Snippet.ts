import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';

export class Snippet extends Model {
  declare id: string;
  declare title: string;
  declare content: string;
  declare language: string;
  declare userId: number;
}

Snippet.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  language: DataTypes.STRING,
  userId: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Snippet'
});