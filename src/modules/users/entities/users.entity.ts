import { Table, Model, Column } from "sequelize-typescript";

interface UsersCreationAttrs {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}

@Table({ tableName: "users", timestamps: false })
export class Users extends Model<Users, UsersCreationAttrs> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ allowNull: false, unique: true })
  declare email: string;

  @Column({ allowNull: false })
  declare password: string;

  @Column({ allowNull: true })
  declare full_name: string;

  @Column({ allowNull: true })
  declare phone: string;
}
