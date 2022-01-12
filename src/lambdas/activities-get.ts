/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */
import * as aws from '@pulumi/aws';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler: aws.lambda.EventHandler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event
) => {
  const pathParameters = event.pathParameters;
  const body = event.body ? JSON.parse(event.body) : undefined;
  const queryStringParams = event.multiValueQueryStringParameters;

  console.log('Received body: ', body);
  console.log('Received pathParameters: ', pathParameters);

  await Promise.resolve(() => {
    console.log('promise resolved');
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Nice job, you've done it! :D",
      body,
      pathParameters,
      queryStringParams,
      event,
    }),
  };
};
