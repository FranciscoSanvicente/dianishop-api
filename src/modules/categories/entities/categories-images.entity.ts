import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Category } from "./category.entity";
import { SizeImages } from "../../upload/entities/size-images.entity";

interface CategoriesImagesCreationAttrs {
  category_id: number;
  size_id: number;
  url: string;
  public_id: string;
}

@Table({ tableName: "categories_images", timestamps: false })
export class CategoriesImages extends Model<
  CategoriesImages,
  CategoriesImagesCreationAttrs
> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => Category)
  @Column({ allowNull: false })
  category_id: number;

  @ForeignKey(() => SizeImages)
  @Column({ allowNull: false })
  size_id: number;

  @Column({ allowNull: false, type: DataType.TEXT })
  url: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  public_id: string;

  // Relaciones
  @BelongsTo(() => Category, { foreignKey: "category_id", as: "category" })
  category: Category;

  @BelongsTo(() => SizeImages, { foreignKey: "size_id", as: "size" })
  size: SizeImages;
}
