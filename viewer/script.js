firebase.initializeApp(config.firebase)
const messageRef = firebase.database().ref()

messageRef.on('value', async (snapshot) => {
  const { questions, currentQuestion } = snapshot.val()
  try {
    document.getElementById('container').style.display = 'flex'
    document.getElementById('result').innerHTML = `Question: ${questions[currentQuestion].text}`
    document.getElementById('author').innerHTML = `By: ${questions[currentQuestion].author}`
    document.getElementById('note').innerHTML = `(Note: ${questions[currentQuestion].note})`
  } catch (e) {
    document.getElementById('container').style.display = 'none'
    console.log('error occured', e)
    // TODO: error page
  }
})
