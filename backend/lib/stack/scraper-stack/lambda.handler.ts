import { load } from "cheerio";
import {
  BatchWriteItemCommand,
  DynamoDB,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import { Category } from "../../core/model/category";
import { Measurement } from "../../core/model/measurement";

const DEVBG_URL = "https://dev.bg";
const DEVBG_REMOTE_URL = "https://dev.bg/remote";
var dynamodb = new DynamoDB({ apiVersion: "2012-08-10" });

const fetchPositions = async (url: string) => {
  const html = await fetch(url).then((response) => response.text());

  const $ = load(html);
  const categories = $(".category-name");

  const map = new Map<string, number>();

  categories.each((_, element) => {
    const key = $(element).contents().first().text().trim();
    const value = $(element).children().first().text().trim();
    map.set(key, parseInt(value));
  });

  return map;
};

const fetchCategories = async (): Promise<Category[]> => {
  const command = new QueryCommand({
    TableName: process.env.dbStore,
    IndexName: process.env.categoriesGSI,
    KeyConditionExpression: "record_type = :v1",
    ExpressionAttributeValues: {
      ":v1": {
        S: Category.TYPE,
      },
    },
  });
  const response = await dynamodb.send(command);

  const allCategories = response.Items ?? [];

  return allCategories.map((data) => {
    return Category.fromDynamoDb(data);
  });
};

export const handler = async () => {
  // fetch all positions
  const allPositions = await fetchPositions(DEVBG_URL);
  console.log("allPositions", allPositions);

  // fetch remote positions
  const remotePositions = await fetchPositions(DEVBG_REMOTE_URL);
  console.log("remotePositions", remotePositions);

  const positions: Map<string, { all: number; remote: number }> = new Map();
  allPositions.forEach((value, key) => {
    const remote = remotePositions.get(key) ?? 0;
    positions.set(key, { all: value, remote: remote });
  });

  // fetch all categories
  let categories = await fetchCategories();
  console.log("currentCategories", categories);

  // check if map contains new categories
  const newCategories: string[] = [];
  const categoryNames = categories.flatMap((c) => c.name);
  positions.forEach((_, category) => {
    if (!categoryNames.includes(category)) {
      newCategories.push(category);
    }
  });

  console.log("newCategories", newCategories);

  // create new categories if any
  const categoryItems = newCategories.map((name) => {
    const category = new Category(uuidv4(), name);
    return category.toDynamoDb();
  });

  if (categoryItems.length) {
    const newCategoriesCommand = new BatchWriteItemCommand({
      RequestItems: {
        DbStore: categoryItems.map((item) => {
          return {
            PutRequest: {
              Item: item,
            },
          };
        }),
      },
    });

    await dynamodb.send(newCategoriesCommand);

    categories = await fetchCategories();
  }

  // insert records for the current day
  let today = new Date();
  const currentDate = today.toISOString().split("T")[0];
  const items: any[] = [];
  positions.forEach((value, key) => {
    const category = categories.find((c) => c.name === key);
    if (!category) {
      return;
    }

    const measurement = new Measurement(
      category.id,
      currentDate,
      value.all,
      value.remote
    );

    items.push(measurement.toDynamoDb());
  });

  const batchCommand = new BatchWriteItemCommand({
    RequestItems: {
      DbStore: items.map((item) => {
        return {
          PutRequest: {
            Item: item,
          },
        };
      }),
    },
  });

  const response = await dynamodb.send(batchCommand);
};
