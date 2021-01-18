import postmanRunner from '../collectionRunner.js'

async function login() {
    await postmanRunner.loginWithPostman()
}

login()
