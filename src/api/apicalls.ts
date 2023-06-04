import {API} from 'aws-amplify'
import {responseModel} from '../app/pages/report/redux/models/StudentModel'

//************* CALLS FOR DB Students data **************/
export async function filterData(
  filterText1: string,
  filterText2: string,
  LastEvaluatedKey: string | undefined
): Promise<responseModel[]> {
  console.log('Parametr 1: ', filterText1, 'Parameter 2: ', filterText2)

  const apiName = 'apistudents'
  const path = '/items/:SubmittedAnswerId'
  const myInit = {
    queryStringParameters: {
      SubmitDateTime: filterText1,
      Subject: filterText2,
      LastEvaluatedKey: LastEvaluatedKey,
    },
  }

  try {
    const apiResponse = await API.get(apiName, path, myInit)
    console.log('Response from API: ', apiResponse)
    return apiResponse as responseModel[]
  } catch (error) {
    console.log('Error while getting data:', error)
    throw error
  }
}
