import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
} from "sequelize-typescript";
import { Brand } from "../../brands/entities/brand.entity";
import { Category } from "../../categories/entities/category.entity";

interface ProductCreationAttrs {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  stock?: number;
  sku?: string;
  categoryId: number;
  brandId: number;
}

@Table({ tableName: "products", timestamps: true })
export class Product extends Model<Product, ProductCreationAttrs> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ allowNull: false })
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @Column({ allowNull: false, type: DataType.DECIMAL(10, 2) })
  price: number;

  @Column(DataType.DECIMAL(10, 2))
  originalPrice: number;

  @Column({ type: DataType.DECIMAL(2, 1), defaultValue: 0 })
  rating: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  reviews: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  inStock: boolean;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  stock: number;

  @Column(DataType.STRING)
  sku: string;

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  categoryId: number;

  @ForeignKey(() => Brand)
  @Column(DataType.INTEGER)
  brandId: number;

  // Asociaciones
  @BelongsTo(() => Category)
  category: Category;

  @BelongsTo(() => Brand)
  brand: Brand;

  // Timestamps automáticos
  declare createdAt: Date;
  declare updatedAt: Date;
}
