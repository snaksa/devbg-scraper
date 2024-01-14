#!/usr/bin/env node
import "source-map-support/register";
import * as dotenv from "dotenv";
import * as path from "path";
import * as cdk from "aws-cdk-lib";
import { ScraperStack } from "../lib/stack/scraper-stack/scraper-stack";
import { StorageStack } from "../lib/stack/storage-stack/storage-stack";
import { ApiStack } from "../lib/stack/api-stack/api-stack";
import { FrontendStack } from "../lib/stack/frontend-stack/frontend-stack";

dotenv.configDotenv({ path: path.resolve(__dirname, "../.env") });

const account = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: "us-east-1",
};

const app = new cdk.App();

const storageStack = new StorageStack(app, "DevbgStorageStack", {
  env: account,
});

const scraperStack = new ScraperStack(app, "DevbgScraperStack", {
  dbStore: storageStack.dbStore,
  env: account,
});
scraperStack.addDependency(storageStack);

const apiStack = new ApiStack(app, "DevbgApiStack", {
  dbStore: storageStack.dbStore,
  env: account,
});
apiStack.addDependency(storageStack);

new FrontendStack(app, "DevbgFrontendStack", { env: account });
