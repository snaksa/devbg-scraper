import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

interface ScraperStackProps extends StackProps {
  dbStore: Table;
}

export class ScraperStack extends Stack {
  constructor(scope: Construct, id: string, props: ScraperStackProps) {
    super(scope, id, props);

    const { dbStore } = props;

    const scraperFunc = new NodejsFunction(this, "DevbgScraper-Lambda", {
      entry: path.resolve(__dirname, "./lambda.handler.ts"),
      timeout: Duration.seconds(15),
    });

    dbStore.grantReadWriteData(scraperFunc);

    new Rule(this, "DevbgScraper-ScheduledExecutionRule", {
      description: "Schedule a Lambda that scrapes the job board every day",
      schedule: Schedule.cron({
        minute: "0",
        hour: "13",
        day: "*",
        month: "*",
        year: "*",
      }),
      targets: [new LambdaFunction(scraperFunc)],
    });
  }
}
