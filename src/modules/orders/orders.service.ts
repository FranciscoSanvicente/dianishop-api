import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
import { Order } from "./entities/order.entity";
import { OrderProducts } from "./entities/order-products.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import {
  FilterOrdersDto,
  OrderSortBy,
  SortOrder,
} from "./dto/filter-orders.dto";
import { Op } from "sequelize";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(OrderProducts)
    private readonly orderProductsModel: typeof OrderProducts,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    // Validar que todos los productos existan y calcular total
    let calculatedTotal = 0;
    for (const product of dto.products) {
      calculatedTotal += product.price * product.quantity;
    }

    // Verificar que el total calculado coincida con el proporcionado
    if (Math.abs(calculatedTotal - dto.total) > 0.01) {
      throw new BadRequestException(
        `El total calculado (${calculatedTotal.toFixed(2)}) no coincide con el total proporcionado (${dto.total})`,
      );
    }

    // Crear la orden con transacción
    const transaction: Transaction =
      await this.orderModel.sequelize!.transaction();

    try {
      // Crear la orden
      const order = await this.orderModel.create(
        {
          user_id: dto.user_id,
          status_id: dto.status_id,
          total: dto.total,
          payment_method_id: dto.payment_method_id,
          address: dto.address,
        },
        { transaction },
      );

      // Crear los productos de la orden solo si hay productos
      if (dto.products && dto.products.length > 0) {
        const orderProducts = dto.products.map((product) => ({
          product_id: product.product_id,
          order_id: order.id,
          quantity: product.quantity,
          price: product.price,
          // sub_total se calcula automáticamente en la base de datos
        }));

        await this.orderProductsModel.bulkCreate(orderProducts, {
          transaction,
        });
      }

      // Confirmar la transacción
      await transaction.commit();

      // Retornar la orden
      return this.findOne(order.id);
    } catch (error) {
      // Revertir la transacción en caso de error
      await transaction.rollback();
      // Error logging removed for cleaner output
      throw error;
    }
  }

  async findAll(filterDto: FilterOrdersDto): Promise<PaginatedResult<Order>> {
    const {
      page = 1,
      limit = 20,
      user_id,
      status_id,
      payment_method_id,
      minTotal,
      maxTotal,
      address,
      dateFrom,
      dateTo,
      sortBy = OrderSortBy.DATE,
      sortOrder = SortOrder.DESC,
    } = filterDto;

    // Construir condiciones WHERE
    const whereConditions: any = {};

    if (user_id) {
      whereConditions.user_id = user_id;
    }

    if (status_id) {
      whereConditions.status_id = status_id;
    }

    if (payment_method_id) {
      whereConditions.payment_method_id = payment_method_id;
    }

    if (minTotal !== undefined) {
      whereConditions.total = { ...whereConditions.total, [Op.gte]: minTotal };
    }

    if (maxTotal !== undefined) {
      whereConditions.total = { ...whereConditions.total, [Op.lte]: maxTotal };
    }

    if (address) {
      whereConditions.address = {
        [Op.iLike]: `%${address}%`,
      };
    }

    if (dateFrom || dateTo) {
      whereConditions.date = {};
      if (dateFrom) {
        whereConditions.date[Op.gte] = new Date(dateFrom);
      }
      if (dateTo) {
        whereConditions.date[Op.lte] = new Date(dateTo);
      }
    }

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Ejecutar consulta con paginación y relaciones
    const { count, rows } = await this.orderModel.findAndCountAll({
      where: whereConditions,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      distinct: true,
      include: [
        {
          association: "user",
          attributes: ["id", "email", "full_name", "phone"],
        },
        {
          association: "status",
          attributes: ["id", "identifier", "name"],
        },
        {
          association: "paymentMethod",
          attributes: ["id", "identifier", "name"],
        },
        {
          association: "products",
          include: [
            {
              association: "product",
              attributes: ["id", "name", "sku", "price"],
            },
          ],
        },
      ],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderModel.findByPk(id, {
      include: [
        {
          association: "user",
          attributes: ["id", "email", "full_name", "phone"],
        },
        {
          association: "status",
          attributes: ["id", "identifier", "name"],
        },
        {
          association: "paymentMethod",
          attributes: ["id", "identifier", "name"],
        },
        {
          association: "products",
          include: [
            {
              association: "product",
              attributes: ["id", "name", "sku", "price"],
            },
          ],
        },
      ],
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderModel.findByPk(id);

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    // Si se están actualizando productos, recalcular el total
    if (dto.products && dto.products.length > 0) {
      let calculatedTotal = 0;
      for (const product of dto.products) {
        calculatedTotal += product.price * product.quantity;
      }

      // Actualizar el total si no se proporciona explícitamente
      if (dto.total === undefined) {
        dto.total = calculatedTotal;
      } else if (Math.abs(calculatedTotal - dto.total) > 0.01) {
        throw new BadRequestException(
          `El total calculado (${calculatedTotal.toFixed(2)}) no coincide con el total proporcionado (${dto.total})`,
        );
      }
    }

    // Actualizar la orden con transacción
    const transaction: Transaction =
      await this.orderModel.sequelize!.transaction();

    try {
      console.log("🔄 Starting transaction...");

      // Preparar campos para actualización (solo los que están presentes)
      const updateFields: any = {};
      if (dto.user_id !== undefined) updateFields.user_id = dto.user_id;
      if (dto.status_id !== undefined) updateFields.status_id = dto.status_id;
      if (dto.total !== undefined) updateFields.total = dto.total;
      if (dto.payment_method_id !== undefined)
        updateFields.payment_method_id = dto.payment_method_id;
      if (dto.address !== undefined) updateFields.address = dto.address;

      console.log("📝 Fields to update:", updateFields);

      // Actualizar la orden solo si hay campos para actualizar
      if (Object.keys(updateFields).length > 0) {
        console.log("💾 Updating order fields...");
        await this.orderModel.update(updateFields, {
          where: { id },
          transaction,
        });
        console.log("✅ Order fields updated successfully");
      }

      // Si se están actualizando productos, eliminar los existentes y crear los nuevos
      if (dto.products && dto.products.length > 0) {
        console.log("🗑️ Deleting existing order products...");
        await this.orderProductsModel.destroy({
          where: { order_id: id },
          transaction,
        });
        console.log("✅ Existing order products deleted");

        const orderProducts = dto.products.map((product) => ({
          product_id: product.product_id,
          order_id: id,
          quantity: product.quantity,
          price: product.price,
          // sub_total se calcula automáticamente en la base de datos
        }));

        console.log("📦 Creating new order products:", orderProducts);
        await this.orderProductsModel.bulkCreate(orderProducts, {
          transaction,
        });
        console.log("✅ New order products created");
      }

      // Confirmar la transacción
      console.log("💾 Committing transaction...");
      await transaction.commit();
      console.log("✅ Transaction committed successfully");

      // Retornar la orden actualizada
      console.log("🔍 Fetching updated order...");
      return this.findOne(id);
    } catch (error) {
      console.log("❌ Error in update:", error);
      // Revertir la transacción en caso de error
      await transaction.rollback();
      throw error;
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const order = await this.orderModel.findByPk(id);

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    // Eliminar con transacción
    const transaction: Transaction =
      await this.orderModel.sequelize!.transaction();

    try {
      // Eliminar productos de la orden primero
      await this.orderProductsModel.destroy({
        where: { order_id: id },
        transaction,
      });

      // Eliminar la orden
      await this.orderModel.destroy({
        where: { id },
        transaction,
      });

      // Confirmar la transacción
      await transaction.commit();

      return { message: `Orden con ID ${id} eliminada exitosamente` };
    } catch (error) {
      // Revertir la transacción en caso de error
      await transaction.rollback();
      throw error;
    }
  }

  async findByUser(
    userId: number,
    filterDto: FilterOrdersDto,
  ): Promise<PaginatedResult<Order>> {
    return this.findAll({
      ...filterDto,
      user_id: userId,
    });
  }
}
