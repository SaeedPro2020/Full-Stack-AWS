/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_DYNAMOSTUDENTS_ARN
	STORAGE_DYNAMOSTUDENTS_NAME
	STORAGE_DYNAMOSTUDENTS_STREAMARN
Amplify Params - DO NOT EDIT */ const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const dynamodb = new AWS.DynamoDB.DocumentClient()

let tableName = 'dynamoStudents-fullstack'

/************************************
 * Random number *
 *************************************/
const minNumber = 1
const maxNumber = 100000

// Function to generate a random number within a range
function generateRandomNumber(min, max) {
  // Calculate the range and add 1 to include the maximum value
  const range = max - min + 1
  // Generate a random number using Math.random()
  const randomNumber = Math.floor(Math.random() * range) + min

  return randomNumber
}

/************************************
 * Validate data for DB *
 *************************************/
function validation(data) {
  const result = []
  const badItems = []

  // const objectsToRead = data.slice(0, 9)

  data?.map((item) => {
    if (!item.hasOwnProperty('SubmittedAnswerId')) {
      badItems.push(item)
      item.SubmittedAnswerId = generateRandomNumber(minNumber, maxNumber)
    } else {
      if (
        typeof item.SubmittedAnswerId != 'number' ||
        item.SubmittedAnswerId == undefined ||
        item.SubmittedAnswerId == null
      ) {
        item.SubmittedAnswerId = generateRandomNumber(minNumber, maxNumber)
      }
    }
    result.push(item)
  })
  return result
}

/************************************
 * READ FROM work.json *
 *************************************/
const readFileFromS3 = async () => {
  // prettier-ignore
  const params = {
    Bucket: 'students111128-fullstack',
    Key: 'work.json'
  }

  try {
    const data = await s3.getObject(params).promise()
    const jsonData = JSON.parse(data.Body.toString())
    // const objectsToRead = jsonData.slice(0, 9)
    // console.log(jsonData) // Print the JSON data to the console or perform further operations
    return jsonData
  } catch (error) {
    console.error('Error reading file:', error)
  }
}

/************************************
 * Write into DB when an Excel file with the name "work.csv" (key) is added *
 *************************************/
exports.handler = async function (event) {
  console.log('Received S3 event:', JSON.stringify(event, null, 2))
  const bucket = event.Records[0].s3.bucket.name
  const key = event.Records[0].s3.object.key
  console.log(`Bucket: ${bucket}`, `Key: ${key}`)

  /************************************
   * Write into DB when an Json file with the name "work.json" (key) is added *
   *************************************/
  if (key === 'work.json' && bucket === 'students111128-fullstack') {
    //Read from file first 10 objects.
    const jsonData = await readFileFromS3()
    // console.log('CHECK VALUE OF FIRST BATCH: ', firstBatch)

    const validatedData = validation(jsonData)

    console.log('VALIDATE DATA: ', validatedData)

    const insertPromises = []

    await new Promise(() => {
      validatedData?.forEach((row) => {
        const putParams = {
          TableName: tableName,
          Item: row,
        }
        insertPromises.push(dynamodb.put(putParams).promise())
      })
    })
    await Promise.all(insertPromises)
  }
}
