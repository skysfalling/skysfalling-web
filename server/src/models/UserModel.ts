import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import dbConfig, { sequelize } from '../models';
import { IUser } from 'shared/interfaces';

/**
 * User Model.
 * Inherits from {@linkcode IUser}
 * @link https://sequelize.org/docs/v6/other-topics/typescript/#usage
 */
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements IUser
{

  static Name: string = "User";

  // The 'declare' keyword ensures this field will not be emitted by TypeScript.
  
  // ( REQUIRED FIELDS ) ---------------- )
  declare email: string;
  declare password: string;

  // ( OPTIONAL FIELDS ) ---------------- )
  declare id: CreationOptional<number>;
  declare name: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

}

/**
 * Initialize the UserModel.
 * @link https://sequelize.org/docs/v6/core-concepts/model-basics/#model-definition
 */
User.init(
  {
    id: {
      type: DataTypes.UUID,
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
    modelName: User.Name,
    tableName: 'users',
  }
);

export default User;