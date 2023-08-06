import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

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

    const statsHandler = new NodejsFunction(
      this,
      "DevbgScraper-RestApi-Stats-GET",
      {
        entry: path.resolve(__dirname, "./stats.handler.ts"),
      }
    );

    dbStore.grantReadData(statsHandler);

    singleCategoryResource.addMethod(
      "GET",
      new LambdaIntegration(statsHandler)
    );

    const categoriesResource = apiGateway.root.addResource("categories", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ["*"],
        disableCache: true,
      },
    });

    const categoriesHandler = new NodejsFunction(
      this,
      "DevbgScraper-RestApi-Categories-GET",
      {
        entry: path.resolve(__dirname, "./categories.handler.ts"),
      }
    );

    categoriesResource.addMethod(
      "GET",
      new LambdaIntegration(categoriesHandler)
    );

    dbStore.grantReadData(categoriesHandler);
  }
}
