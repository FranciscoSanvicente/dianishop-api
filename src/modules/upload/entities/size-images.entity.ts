import { Table, Model, Column, DataType } from "sequelize-typescript";

interface SizeImagesCreationAttrs {
  size: string;
}

@Table({ tableName: "size_images", timestamps: false })
export class SizeImages extends Model<SizeImages, SizeImagesCreationAttrs> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ allowNull: false, unique: true })
  size: string;
}
