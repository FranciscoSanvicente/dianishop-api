import { Table, Model, Column } from "sequelize-typescript";

interface PaymentMethodsCreationAttrs {
  identifier: string;
  name: string;
}

@Table({ tableName: "payment_methods", timestamps: false })
export class PaymentMethods extends Model<
  PaymentMethods,
  PaymentMethodsCreationAttrs
> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ allowNull: false, unique: true })
  declare identifier: string;

  @Column({ allowNull: false })
  declare name: string;
}
