// Lib Dependency
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { GetItemCommand, GetItemCommandInput } = require("@aws-sdk/client-dynamodb");

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
	}

	return {
		status: 200,
		headers: { 'Content-Type': 'text/plain' },
		body: `Helllo from Product! You've hit ${event.path}`,
	};
};


const getProduct = async (productId) => {

	console.log('getProduct');

	try {

		/** @type { GetItemCommandInput } */
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