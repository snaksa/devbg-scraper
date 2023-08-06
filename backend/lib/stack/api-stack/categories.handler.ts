import { DynamoDB, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Category } from "../../core/model/category";
var dynamodb = new DynamoDB({ apiVersion: "2012-08-10" });

const fetchCategories = async (): Promise<Category[]> => {
  const command = new QueryCommand({
    TableName: "DbStore",
    IndexName: "CategoriesGSI",
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

export const handler = async (event: any) => {
  let categories: Category[] = await fetchCategories();

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: categories,
    }),
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
    },
  };
};
