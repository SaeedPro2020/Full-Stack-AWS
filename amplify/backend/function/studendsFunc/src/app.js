/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_DYNAMOSTUDENTS_ARN
	STORAGE_DYNAMOSTUDENTS_NAME
	STORAGE_DYNAMOSTUDENTS_STREAMARN
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
	API_APISTUDENTS_APIID
	API_APISTUDENTS_APINAME
	ENV
	*REGION
	STORAGE_studentSIMG_BUCKETNAME
Amplify Params - DO NOT EDIT */ /*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')

AWS.config.update({region: process.env.TABLE_REGION})

const dynamodb = new AWS.DynamoDB.DocumentClient()

let tableName = 'dynamoStudents-fullstack'
if (process.env.ENV && process.env.ENV !== 'NONE') {
  tableName = tableName + '-' + process.env.ENV
}

const userIdPresent = false // TODO: update in case is required to use that definition
const partitionKeyName = 'SubmittedAnswerId'
const partitionKeyType = 'N'
const sortKeyName = ''
const sortKeyType = ''
const hasSortKey = sortKeyName !== ''
const path = '/items'
const UNAUTH = 'UNAUTH'
const hashKeyPath = '/:' + partitionKeyName
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : ''

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case 'N':
      return Number.parseInt(param)
    default:
      return param
  }
}

/********************************
 * Convert date to previous week *
 ********************************/

function getOneWeekAgoDate(dateString) {
  const date = new Date(dateString)
  date.setDate(date.getDate() - 7)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  const result = `${year}-${month}-${day}`

  return result
}

/********************************
 *Prepare response for first batch of items*
 ********************************/

function CalcOurResponse(data1, data2) {
  let ourResponse = []
  // Extract userIds and current progress in "data1" and put them in an array (userIdsSlice)
  const extractedArray = data1.map(({UserId, Progress}) => ({UserId, Progress}))

  let progressPreviousWeek = []

  for (let i = 0; i < extractedArray.length; i++) {
    const filteredData = data2.filter((obj) => obj.UserId === extractedArray[i].UserId)
    progressPreviousWeek = filteredData.map((obj) => obj.Progress)

    const findMax = Math.max(...progressPreviousWeek)

    const ourModel = {
      Progress: extractedArray[i].Progress,
      MaxProgressWeekAgo: findMax,
      UserId: extractedArray[i].UserId,
    }

    ourResponse.push(ourModel)
  }

  return ourResponse
}

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path + hashKeyPath, async function (req, res) {
  const condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ',
  }

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH,
    ]
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [
        convertUrlType(req.params[partitionKeyName], partitionKeyType),
      ]
    } catch (err) {
      res.statusCode = 500
      res.json({error: 'Wrong column type ' + err})
    }
  }

  // Extract query parameters from the event object
  const subject = req.apiGateway.event.queryStringParameters.Subject
  const submitDateTime = req.apiGateway.event.queryStringParameters.SubmitDateTime

  const previousWeekDate = getOneWeekAgoDate(submitDateTime)

  const queryParams = {
    TableName: tableName,
    FilterExpression:
      'contains(Subject, :subject) AND begins_with(SubmitDateTime, :submitDateTime)',
    ExpressionAttributeValues: {
      ':subject': subject,
      ':submitDateTime': submitDateTime,
    },
  }

  const queryParams2 = {
    TableName: tableName,
    FilterExpression:
      'contains(Subject, :subject) AND begins_with(SubmitDateTime, :submitDateTime)',
    ExpressionAttributeValues: {
      ':subject': subject,
      ':submitDateTime': previousWeekDate,
    },
  }

  let lastEvaluatedKey = req.apiGateway.event.queryStringParameters.LastEvaluatedKey
  // console.log("OUR queryStringParameters FROM FRONT-END: ", queryStringParameters.LastEvaluatedKey);
  if (lastEvaluatedKey !== undefined || lastEvaluatedKey !== null || lastEvaluatedKey !== '') {
    try {
      queryParams.ExclusiveStartKey = JSON.parse(lastEvaluatedKey)
    } catch (error) {
      console.error('Error parsing LastEvaluatedKey:', error)
    }
  } else {
    queryParams.ExclusiveStartKey = {} // Provide an empty object as a fallback
  }

  const queryResult = await dynamodb.scan(queryParams).promise()
  const queryResult2 = await dynamodb.scan(queryParams2).promise()

  let items = queryResult.Items
  lastEvaluatedKey = queryResult.LastEvaluatedKey

  let items2 = queryResult2.Items
  let lastEvaluatedKey2 = queryResult2.LastEvaluatedKey

  // Retrieve all items related to previous week
  while (lastEvaluatedKey2) {
    queryParams2.ExclusiveStartKey = lastEvaluatedKey2
    const nextResult2 = await dynamodb.scan(queryParams2).promise()
    items2 = items2.concat(nextResult2.Items)
    lastEvaluatedKey2 = nextResult2.LastEvaluatedKey
  }

  const finalResp = CalcOurResponse(items, items2)

  const resAndKey = {
    items: finalResp,
    LastEvaluatedKey: lastEvaluatedKey ? JSON.stringify(lastEvaluatedKey) : null,
  }

  console.log('OUR FINAL RESPONSE: ', resAndKey)

  res.json(resAndKey)

  // return {
  //   statusCode: 200,
  //   body: JSON.stringify({ message: 'Data inserted successfully' }),
  // };
})

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  const params = {}
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH
  } else {
    params[partitionKeyName] = req.params[partitionKeyName]
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType)
    } catch (err) {
      res.statusCode = 500
      res.json({error: 'Wrong column type ' + err})
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType)
    } catch (err) {
      res.statusCode = 500
      res.json({error: 'Wrong column type ' + err})
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params,
  }

  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({error: 'Could not load items: ' + err.message})
    } else {
      if (data.Item) {
        res.json(data.Item)
      } else {
        res.json(data)
      }
    }
  })
})

/************************************
 * HTTP put method for insert object *
 *************************************/

app.put(path, function (req, res) {
  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body,
  }
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({error: err, url: req.url, body: req.body})
    } else {
      res.json({success: 'put call succeed!', url: req.url, data: data})
    }
  })
})

/************************************
 * HTTP post method for insert object *
 *************************************/
app.post(path, async function (req, res) {
  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH
  }
})

/**************************************
 * HTTP remove method to delete object *
 ***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  const params = {}
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH
  } else {
    params[partitionKeyName] = req.params[partitionKeyName]
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType)
    } catch (err) {
      res.statusCode = 500
      res.json({error: 'Wrong column type ' + err})
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType)
    } catch (err) {
      res.statusCode = 500
      res.json({error: 'Wrong column type ' + err})
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params,
  }
  dynamodb.delete(removeItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({error: err, url: req.url})
    } else {
      res.json({url: req.url, data: data})
    }
  })
})

app.listen(3000, function () {
  console.log('App started')
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
