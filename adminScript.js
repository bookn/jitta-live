const createElement = tag => document.createElement(tag)

firebase.initializeApp(config.firebase)
const messageRef = firebase.database().ref()

const displayQuestion = (questionIndex) => {
  firebase.database().ref('currentQuestion').set(questionIndex)
}

const resetModal = () => {
  let author = document.getElementById('edit-author').value
  let pictureUrl = document.getElementById('edit-pictureUrl').value
  let text = document.getElementById('edit-text').value

  author = ''
  pictureUrl = ''
  text = ''
}

const openModal = () => {
  document.getElementById('modal').style.display = 'block'
  resetModal()
}

const closeModal = () => {
  document.getElementById('modal').style.display = 'none'
  resetModal()
}

const saveQuestion = async (editIndex) => {
  const author = document.getElementById('edit-author').value
  const pictureUrl = document.getElementById('edit-pictureUrl').value
  const text = document.getElementById('edit-text').value
  const snapshot = await firebase.database().ref('questions').once('value')
  const questions = snapshot.val()
  questions[editIndex] = {
    author,
    pictureUrl,
    text
  }
  firebase.database().ref('questions').set(questions)

  closeModal()
}

const editQuestion = async (editIndex) => {
  openModal()
  const snapshot = await firebase.database().ref('questions').once('value')
  const questions = snapshot.val()
  const selectedQuestion = questions[editIndex]

  const authorInput = document.getElementById('edit-author')
  const pictureUrlInput = document.getElementById('edit-pictureUrl')
  const textInput = document.getElementById('edit-text')

  authorInput.value = selectedQuestion.author
  pictureUrlInput.value = selectedQuestion.pictureUrl
  textInput.value = selectedQuestion.text

  const editButton = document.getElementById('edit-button')
  editButton.onclick = () => saveQuestion(editIndex)
}

const addQuestion = async () => {
  let author = document.getElementById('add-author').value
  let pictureUrl = document.getElementById('add-pictureUrl').value
  let text = document.getElementById('add-text').value
  const snapshot = await firebase.database().ref('questions').once('value')
  const questions = snapshot.val()
  questions.push({
    author,
    pictureUrl,
    text
  })
  firebase.database().ref('questions').set(questions)

  author = ''
  pictureUrl = ''
  text = ''
}

const renderQuestion = (question, pictureUrl, author, index) => {
  const row = createElement('tr')

  const authorTd = createElement('td')
  const questionTd = createElement('td')
  const pictureTd = createElement('td')
  const editTd = createElement('td')
  const displayTd = createElement('td')

  const editButton = createElement('button')
  const displayButton = createElement('button')
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
  const addButton = document.getElementById('add-button')
  addButton.onclick = addQuestion

  const closeButton = document.getElementById('close-button')
  closeButton.onclick = closeModal

  const { questions, currentQuestion } = snapshot.val()

  try {
    const tbody = document.getElementById('table-body')
    tbody.innerHTML = ''
    questions.forEach((question, index) => {
      const { text, pictureUrl, author } = question
      renderQuestion(text, pictureUrl, author, index)
    })
  } catch (e) {

  }
})
