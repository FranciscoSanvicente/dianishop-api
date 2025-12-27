import { Table, Model, Column, BelongsTo, HasMany } from "sequelize-typescript";
import { Users } from "../../users/entities/users.entity";
import { OrderStatus } from "../../order-status/entities/order-status.entity";
import { PaymentMethods } from "../../payment-methods/entities/payment-methods.entity";
import { OrderProducts } from "./order-products.entity";

interface OrderCreationAttrs {
  user_id: number;
  status_id: number;
  total: number;
  date?: Date;
  payment_method_id: number;
  address?: string;
}

@Table({ tableName: "orders", timestamps: false })
export class Order extends Model<Order, OrderCreationAttrs> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ allowNull: false })
  declare user_id: number;

  @Column({ allowNull: false })
  declare status_id: number;

  @Column({ allowNull: false, type: "DOUBLE PRECISION" })
  declare total: number;

  @Column({ allowNull: false, defaultValue: () => new Date() })
  declare date: Date;

  @Column({ allowNull: false })
  declare payment_method_id: number;

  @Column({ allowNull: true })
  declare address: string;

  // Relaciones
  @BelongsTo(() => Users, { foreignKey: "user_id", as: "user" })
  user: Users;

  @BelongsTo(() => OrderStatus, { foreignKey: "status_id", as: "status" })
  status: OrderStatus;

  @BelongsTo(() => PaymentMethods, {
    foreignKey: "payment_method_id",
    as: "paymentMethod",
  })
  paymentMethod: PaymentMethods;

  @HasMany(() => OrderProducts, { foreignKey: "order_id", as: "products" })
  products: OrderProducts[];
}
