firebase.initializeApp(config.firebase)
const messageRef = firebase.database().ref()

messageRef.on('value', async (snapshot) => {
  const { questions, currentQuestion } = snapshot.val()
  const container = document.getElementById('container')
  container.classList.add('fade')
  setTimeout(() => {
    try {
      container.style.display = 'flex'
      document.getElementById('result').innerHTML = questions[currentQuestion].text
      document.getElementById('profile-picture').src = questions[currentQuestion].pictureUrl
      document.getElementById('author').innerHTML = questions[currentQuestion].author
      container.classList.remove('fade')
    } catch (e) {
      document.getElementById('container').style.display = 'none'
      console.log('error occured', e)
      // TODO: error page
    }
  }, 800)
})
