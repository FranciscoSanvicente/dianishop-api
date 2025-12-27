import { Table, Model, Column } from "sequelize-typescript";

interface OrderStatusCreationAttrs {
  identifier: string;
  name: string;
}

@Table({ tableName: "order_status", timestamps: false })
export class OrderStatus extends Model<OrderStatus, OrderStatusCreationAttrs> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ allowNull: false, unique: true })
  declare identifier: string;

  @Column({ allowNull: false })
  declare name: string;
}
