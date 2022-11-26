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

	try {

		let resultBody;

		/**
		 * TODO - switch case event.httpMethod to perform CRUD operations with using ddbClient object
		 */
		switch (event.httpMethod) {
			case 'GET':
                
            if (event.pathParameters != null) {

					/** GET /basket/{id} */
					resultBody = await getBasket(event.pathParameters.userName);

				} else {

					/** GET /basket */
					resultBody = await getAllBaskets();

				}
				break;

			case 'POST':

                if (event.pathParameters == "/basket/checkout") {

                    /** POST /basket/checkout */
                    resultBody = await checkoutBasket(event);

                } else {

                    /** POST /basket */
                    resultBody = await createBasket(event);

                }
				break;

			case 'DELETE':

				/** DELETE /basket/{userName} */
				resultBody = await deleteBasket(event.pathParameters.userName);
				break;

			default:
				throw new Error(`Unsupported route: "${event.httpMethod}"`);
		}

		console.log('resultBody:', JSON.stringify(resultBody));

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: `Successfully finishied operation : "${event.httpMethod}"`,
				body: resultBody
			})
		};

	} catch (e) {
		console.error(e);

		return {
			statusCode: 500,
			body: JSON.stringify({
				message: JSON.stringify({
					message: "Failed to perform operation",
					errorMsg: e.message,
					errorStack: e.stack
				})
			})
		};

	}
};

/**
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/getitemcommand.html
 */
const getBasket = async (userName) => {
	console.log('getBasket');

	try {
		
		/** @type { import("@aws-sdk/client-dynamodb").GetItemCommandInput } */
		const params = {
			TableName: process.env.DYNAMODB_TABLE_NAME,
			Key: marshall({ userName: userName })
		};
		const { Item } = await ddbClient.send(new GetItemCommand(params));
		console.log('getBasket Items:', JSON.stringify(Item));

		return (Item) ? unmarshall(Item) : {};
		
	} catch(e) {
		console.error(e);
		throw e;
	}
}

/**
 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/scancommand.html
 */
const getAllBaskets = async () => {
	console.log('getAllBaskets');
	
	try {
		
		/** @type { import("@aws-sdk/client-dynamodb").ScanCommandInput } */
		const params = {
			TableName: process.env.DYNAMODB_TABLE_NAME
		};
		const { Item } = await ddbClient.send(new ScanCommand(params));
		console.log('getAllBaskets Items:', JSON.stringify(Item));

		return (Item) ? unmarshall(Item) : {};
		
	} catch(e) {
		console.error(e);
		throw e;
	}
}

const checkoutBasket = async (event) => {
	console.log('checkoutBasket');
	// implement function
}

const createBasket = async (event) => {
	console.log('createBasket');
	
	try {
		
		const parsedBody = JSON.parse(event.body);

		/** @type { import("@aws-sdk/client-dynamodb").PutItemCommandInput} */
		const params = {
			TableName: process.env.DYNAMODB_TABLE_NAME,
			Item: marshall(parsedBody || {})
		};

		const createResult = await ddbClient.send(new PutItemCommand(params));
		console.log('createBasket ddbClient Result:', JSON.stringify(createResult));

		return createResult;

	} catch(e) {
		console.error(e);
		throw e;
	}
}

const deleteBasket = async (userName) => {
	console.log('deleteBasket');
	// implement function
}