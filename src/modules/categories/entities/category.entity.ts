import { Table, Model, Column, HasMany } from "sequelize-typescript";

interface CategoryCreationAttrs {
  name: string;
  slug?: string;
  image?: string;
}

@Table({ tableName: "categories", timestamps: false })
export class Category extends Model<Category, CategoryCreationAttrs> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: true })
  declare slug: string;

  @Column({ allowNull: true })
  declare image: string;
}
