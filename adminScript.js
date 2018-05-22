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
  let note = document.getElementById('edit-note').value

  author = ''
  pictureUrl = ''
  text = ''
  note = ''
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
  const note = document.getElementById('edit-note').value
  const snapshot = await firebase.database().ref('questions').once('value')
  const questions = snapshot.val()
  questions[editIndex] = {
    author,
    pictureUrl,
    text,
    note
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
  const noteInput = document.getElementById('edit-note')

  authorInput.value = selectedQuestion.author
  pictureUrlInput.value = selectedQuestion.pictureUrl
  textInput.value = selectedQuestion.text
  noteInput.value = selectedQuestion.note

  const editButton = document.getElementById('edit-button')
  editButton.onclick = () => saveQuestion(editIndex)
}

const addQuestion = async () => {
  let author = document.getElementById('add-author').value
  let pictureUrl = document.getElementById('add-pictureUrl').value
  let text = document.getElementById('add-text').value
  let note = document.getElementById('add-note').value
  const snapshot = await firebase.database().ref('questions').once('value')
  const questions = snapshot.val()
  questions.push({
    author,
    pictureUrl,
    text,
    note
  })
  firebase.database().ref('questions').set(questions)

  author = ''
  pictureUrl = ''
  text = ''
  note = ''
}

const renderQuestion = (question, pictureUrl, author, note = '', index) => {
  const row = createElement('tr')

  const authorTd = createElement('td')
  const questionTd = createElement('td')
  const pictureTd = createElement('td')
  const noteTd = createElement('td')
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
  noteTd.innerHTML = note
  pictureTd.innerHTML = `<img src="${pictureUrl}" style="width: 50px;">`

  editTd.appendChild(editButton)
  displayTd.appendChild(displayButton)

  row.appendChild(authorTd)
  row.appendChild(pictureTd)
  row.appendChild(questionTd)
  row.appendChild(noteTd)
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
      const { text, pictureUrl, note, author } = question
      renderQuestion(text, pictureUrl, author, note, index)
    })
  } catch (e) {

  }
})
