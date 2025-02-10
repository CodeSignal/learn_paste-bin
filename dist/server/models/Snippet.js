import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index.js';
export class Snippet extends Model {
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
