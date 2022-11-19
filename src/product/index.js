// Lib Dependency
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { GetItemCommand, ScanCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");

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
			if (event.pathParameters !== null) {
				/**
				 * GET product/{id}
				 */
				body = await getProduct(event.pathParameters.id);
			} else {
				/**
				 * GET product
				 */
				body = await getAllProducts();
			}
		case 'POST':
			body = await createProduct(event);
		default:
			throw new Error(`Unsupported route: "${event.httpMethod}"`);
	}

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

	console.log('getProduct');

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

	console.log(`createProduct function.event : "${event}"`);

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