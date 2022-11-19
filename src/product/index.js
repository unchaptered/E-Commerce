// Lib Dependency
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { GetItemCommand, ScanCommand, PutItemCommand, DeleteItemCommand, UpdateItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");

const { v4: uuidv4 } = require('uuid');

// Custom Dependency
const { ddbClient } = require("./ddbClient");

/**
 * If you open the index.js, we can see that our number lambda handle method stored in these index.js file. <br>
 * And we can start our actual businessl ogic into the index.js as know that index.js includes a lambda function hnalde method. <br>
 * And we have verified that this handle method invoked by the API Gateway.
 * 
 * So if you remember our architecture, we are going to implement synchronous, Serverless cloud performance.
 */
exports.handler = async function (event) {
	console.log('request:', JSON.stringify(event, undefined, 2));

	/**
	 * TODO - switch case event.httpMethod to perform CRUD operations with using ddbClient object
	 */
	switch (event.httpMethod) {
		case 'GET':
			if (event.queryStringParameters !== null) {

				/** GET product/1234?category=Phone */
				body = await getProductByCategory(event);

			} else if (event.pathParameters !== null) {

				/** GET product/{id} */
				body = await getProduct(event.pathParameters.id);

			} else {

				/** GET product */
				body = await getAllProducts();

			}
			break;

		case 'POST':

			body = await createProduct(event);
			break;

		case 'DELETE':

			/** DELETE product/{id} */
			body = await deleteProduct(event.pathParameters.id);
			break;

		case 'PUT':

			/** PUT product/{id} */
			body = await updateProduct(event);
			break;

		default:
			throw new Error(`Unsupported route: "${event.httpMethod}"`);
	}

	console.log(body);

	return {
		status: 200,
		headers: { 'Content-Type': 'text/plain' },
		body: `Helllo from Product! You've hit ${event.path}`,
	};
};


/**
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/getitemcommand.html
 */
const getProduct = async (productId) => {

	console.log(`getProduct function. productId : "${productId}"`);

	try {

		/** @type { import("@aws-sdk/client-dynamodb").GetItemCommandInput } */
		const params = {
			TableName: process.env.DYNAMODB_TABLE_NAME,
			Key: marshall({ id: productId })
		};
		const { Item } = await ddbClient.send(new GetItemCommand(params));

		return (Item) ? unmarshall(Item) : {};

	} catch (e) {
		console.log(e);
		throw e;
	}
}

/**
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/querycommand.html
 */
const getProductByCategory = async (event) => {

	console.log(`getProductByCategory function. event "${event}"`);

	try {

		const productId = event.pathParameters.id;
		const category = event.queryStringParameters.category;

		/** @type { import("@aws-sdk/client-dynamodb").QueryCommandInput } */
		const params = {
			TableName: process.env.DYNAMODB_TABLE_NAME,
			KeyConditionExpression: 'id = :productId',
			FilterExpression: 'contains (category, :category)',
			ExpressionAttributeValues: {
				':productId': { S: productId },
				':category': { S: category }
			}
		};
		const { Items } = await ddbClient.send(new QueryCommand(params));

		return Items.map((item) => unmarshall(item));

	} catch (e) {
		console.log(e);
		throw e;
	}
}

/**
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/scancommand.html
 */
const getAllProducts = async () => {

	console.log('getAllProducts');

	try {

		/** @type { import("@aws-sdk/client-dynamodb").ScanCommandInput } */
		const params = {
			TableName: process.env.DYNAMODB_TABLE_NAME,
			Limit: 10
		};
		const { Items } = await ddbClient.send(new ScanCommand(params));

		return (Items) ? Items.map((item) => unmarshall(item)) : {};

	} catch (e) {
		console.log(e);
		throw e;
	}
}

/**
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/putitemcommand.html
 */
const createProduct = async (event) => {

	console.log(`createProduct function. event : "${event}"`);

	try {
		const parsedBody = {
			...JSON.parse(event.body),
			id: uuidv4()
		};

		/** @type { import("@aws-sdk/client-dynamodb").PutItemCommandInput} */
		const params = {
			TableName: process.env.DYNAMODB_TABLE_NAME,
			Item: marshall(parsedBody)
		}
		const createResult = await ddbClient.send(new PutItemCommand(params));

		return createResult;

	} catch (e) {
		console.log(e);
		throw e;
	}
}

/**
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/deleteitemcommand.html
 */
const deleteProduct = async (productId) => {

	console.log(`deleteProduct function. productId : "${productId}"`);

	try {

		/** @type { import("@aws-sdk/client-dynamodb").DeleteItemCommandInput } */
		const params = {
			TableName: productId.env.DYNAMODB_TABLE_NAME,
			Key: marshall({ id: productId })
		};
		const deleteResult = await ddbClient.send(new DeleteItemCommand(params));

		return deleteResult;
	} catch (e) {
		console.log(e);
		throw e;
	}
}

/**
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/updateitemcommand.html
 */
const updateProduct = async (event) => {

	console.log(`updateProduct function. event : "${productId}"`);

	try {

		const parsedBody = JSON.parse(event.body);
		const objKeys = Object.keys(parsedBody);

		console.log(`updateProduct function. parsedBody : "${parsedBody}", objKeys: "${objKeys}"`);

		/** @type { import("@aws-sdk/client-dynamodb").UpdateItemCommandInput} */
		const params = {
			TableName: process.env.DYNAMODB_TABLE_NAME,
			Key: marshall({ id: event.pathParameters.id }),
			UpdateExpression: `SET ${objKeys.map(
				(_, index) => `#key${index} = :value=${index}`
			).join(',')}`,
			ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
				...acc,
				[`#key${index}`]: parsedBody[key]
			}), {}),
			ExpressionAttributeValues: objKeys.reduce((acc, key, index) => ({
				...acc,
				[`:value${index}`]: parsedBody[key]
			}), {})
		};

		const updateResult = await ddbClient.send(new UpdateItemCommand(params));

		return updateResult;

	} catch (e) {
		console.log(e);
		throw e;
	}
}