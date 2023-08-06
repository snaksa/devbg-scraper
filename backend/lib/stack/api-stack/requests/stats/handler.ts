import {
  DynamoDB,
  GetItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { Measurement } from "../../../../core/model/measurement";
import { Category } from "../../../../core/model/category";
var dynamodb = new DynamoDB({ apiVersion: "2012-08-10" });

const fetchMeasurements = async (
  categoryId: string
): Promise<Measurement[]> => {
  const command = new QueryCommand({
    TableName: "DbStore",
    KeyConditionExpression: "pk = :v1 AND sk < :info",
    ExpressionAttributeValues: {
      ":v1": {
        S: `${Category.TYPE}#${categoryId}`,
      },
      ":info": {
        S: "info",
      },
    },
  });
  const response = await dynamodb.send(command);

  const items = response.Items ?? [];

  return items.map((data) => {
    return Measurement.fromDynamoDb(data);
  });
};

const fetchCategory = async (categoryId: string): Promise<Category> => {
  const command = new GetItemCommand({
    TableName: "DbStore",
    Key: {
      pk: {
        S: `${Category.TYPE}#${categoryId}`,
      },
      sk: {
        S: "info",
      },
    },
  });
  const response = await dynamodb.send(command);

  return Category.fromDynamoDb(response.Item ?? {});
};

export const handler = async (event: any) => {
  const categoryId = event.pathParameters?.id ?? "";

  let measurements: Measurement[] = [];
  if (categoryId.length) {
    measurements = await fetchMeasurements(categoryId);
  }

  const category = await fetchCategory(categoryId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: {
        category: {
          id: category.id,
          name: category.name,
          measurements: measurements,
        },
      },
    }),
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
    },
  };
};
