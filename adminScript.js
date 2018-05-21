firebase.initializeApp(config.firebase)
const messageRef = firebase.database().ref()

/**
  parse comment url into videoId and commentId
  @example
  // return {
  //  commentId: 'thisIsCommentId',
  //  videoId: 'thisIsVideoId'
  // }
  parseCommentUrl(https://www.facebook.com/jitta.th/videos/thisIsVideoId/?comment_id=thisIsCommentId)
*/

const parseCommentUrl = (commentUrl) => {
  const url = new URL(commentUrl)
  const commentId = url.searchParams.get('comment_id')
  const pathname = url.pathname.split('/')
  const lastSection = pathname.pop()
  const videoId = lastSection === '' ? pathname.pop() : lastSection
  return {
    videoId,
    commentId
  }
}

const displayQuestion = (questionIndex) => {
  firebase.database().ref('currentQuestion').set(questionIndex);
}

const renderQuestion = (question, profilePicture, author, index) => {
  const newTr = document.createElement("tr");
  const authorTd = document.createElement("td")
  authorTd.appendChild(document.createTextNode(author));
  const questionTd = document.createElement("td")
  questionTd.appendChild(document.createTextNode(question));
  const displayTd = document.createElement("td")
  const button = document.createElement("button")
  button.onclick = () => displayQuestion(index)
  button.appendChild(document.createTextNode('display this question'));
  displayTd.appendChild(button);
  newTr.appendChild(authorTd)
  newTr.appendChild(questionTd)
  newTr.appendChild(displayTd)
  // add the newly created element and its content into the DOM
  const tbody = document.getElementById('table-body')
  tbody.appendChild(newTr)
  // document.body.insertBefore(newDiv, currentDiv);
}

messageRef.on('value', async (snapshot) => {
  const { questions, currentQuestion } = snapshot.val()

  try {
    const tbody = document.getElementById('table-body')
    tbody.innerHTML = ''
    questions.map((question, index) => {
      renderQuestion(question.questionText, question.profilePicture, question.author, index)
    })
    // const { videoId, commentId } = parseCommentUrl(commentUrl)
    // const graphApiEndpoint = `https://graph.facebook.com/${videoId}_${commentId}?fields=message,id,created_time,from%7Bpicture.type(large),name%7D&access_token=${config.facebook.accessToken}`
    // const response = await fetch(graphApiEndpoint)
    // const json = await response.json()
    // document.getElementById('result').innerHTML = questions[currentQuestion].questionText
    // document.getElementById('profile-picture').src = questions[currentQuestion].profilePicture
    // document.getElementById('author').innerHTML = questions[currentQuestion].author
  } catch (e) {
    // document.getElementById('container').style.display = 'none'
    // console.log('error occured', e)
    // TODO: error page
  }
})
