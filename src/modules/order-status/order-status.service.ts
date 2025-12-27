import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { OrderStatus } from "./entities/order-status.entity";

@Injectable()
export class OrderStatusService {
  constructor(
    @InjectModel(OrderStatus)
    private readonly orderStatusModel: typeof OrderStatus,
  ) {}

  async findAll(): Promise<OrderStatus[]> {
    return this.orderStatusModel.findAll();
  }

  async findOne(id: number): Promise<OrderStatus | null> {
    return this.orderStatusModel.findByPk(id);
  }
}
