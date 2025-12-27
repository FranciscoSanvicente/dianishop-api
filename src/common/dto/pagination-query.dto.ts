import { Type } from "class-transformer";
import { IsInt, IsOptional, Min, Max } from "class-validator";
import { APP_CONSTANTS } from "../constants/app.constants";

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = APP_CONSTANTS.PAGINATION.DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(APP_CONSTANTS.MAX_LIMIT)
  limit?: number = APP_CONSTANTS.DEFAULT_LIMIT;
}
