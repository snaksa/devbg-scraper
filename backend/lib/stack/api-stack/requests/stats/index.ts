import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";
import { DB_STORE_TABLE } from "../../../../core/utils/constants";
import { Table } from "aws-cdk-lib/aws-dynamodb";

interface StatsLambdaProps {
  dbStore: Table;
}

export class StatsLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: StatsLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./handler.ts"),
      environment: {
        dbStore: DB_STORE_TABLE,
      },
    });

    props.dbStore.grantReadData(this);
  }
}
