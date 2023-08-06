import { AttributeValue } from "@aws-sdk/client-dynamodb";

export class Category {
  static readonly TYPE = "CATEGORY";

  constructor(public id: string, public name: string) {}

  public toDynamoDb() {
    return {
      pk: {
        S: `${Category.TYPE}#${this.id}`,
      },
      sk: {
        S: "info",
      },
      id: {
        S: this.id,
      },
      record_type: {
        S: Category.TYPE,
      },
      name: {
        S: this.name,
      },
    };
  }

  static fromDynamoDb(data: Record<string, AttributeValue>) {
    const id = data?.id?.S ?? "";
    const name = data?.name?.S ?? "";

    return new Category(id, name);
  }
}
