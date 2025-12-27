import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PaymentMethods } from "./entities/payment-methods.entity";

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectModel(PaymentMethods)
    private readonly paymentMethodsModel: typeof PaymentMethods,
  ) {}

  async findAll(): Promise<PaymentMethods[]> {
    return this.paymentMethodsModel.findAll();
  }

  async findOne(id: number): Promise<PaymentMethods | null> {
    return this.paymentMethodsModel.findByPk(id);
  }
}
