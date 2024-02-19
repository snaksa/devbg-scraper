import {CfnOutput, Stack, StackProps} from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import {
  DB_STORE_CATEGORIES_GSI,
  DB_STORE_TABLE,
} from "../../core/utils/constants";
import { CategoriesLambda } from "./requests/categories";
import { StatsLambda } from "./requests/stats";

interface ApiStackProps extends StackProps {
  dbStore: Table;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { dbStore } = props;

    const apiGateway = new RestApi(this, "DevbgScraper-RestApi", {
      deploy: true,
      deployOptions: {
        stageName: "v1",
      },
    });

    const statsResource = apiGateway.root.addResource("stats", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ["*"],
        disableCache: true,
      },
    });

    const singleCategoryResource = statsResource.addResource("{id}");

    singleCategoryResource.addMethod(
      "GET",
      new LambdaIntegration(
        new StatsLambda(this, "DevbgScraper-RestApi-Stats-GET", {
          dbStore: dbStore,
        })
      )
    );

    const categoriesResource = apiGateway.root.addResource("categories", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ["*"],
        disableCache: true,
      },
    });

    categoriesResource.addMethod(
      "GET",
      new LambdaIntegration(
        new CategoriesLambda(this, "DevbgScraper-RestApi-Categories-GET", {
          dbStore: dbStore,
        })
      )
    );

    new CfnOutput(this, 'ApiGatewayUrl', { value: apiGateway.url });
  }
}
