firebase.initializeApp(config.firebase)
const messageRef = firebase.database().ref('/commentUrl')

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

messageRef.on('value', async (snapshot) => {
  const commentUrl = snapshot.val()
  try {
    const { videoId, commentId } = parseCommentUrl(commentUrl)
    const graphApiEndpoint = `https://graph.facebook.com/${videoId}_${commentId}?fields=message,id,created_time,from%7Bpicture.type(large),name%7D&access_token=${config.facebook.accessToken}`
    const response = await fetch(graphApiEndpoint)
    const json = await response.json()
    document.getElementById('container').style.display = 'flex'
    document.getElementById('result').innerHTML = json.message
    document.getElementById('profile-picture').src = json.from.picture.data.url
    document.getElementById('author').innerHTML = json.from.name
  } catch (e) {
    document.getElementById('container').style.display = 'none'
    console.log('error occured', e)
    // TODO: error page
  }
})
