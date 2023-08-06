#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ScraperStack } from "../lib/stack/scraper-stack/scraper-stack";
import { StorageStack } from "../lib/stack/storage-stack/storage-stack";
import { ApiStack } from "../lib/stack/api-stack/api-stack";

const app = new cdk.App();
const storageStack = new StorageStack(app, "DevbgStorageStack");

const scraperStack = new ScraperStack(app, "DevbgScraperStack", {
  dbStore: storageStack.dbStore,
}).addDependency(storageStack);

const apiStack = new ApiStack(app, "DevbgApiStack", {
  dbStore: storageStack.dbStore,
}).addDependency(storageStack);
