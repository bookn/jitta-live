firebase.initializeApp(config.firebase)
const messageRef = firebase.database().ref()

messageRef.on('value', async (snapshot) => {
  const { questions, currentQuestion } = snapshot.val()
  try {
    document.getElementById('container').style.display = 'flex'
    document.getElementById('result').innerHTML = questions[currentQuestion].text
    document.getElementById('profile-picture').src = questions[currentQuestion].pictureUrl
    document.getElementById('author').innerHTML = questions[currentQuestion].author
  } catch (e) {
    document.getElementById('container').style.display = 'none'
    console.log('error occured', e)
    // TODO: error page
  }
})
