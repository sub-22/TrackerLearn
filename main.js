
document.getElementById('issueInputForm').addEventListener('submit', saveIssue);

function saveIssue(e) {
  var issueDesc = document.getElementById('task_description_input').value;
  var issueSeverity = document.getElementById('task_severity_input').value;
  var issueAssignedTo = document.getElementById('issueAssignedToInput').value;
  var issueId = chance.guid();
  var issueStatus = 'Open';

  var issue = {
    id: issueId,
    description: issueDesc,
    severity: issueSeverity,
    assignedTo: issueAssignedTo,
    status: issueStatus
  }

  var issues = [];

  if (localStorage.getItem('issues') == null) {
    issues.push(issue);
    localStorage.setItem('issues', JSON.stringify(issues));
  } else {
    var issues = JSON.parse(localStorage.getItem('issues'));
    issues.push(issue);
    localStorage.setItem('issues', JSON.stringify(issues));
  }

  document.getElementById('issueInputForm').reset();

  fetchIssues();

  e.preventDefault();
}

function setStatusClosed(id) {
  var issues = JSON.parse(localStorage.getItem('issues'));
  for (var i = 0; i < issues.length; i++) {
    if (issues[i].id == id) {
      issues[i].status = 'Closed';
    }
  }

  localStorage.setItem('issues', JSON.stringify(issues));

  fetchIssues();
}

function deleteIssue(id) {
  var issues = JSON.parse(localStorage.getItem('issues'));
  for (var i = 0; i < issues.length; i++) {
    if (issues[i].id == id) {
      issues.splice(i, 1);
    }
  }

  localStorage.setItem('issues', JSON.stringify(issues));

  fetchIssues();
}

function setStatusDone(id) {
  var issues = JSON.parse(localStorage.getItem('issues'));
  for (var i = 0; i < issues.length; i++) {
    if (issues[i].id == id) {
      issues[i].status = 'Done';
    }
  }

  localStorage.setItem('issues', JSON.stringify(issues));

  fetchIssues();
}

function fetchIssues() {
  var issues = JSON.parse(localStorage.getItem('issues'));

  var issuesList = document.getElementById('issuesList');
  issuesList.innerHTML = '';

  for (var i = 0; i < issues.length; i++) {
    var id = issues[i].id;
    var desc = issues[i].description;
    var severity = issues[i].severity;
    var assignedTo = issues[i].assignedTo;
    var status = issues[i].status;

    issuesList.innerHTML += '<div class="well">' +
                        '<h6>Issue ID: ' + id + '</h6>' +
                        '<p><span class="label label-info">' + status + '</span></p>' +
                        '<h3>' + "Description: " + desc + '</h3>' +
                        '<p><span class="glypicon glypicon-time"></span>' + 'Serverity: ' + severity + '</p>' +
                        '<p><span class="glypicon glypicon-user"></span> ' + assignedTo + '</p>' +
                        '<a href="#" onclick="setStatusClosed(\''+id+'\')" class="btn btn-warning">Close</a>' +
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

    // Nếu số phút = -1 tức là đã chạy ngược hết số phút, lúc này:
    //  - giảm số giờ xuống 1 đơn vị
    //  - thiết lập số phút lại 59
    if(m === -1){
        h -= 1;
        m = 59;
    }

    // Nếu số giờ = -1 tức là đã hết giờ, lúc này:
    //  - Dừng chương trình
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
      alert('TimeOut');
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
    debugger
    timeout = setTimeout(function(){
      s--;
      startTime(id);
    }, 1000);
  }
}

