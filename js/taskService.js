// *********************************
// RESTFUL WEB SERVICE - AJAX CALLS
// *********************************

function _setBasicAuthHeader(xhr, user) {
	xhr.setRequestHeader('Authorization', 'Basic ' + btoa(user.name + ":" + user.password))
}


function login(taskServiceUrl, user, onLoginSuccess, onLoginError) {
	$.ajax({
		beforeSend: function (xhr) {
        _setBasicAuthHeader(xhr, user)
    },
		url: taskServiceUrl,
		type: 'GET',
		success: (tasks) => onLoginSuccess(user, tasks),
		error: onLoginError
	})
}


function addTask(taskServiceUrl, user, title, onAddSuccess, onAddError) {
	$.ajax({
		beforeSend: function (xhr) {
        _setBasicAuthHeader(xhr, user)
    },
		url: taskServiceUrl,
		type: 'POST',
		data: {
  		"title": title
		},
		success: onAddSuccess,
		error: onAddError
	})
}


function removeTask(taskServiceUrl, user, id, onRemoveSuccess, onRemoveError) {
	$.ajax({
		beforeSend: function (xhr) {
        _setBasicAuthHeader(xhr, user)
    },
		url: taskServiceUrl + "?id=" + id,
		type: 'DELETE',
		success: onRemoveSuccess,
		error: onRemoveError
	})
}


function swapTaskDone(taskServiceUrl, user, taskToUpdate, onUpdateSuccess, onUpdateError) {
	var updatingTask = $.extend({}, taskToUpdate)

	updatingTask.done = !taskToUpdate.done

	updateTask(taskServiceUrl, user, updatingTask, onUpdateSuccess, onUpdateError)
}


function updateTaskTitle(taskServiceUrl, user, taskToUpdate, newTitle, onUpdateSuccess, onUpdateError) {
	var updatingTask = $.extend({}, taskToUpdate)

	updatingTask.title = newTitle

	updateTask(taskServiceUrl, user, updatingTask, onUpdateSuccess, onUpdateError)
}


function updateTask(taskServiceUrl, user, updatingTask, onUpdateSuccess, onUpdateError) {
	$.ajax({
		beforeSend: function (xhr) {
        _setBasicAuthHeader(xhr, user)
    },
		url: taskServiceUrl,
		type: 'PUT',
		data: {
			"id": updatingTask.id,
  		"title": updatingTask.title,
			"done": updatingTask.done
		},
		success: onUpdateSuccess,
		error: onUpdateError
	})
}
