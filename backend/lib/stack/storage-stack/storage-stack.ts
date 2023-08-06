import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  BillingMode,
  Table,
  AttributeType,
  ProjectionType,
  ITable,
} from "aws-cdk-lib/aws-dynamodb";

export class StorageStack extends Stack {
  public dbStore: Table;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.dbStore = new Table(this, "DevbgScraper-DbStore", {
      tableName: "DbStore",
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
    });

    this.dbStore.addGlobalSecondaryIndex({
      indexName: "CategoriesGSI",
      partitionKey: { name: "record_type", type: AttributeType.STRING },
      sortKey: { name: "id", type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
