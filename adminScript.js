firebase.initializeApp(config.firebase)
const messageRef = firebase.database().ref()

const displayQuestion = (questionIndex) => {
  firebase.database().ref('currentQuestion').set(questionIndex)
}

const editQuestion = (editIndex) => {
  document.getElementById('modal').style.display = 'block'
}

const createElement = (tag) => document.createElement(tag)

const renderQuestion = (question, pictureUrl, author, index) => {
  const row = createElement("tr")

  const authorTd = createElement("td")
  const questionTd = createElement("td")
  const pictureTd = createElement("td")
  const editTd = createElement("td")
  const displayTd = createElement("td")

  const editButton = createElement("button")
  const displayButton = createElement("button")
  editButton.onclick = () => editQuestion(index)
  displayButton.onclick = () => displayQuestion(index)
  editButton.innerHTML = 'Edit'
  displayButton.innerHTML = 'Display this question'
  
  authorTd.innerHTML = author
  questionTd.innerHTML = question
  pictureTd.innerHTML = `<img src="${pictureUrl}" style="width: 50px;">`

  editTd.appendChild(editButton)
  displayTd.appendChild(displayButton)

  row.appendChild(authorTd)
  row.appendChild(pictureTd)
  row.appendChild(questionTd)
  row.appendChild(editTd)
  row.appendChild(displayTd)

  const tbody = document.getElementById('table-body')
  tbody.appendChild(row)
}

messageRef.on('value', async (snapshot) => {
  const { questions, currentQuestion } = snapshot.val()

  try {
    const tbody = document.getElementById('table-body')
    tbody.innerHTML = ''
    questions.map((question, index) => {
      const { text, pictureUrl, author} = question
      renderQuestion(text, pictureUrl, author, index)
    })
    // const { videoId, commentId } = parseCommentUrl(commentUrl)
    // const graphApiEndpoint = `https://graph.facebook.com/${videoId}_${commentId}?fields=message,id,created_time,from%7Bpicture.type(large),name%7D&access_token=${config.facebook.accessToken}`
    // const response = await fetch(graphApiEndpoint)
    // const json = await response.json()
    // document.getElementById('result').innerHTML = questions[currentQuestion].questionText
    // document.getElementById('profile-picture').src = questions[currentQuestion].profileUrl
    // document.getElementById('author').innerHTML = questions[currentQuestion].author
  } catch (e) {
    // document.getElementById('container').style.display = 'none'
    // console.log('error occured', e)
    // TODO: error page
  }
})
