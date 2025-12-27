import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Product } from "./product.entity";
import { SizeImages } from "../../upload/entities/size-images.entity";

interface ProductImagesCreationAttrs {
  product_id: number;
  url: string;
  size_id: string;
  public_id: string;
}

@Table({ tableName: "product_images", timestamps: true })
export class ProductImages extends Model<
  ProductImages,
  ProductImagesCreationAttrs
> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => Product)
  @Column({ allowNull: false })
  product_id: number;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  url: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  size_id: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  public_id: string;

  // Relaciones
  @BelongsTo(() => Product, { foreignKey: "product_id", as: "product" })
  product: Product;

  // Nota: No podemos usar @BelongsTo con SizeImages porque size_id ahora es un string único
  // en lugar de un ID numérico que apunte a la tabla size_images
  // size: SizeImages;

  // Timestamps automáticos
  declare createdAt: Date;
  declare updatedAt: Date;
}
