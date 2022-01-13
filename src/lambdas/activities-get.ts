/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */
import * as aws from '@pulumi/aws';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as awsSdk from 'aws-sdk';

export const getActivities: aws.lambda.EventHandler<APIGatewayProxyEvent, APIGatewayProxyResult> =
  async (event) => {
    const pathParameters = event.pathParameters;
    const body = event.body ? JSON.parse(event.body) : undefined;
    const queryStringParams = event.multiValueQueryStringParameters;

    const sm = new awsSdk.SecretsManager({ region: 'eu-west-1' });

    const { SecretString } = await sm.getSecretValue({ SecretId: 'ContentStackTokens' }).promise();

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
        SecretString,
      }),
    };
  };

const lambdaRole = new aws.iam.Role('iamForLambda', {
  assumeRolePolicy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Sid: '',
        Principal: {
          Service: 'lambda.amazonaws.com',
        },
      },
    ],
  }),
  managedPolicyArns: [
    'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
    'arn:aws:iam::aws:policy/SecretsManagerReadWrite',
  ],
});

export const getActivitiesLambda = new aws.lambda.CallbackFunction('get-activities-lambda', {
  callback: getActivities,
  role: lambdaRole,
});
