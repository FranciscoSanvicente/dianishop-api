import { Table, Model, Column, HasMany } from "sequelize-typescript";
import { Product } from "../../products/entities/product.entity";

interface BrandCreationAttrs {
  name: string;
}

@Table({ tableName: "brands", timestamps: false })
export class Brand extends Model<Brand, BrandCreationAttrs> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ allowNull: false })
  declare name: string;

  // Asociaciones
  @HasMany(() => Product)
  products: Product[];
}
