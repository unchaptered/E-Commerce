// CloudFormation Dependency
import { Construct } from 'constructs';

// CDK Dependency
import { Stack, StackProps } from 'aws-cdk-lib';

// Custom Dependencies
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

    const apiGateway = new ApiGatewayConstruct(this, 'ApiGateway', {
      productMicroservice: microservices.productMicroservice
    });
  }
}
