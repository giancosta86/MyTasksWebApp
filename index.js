---
---
const AUTHENTICATION_STORAGE_KEY = "user"


function setupApp(appTitle, taskServiceUrl) {
	ReactDOM.render(
		<AppScreen appTitle={appTitle} taskServiceUrl={taskServiceUrl} />,

		document.getElementById('root')
	)
}


class AppScreen extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			user: null
		}

		this.onLoginSuccess = (user, tasks) => {
			localStorage.setItem(
				AUTHENTICATION_STORAGE_KEY,
				JSON.stringify(user)
			)

			this.setState(
				{
					user: user,
					tasks: tasks,
					taskTitleToAdd: ""
				})
		}

		this.onLoginError = (errorResponse) => {
			localStorage.removeItem(AUTHENTICATION_STORAGE_KEY)

			showError(errorResponse, "Cannot log in.\n\nPlease, check your username/password and try again.")
		}


		var storedUserJSON =
			localStorage.getItem(AUTHENTICATION_STORAGE_KEY)


		if (storedUserJSON) {
			try {
				var storedUser =
					JSON.parse(storedUserJSON)

				if (storedUser) {
					login(
						props.taskServiceUrl,
						storedUser,
						this.onLoginSuccess,
						this.onLoginError
					)
				}
			} catch(err) {
				//Just do nothing
			}
		}
	}


	render() {
		if (this.state.user) {
			var totalTaskCount =
				this.state.tasks.length


			var doneTaskCount =
				this.state.tasks
					.filter(task => task.done)
					.length


			var taskItems =
				this.state.tasks
					.sort(
						_taskSorting
					)
					.map(task =>
						<TaskItem
						 	key={task.id}
							taskServiceUrl={this.props.taskServiceUrl}
							user={this.state.user}
							task={task}
							onTaskChanged={(oldTask, newTask) => {
								var newTasks =
									this.state.tasks.filter(currentTask => currentTask.id != oldTask.id)

								newTasks.push(newTask)

								newTasks.sort(_taskSorting)

								this.setState({
									tasks: newTasks
								})
							}}
							onTaskRemoved={() => {
								var filteredTasks =
									this.state.tasks.filter(currentTask => currentTask.id != task.id)

								this.setState({
									tasks: filteredTasks
								})
							}}
							/>)

			return (
				<div className="workArea">
					<div className="header">
						<h1>{this.props.appTitle}</h1>

						<div className="globalInfoBox">
							<div className="infoBox">
								<label>User:</label>
								<span>{this.state.user.name}</span>
							</div>

							<div className="infoBox">
								<label>Tasks:</label>
								<span>{doneTaskCount} / {totalTaskCount}</span>
							</div>

							<button onClick={
								() => {
									localStorage.removeItem(AUTHENTICATION_STORAGE_KEY);

									this.setState((state) => ({ user: null }));
								}
							}>Logout</button>
						</div>
					</div>

					<div className="tasksArea">
						<div className="newTaskBox">
							<label className="newTaskLabel">New task:</label><input type="text"
								value={this.state.taskTitleToAdd}
								onChange={
									event => this.setState({
										taskTitleToAdd: event.target.value
									})
								}
								/>

								<button className="addButton" disabled={!this.state.taskTitleToAdd} onClick={() => addTask(
									this.props.taskServiceUrl,
									this.state.user,
									this.state.taskTitleToAdd,
									(newTask) => {
										this.setState(state => {
											var newState = $.extend(true, {}, state)

											newState.tasks.push(newTask)

											newState.tasks.sort(_taskSorting)

											newState.taskTitleToAdd = ""

											return newState
										})
									},
									errorResponse => showError(errorResponse, "Cannot add the task. Is it duplicate?")
								)}>Add</button>
						</div>

						<ul className="tasks">
							{taskItems}
						</ul>
					</div>

					<div className="footer">
						Copyright © <a href="http://gianlucacosta.info/">Gianluca Costa</a>
					</div>
				</div>
				)
		} else {
			return (
				<LoginScreen appTitle={this.props.appTitle} onLogin={user =>
					login(
						this.props.taskServiceUrl,
						user,
						this.onLoginSuccess,
						this.onLoginError
					)} />
			)
		}
	}
}


function _taskSorting(leftTask, rightTask) {
	return leftTask.title.localeCompare(rightTask.title)
}



class LoginScreen extends React.Component {
	constructor() {
		super()

		this.state = {
			userName: "",
			password: ""
		}

		this.handleChange = (event) => {
			this.setState(
				{
					[event.target.name]: event.target.value
				}
			)
		}
	}

	render() {
		return (
			<div className="loginScreen">
				<h1>{this.props.appTitle}</h1>

				<div className="loginBox">
					<div>
						<label for="userName">User:</label><input name="userName" type="text" value={this.state.userName} onChange={this.handleChange} />
					</div>

					<div>
						<label for="password">Password:</label><input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
					</div>

					<div className="loginButtonBox">
						<button className="loginButton"
							disabled={!this.state.userName || !this.state.password}
							onClick={() => {
								var user = {
									name: this.state.userName,
									password: this.state.password
								}

								this.props.onLogin(user)
							}}>Login</button>
					</div>
				</div>
			</div>
		)
	}
}


class TaskItem extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			currentTitle: this.props.task.title
		}
	}


	render() {
		return (
			<li className="task">
				<input className="doneField" type="checkbox" checked={this.props.task.done} onClick={() =>
					swapTaskDone(
						this.props.taskServiceUrl,
						this.props.user,
						this.props.task,
						() => this.props.onTaskChanged(
							this.props.task,
							$.extend({}, this.props.task, { done: !this.props.task.done })
						),
						errorResponse => showError(errorResponse, "Cannot change the state of the task")
					)
				} />
				<input className="titleField" type="text" value={this.state.currentTitle} onChange={(event) => this.setState({
					currentTitle: event.target.value
				})} />
				<button className="removeButton" onClick={
					() => removeTask(
						this.props.taskServiceUrl,
						this.props.user,
						this.props.task.id,
						() => this.props.onTaskRemoved(),
						errorResponse => showError(errorResponse, "Cannot remove the task")
					)
				}>Remove</button>
				<button className="updateButton"
					disabled={this.state.currentTitle == this.props.task.title}
					onClick={() => {
						var capturedTitle = this.state.currentTitle

						updateTaskTitle(
							this.props.taskServiceUrl,
							this.props.user,
							this.props.task,
							capturedTitle,
							() => this.props.onTaskChanged(
								this.props.task,
								$.extend({}, this.props.task, { title: capturedTitle })
							),
							errorResponse => showError(errorResponse, "Cannot update the task title. Is it duplicate?")
						)
					}}
					>Update</button>
				<button className="revertButton" disabled={this.state.currentTitle == this.props.task.title} onClick={() => this.setState({
					currentTitle: this.props.task.title
				})}>Revert</button>
			</li>
		)
	}
}

function showError(errorResponse, errorMessage) {
	if (errorResponse && errorResponse.responseJSON) {
		alert(errorMessage)
	} else {
		alert("Cannot contact the web service.")
	}
}
