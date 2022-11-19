// Lib Dependency
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

/**
 * Section 19 - 124 Developing Product Lambda Micorservice with DynamoDb Client - AWS SDK for JS v3
 * 
 * So, we have created DynamoDB Client is a Node.js module.<br>
 * Because the connection management will be handled in one time for lambda exectuion.
 * 
 * And this is the best practice when creating database connection.<br>
 * It should be outside of the lambda handle method.<br>
 * By this way, it reduce concurrency, and of course it is to pay as you go costing model and decreases dramatically to execution time and so on.
 * Lots of import lots of benefits by using these modules outside of our lambda function.
 */
const ddbClient = new DynamoDBClient();

export { ddbClient };

/**
 * Section 19 - 127 Understanding DynamoDB Interactions - Working with items and Attirbutes
 * 
 * Official docs - https://docs.aws.amazon.com/ko_kr/amazondynamodb/latest/developerguide/WorkingWithItems.html
 */