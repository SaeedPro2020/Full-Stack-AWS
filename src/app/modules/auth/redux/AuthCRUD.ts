import {Auth} from 'aws-amplify'
//
const API_URL = process.env.REACT_APP_API_URL
//Here, we created the URL for login and then perform a login request to remote server
export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`
export const LOGIN_URL = `${API_URL}/login`
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`

export async function login(email: string, password: string) {
  try {
    const user = await Auth.signIn(email, password)
    return user
  } catch (error) {
    console.log('error sign in', error)
  }
}

// For register Players
export async function register(password: string, email: string) {
  const username = email

  const myUser = Auth.signUp({
    username,
    password,
    attributes: {
      email,
    },
  })
  console.log('User sign up Called')
  return (await myUser).userSub
}

export async function confirmSignUp(username: string, code: string) {
  try {
    await Auth.confirmSignUp(username, code)
  } catch (error) {
    console.log('error confirming sign up', error)
  }
}

export function authCurrentUser(): Boolean {
  try {
    Auth.currentAuthenticatedUser()
    return true
  } catch {
    return false
  }
}

export async function getAttributes() {
  try {
    const currentUser = await Auth.currentAuthenticatedUser()
    return currentUser.attributes
  } catch (error) {
    console.log('error sign in', error)
  }
}

export async function forgetPass(username: string) {
  // Send confirmation code to user's email
  Auth.forgotPassword(username)
    .then()
    .catch((err) => console.log(err))
}

export async function collectNewPass(username: string, code: string, new_password: string) {
  // Collect confirmation code and new password, then
  Auth.forgotPasswordSubmit(username, code, new_password)
    .then()
    .catch((err) => console.log(err))
}

export async function getSub() {
  const user = await Auth.currentAuthenticatedUser()
  const subId = user.attributes.sub
  return subId
}

// export async function deleteCognitoUser() {

//     const user = await Auth.currentAuthenticatedUser();
//     user.deleteUser((error, data) => {
//       if (error) {
//         throw error;
//       }
//     // do stuff after deletion
//     });

// }
