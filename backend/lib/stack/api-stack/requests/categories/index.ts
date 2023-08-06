import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";
import {
  DB_STORE_CATEGORIES_GSI,
  DB_STORE_TABLE,
} from "../../../../core/utils/constants";
import { Table } from "aws-cdk-lib/aws-dynamodb";

interface CategoriesLambdaProps {
  dbStore: Table;
}

export class CategoriesLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: CategoriesLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./handler.ts"),
      environment: {
        dbStore: DB_STORE_TABLE,
        categoriesGSI: DB_STORE_CATEGORIES_GSI,
      },
    });

    props.dbStore.grantReadData(this);
  }
}
