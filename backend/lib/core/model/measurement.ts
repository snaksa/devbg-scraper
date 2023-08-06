import { AttributeValue } from "@aws-sdk/client-dynamodb";

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
        S: `CATEGORY#${this.categoryId}`,
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
    const categoryId = data?.pk?.S?.split("#")[1];
    console.log(data);
    return new Measurement(
      categoryId ?? "",
      data?.sk?.S ?? "",
      parseInt(data?.positions?.N ?? "0"),
      parseInt(data?.remote?.N ?? "0")
    );
  }
}
