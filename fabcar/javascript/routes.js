const AuthController = require('./controllers/auth')
const UserController = require('./controllers/query')
const AddUserController = require('./controllers/invoke')

module.exports = (app) => {

	app.get('/auth-query', AuthController.EvaluateUser)

	app.get('/users', UserController.QueryAllUsers)
	app.get('/users/:id', UserController.QueryOneUser)
	app.post('/users', AddUserController.CreateUser)

	/*
		Here :id could be replaced by the client public key
		Once this key is received by express server HERE, using blockchain server private key decode it and get the user ID requested
	*/
}
