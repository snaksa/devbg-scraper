import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { Category } from "./category";

export class Measurement {
  static readonly TYPE = "MEASUREMENT";

  constructor(
    public categoryId: string,
    public date: string,
    public positions: number,
    public remote: number
  ) {}

  public toDynamoDb() {
    return {
      pk: {
        S: `${Category.TYPE}#${this.categoryId}`,
      },
      sk: {
        S: this.date,
      },
      record_type: {
        S: Measurement.TYPE,
      },
      positions: {
        N: this.positions.toString(),
      },
      remote: {
        N: this.remote.toString(),
      },
    };
  }

  static fromDynamoDb(data: Record<string, AttributeValue>) {
    const categoryId = data?.pk?.S?.split("#")[1] ?? "";
    const date = data?.sk?.S ?? "";
    const positions = parseInt(data?.positions?.N ?? "0");
    const remote = parseInt(data?.remote?.N ?? "0");

    return new Measurement(categoryId ?? "", date, positions, remote);
  }
}
