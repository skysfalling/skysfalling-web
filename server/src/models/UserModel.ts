import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import db, { sequelize } from '../models';
import { IUser } from 'shared/interfaces';

/**
 * User Model.
 * Inherits from {@linkcode IUser}
 * @link https://sequelize.org/docs/v6/other-topics/typescript/#usage
 */
class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>>
  implements IUser
{
  declare id: number; // The 'declare' keyword ensures this field will not be emitted by TypeScript.
  declare name: string;
  declare email: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;  // Can be undefined at creation
  declare updatedAt: CreationOptional<Date>;

  static Name: string = "UserModel"
}

/**
 * Initialize the UserModel.
 * @link https://sequelize.org/docs/v6/core-concepts/model-basics/#model-definition
 */
UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelize,
    modelName: UserModel.Name,
    tableName: 'users',
  }
);

export default UserModel;