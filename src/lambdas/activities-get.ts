/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */
import * as aws from '@pulumi/aws';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler: aws.lambda.EventHandler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event
) => {
  const route = event.pathParameters?.route;
  const body = event.body ? JSON.parse(event.body) : undefined;

  console.log('Received body: ', body);

  await Promise.resolve(() => {
    console.log('promise resolved');
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      route,
      affirmation: "Nice job, you've done it! :D",
      requestBodyEcho: body,
    }),
  };
};
