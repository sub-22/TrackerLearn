
document.getElementById('task_form').addEventListener('submit', saveTask);

function saveTask(e) {
  var task_title = document.getElementById('task_title').value;
  var task_servertity = document.getElementById('task_severity').value;
  var task_description = document.getElementById('task_description').value;
  var task_id = chance.guid();
  var task_status = 'Open';

  var task = {
    id: task_id,
    task_title: task_title,
    task_servertity: task_servertity,
    task_description: task_description,
    status: task_status
  }

  var tasks = [];

  if (localStorage.getItem('tasks') == null) {
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(task));
  } else {
    var tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  document.getElementById('task_form').reset();

  fetchIssues();

  e.preventDefault();
}

function deleteIssue(id) {
  var tasks = JSON.parse(localStorage.getItem('tasks'));
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      tasks.splice(i, 1);
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  fetchIssues();
}

function setStatusDone(id) {
  var tasks = JSON.parse(localStorage.getItem('tasks'));
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      tasks[i].status = 'Done';
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  fetchIssues();
}

function setStatusClosed(id) {
  var tasks = JSON.parse(localStorage.getItem('tasks'));
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      debugger
      tasks[i].status = 'Closed';
      $(".close-" + id).hide();
      $(".open-" + id).show();
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  fetchIssues();
}

function setStatusOpen(id) {
  var tasks = JSON.parse(localStorage.getItem('tasks'));
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      tasks[i].status = 'Open';
      $(".close-" + id).show();
      $(".open-" + id).hide();
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  fetchIssues();
}

function fetchIssues() {
  var tasks = JSON.parse(localStorage.getItem('tasks'));

  var tasksList = document.getElementById('task_list');
  tasksList.innerHTML = '';

  for (var i = 0; i < tasks.length; i++) {
    var id = tasks[i].id;
    var title = tasks[i].task_title;
    var severity = tasks[i].task_servertity;
    var description = tasks[i].task_description;
    var status = tasks[i].status;

    tasksList.innerHTML += '<div class="well">' +
                        '<h6>Issue ID: ' + id + '</h6>' +
                        '<p><span class="label label-info status-'+id+'">' + status + '</span></p>' +
                        '<h3>' + "Title: " + title + '</h3>' +
                        '<p><span class="glypicon glypicon-time"></span>' + 'Serverity: ' + severity + '</p>' +
                        '<p><span class="glypicon glypicon-user"></span>' + 'Description: ' + description + '</p>' +
                        '<a href="#" onclick="setStatusClosed(\''+id+'\')" class="btn btn-warning close-'+id+'">Close</a>' +
                        '<a href="#" onclick="setStatusOpen(\''+id+'\')" class="btn btn-warning open-'+id+'">Open</a>' +
                        '<a href="#" onclick="deleteIssue(\''+id+'\')" class="btn btn-danger" style="margin: 20px">Delete</a>' +
                        '<a href="#" onclick="startTime(\''+id+'\')" class="btn btn-primary start-'+id+'">Start</a>' +
                        '<a href="#" onclick="stopTime(\''+id+'\')" class="btn btn-primary stop-'+id+'">Stop</a>' +
                          '<div id="time_input">' +
                            '<input type="text" id="h_val-'+id+'" placeholder="Hours" value=""/> <br/>' +
                            '<input type="text" id="m_val-'+id+'" placeholder="Minutes" value=""/> <br/>' +
                            '<input type="text" id="s_val-'+id+'" placeholder="Second" value=""/>' +
                          '</div>' +
                          '<div id="time">' +
                            '<span class="time_count" id="h-'+id+'">Hours</span>' + ":" +
                            '<span class="time_count" id="m-'+id+'">Minutes</span>' + ":" +
                            '<span class="time_count" id="s-'+id+'">Second</span>' +
                          '</div>' +
                        '</div>';
    $(".stop-" + id).hide();
    if(status == "Open") {
      $(".open-" + id).hide();
      $(".close-" + id).show();
      $(".start-" + id).show();
    } else {
      $(".open-" + id).show();
      $(".close-" + id).hide();
      $(".start-" + id).hide();
    }
  }
}

function stopTime(id){
  clearTimeout(timeout);
  $(".start-" + id).show();
  $(".stop-" + id).hide();
  fetchIssues();
  h = null;
  m = null;
  s = null;
  timeout = null;
  setStatusDone(id);
}

var h = null;
var m = null;
var s = null;
var timeout = null;

function startTime(id) {
  if($("#s_val-" + id).val().length != 0) {
    $(".start-" + id).hide();
    $(".stop-" + id).show();
    if(h === null) {
      h = parseInt($("#h_val-" + id).val())
      m = parseInt($("#m_val-" + id).val())
      s = parseInt($("#s_val-" + id).val())
    }

    if(s === -1){
      m -= 1;
      s = 59;
    }

    if(m === -1){
      h -= 1;
      m = 59;
    }

    if(h.toString() == 'NaN') {
      h = 0;
      document.getElementById('h-' + id).innerText = 0;
    } else {
      document.getElementById('h-' + id).innerText = h.toString();
    }
    if(m.toString() == 'NaN') {
      m = 0;
      document.getElementById('m-' + id).innerText = 0;
    } else {
      document.getElementById('m-' + id).innerText = m.toString();
    }
    if(s.toString() == 'NaN') {
      s = 0;
      document.getElementById('s-' + id).innerText = 0;
    } else {
      document.getElementById('s-' + id).innerText = s.toString();
    }

    if (h == 0 && m == 0 && s == 0){
      clearTimeout(timeout);
      alert('The task be done');
      $(".start-" + id).show();
      $(".stop-" + id).hide();
      fetchIssues();
      h = null;
      m = null;
      s = null;
      timeout = null;
      setStatusDone(id);
      return false;
    }

    timeout = setTimeout(function(){
      s--;
      startTime(id);
    }, 1000);
  }
}

