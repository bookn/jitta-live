const createElement = tag => document.createElement(tag)
const getElementById = id => document.getElementById(id)

firebase.initializeApp(config.firebase)
const messageRef = firebase.database().ref()

const displayQuestion = (questionIndex) => {
  messageRef.child('currentQuestion').set(questionIndex)
}

const resetModal = () => {
  getElementById('edit-author').value = ''
  getElementById('edit-pictureUrl').value = ''
  getElementById('edit-text').value = ''
  getElementById('edit-note').value = ''
}

const openModal = () => {
  getElementById('modal').style.display = 'block'
  resetModal()
}

const closeModal = () => {
  getElementById('modal').style.display = 'none'
  resetModal()
}

const saveQuestion = async (question, index) => {
  const snapshot = await messageRef.child('questions').once('value')
  let questions = snapshot.val()
  if (index === 0 || index) {
    questions[index] = question
  } else {
    if (!questions) {
      questions = []
    }
    questions.push(question)
  }
  messageRef.child('questions').set(questions)
  closeModal()
}

const editQuestion = async (editIndex) => {
  openModal()
  const snapshot = await messageRef.child('questions').once('value')
  const questions = snapshot.val()
  const selectedQuestion = questions[editIndex]

  const authorInput = getElementById('edit-author')
  const pictureUrlInput = getElementById('edit-pictureUrl')
  const textInput = getElementById('edit-text')
  const noteInput = getElementById('edit-note')

  authorInput.value = selectedQuestion.author
  pictureUrlInput.value = selectedQuestion.pictureUrl
  textInput.value = selectedQuestion.text
  noteInput.value = selectedQuestion.note

  const editButton = getElementById('edit-button')
  editButton.onclick = () => {
    const author = getElementById('edit-author').value
    const pictureUrl = getElementById('edit-pictureUrl').value
    const text = getElementById('edit-text').value
    const note = getElementById('edit-note').value
    saveQuestion({
      author, pictureUrl, text, note
    }, editIndex)
  }
}

const addQuestion = async () => {
  const author = getElementById('add-author').value
  const pictureUrl = getElementById('add-pictureUrl').value
  const text = getElementById('add-text').value
  const note = getElementById('add-note').value

  saveQuestion({
    author, pictureUrl, text, note
  })

  getElementById('add-author').value = ''
  getElementById('add-pictureUrl').value = ''
  getElementById('add-text').value = ''
  getElementById('add-note').value = ''
}

const renderQuestion = (index, currentQuestion, {
  text, pictureUrl, author, note = ''
} = {}) => {
  const row = createElement('tr')
  if (index === currentQuestion) {
    row.setAttribute('style', 'background-color: #47c6f1;')
  }
  const authorTd = createElement('td')
  const questionTd = createElement('td')
  const pictureTd = createElement('td')
  const noteTd = createElement('td')
  const editTd = createElement('td')
  const displayTd = createElement('td')

  const editButton = createElement('button')
  const displayButton = createElement('button')
  displayButton.disabled = index === currentQuestion
  editButton.onclick = () => editQuestion(index)
  displayButton.onclick = () => displayQuestion(index)
  editButton.innerHTML = 'Edit'
  displayButton.innerHTML = 'Display this question'

  authorTd.innerHTML = author
  questionTd.innerHTML = text
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

  const tbody = getElementById('table-body')
  tbody.appendChild(row)
}

messageRef.on('value', async (snapshot) => {
  const addButton = getElementById('add-button')
  addButton.onclick = addQuestion

  const closeButton = getElementById('close-button')
  closeButton.onclick = closeModal

  const { questions, currentQuestion } = snapshot.val()

  const tbody = getElementById('table-body')
  tbody.innerHTML = ''
  if (questions) {
    questions.forEach((question, index) => {
      renderQuestion(index, currentQuestion, question)
    })
  } else {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No Data</td></tr>'
  }
})
