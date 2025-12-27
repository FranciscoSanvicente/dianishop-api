import { Table, Model, Column, BelongsTo } from "sequelize-typescript";
import { Order } from "./order.entity";
import { Product } from "../../products/entities/product.entity";

interface OrderProductsCreationAttrs {
  product_id: number;
  order_id: number;
  quantity: number;
  price: number;
  sub_total?: number;
}

@Table({ tableName: "order_products", timestamps: false })
export class OrderProducts extends Model<
  OrderProducts,
  OrderProductsCreationAttrs
> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ allowNull: false })
  declare product_id: number;

  @Column({ allowNull: false })
  declare order_id: number;

  @Column({ allowNull: false })
  declare quantity: number;

  @Column({ allowNull: false })
  declare price: number;

  @Column({ allowNull: true })
  declare sub_total: number;

  // Relaciones
  // @BelongsTo(() => Order, { foreignKey: "order_id", as: "order" })
  // order: Order;

  @BelongsTo(() => Product, { foreignKey: "product_id", as: "product" })
  product: Product;
}
