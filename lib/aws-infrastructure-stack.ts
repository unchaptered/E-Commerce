import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { ApiGatewayConstruct } from './api-gateway';
import { DynamoDBConstruct } from './dynamodb-construct';
import { MicroservicesConstruct } from './microservices-construct';

export class AwsInfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dynamoDB = new DynamoDBConstruct(this, 'DynamoDatabaseConstruct');

    const microservices = new MicroservicesConstruct(this, 'MicroservicesConstruct', {
      productTable: dynamoDB.productTable
    });

    const apiGateway = new ApiGatewayConstruct(this, 'ApiGatewayConstruct', {
      productMicroservice: microservices.productMicroservice
    });

  }
}
