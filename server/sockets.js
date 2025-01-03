function sockets(io, socket, data) {

  // Check if game exists
  
  socket.on('customGameExists', function(gamePin) {
    socket.emit('gameExists', data.customGameExists(gamePin))
  });
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('getQuestions', function(lang) {
    console.log("hämtar quiz frågor")
    socket.emit('generalQuestions', data.getQuestions(lang))
  });

  socket.on('createPoll', function(d) {
    data.createPoll(d.pollId, d.lang)
    socket.emit('pollData', data.getPoll(d.pollId));
  });

  socket.on('createGame', function(lang) {
    const pin = data.createCustomGame(lang); 
    socket.emit('gameCreated', pin);
    // Implement error handling if game could not be created
  });
  
  socket.on('startGame', function (gameData) {

    data.storeGameDataAndStart(gameData);
    io.to(gameData.gamePin).emit('startGame');

    console.log("Game started for gamePin:", gameData.gamePin);

    data.startTimer(gameData.gamePin, gameData.selectedMinutes, io);

    io.to(gameData.gamePin).emit("startGame", { // Hmmm... Detta känns överflödigt eller? /sebbe
        message: "Game has started!",
        gamePin: gameData.gamePin
    });
  });

  socket.on('readyToStartTimer',function(){
    let gameData = data.getGameData();
    socket.emit('startTimer', gameData.selectedMinutes, gameData.gamePin);
  });
  
  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, {q: d.q, a: d.a});
    socket.emit('questionUpdate', data.getQuestion(d.pollId));
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    socket.emit('questionUpdate', data.getQuestion(pollId))
    socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(pollId));
  });
  socket.on('updateAllGameData', function(gamePin){
    io.to(gamePin).emit('updateGameData', data.getGameData(gamePin))
  });
  socket.on('joinSocketRoom', function(gamePin){
    socket.join(gamePin);
  });
  socket.on('joinCustomGame', function(gamePin) { //joins the socket room 'gamePin'
    socket.join(gamePin);
    socket.emit('updateGameData', data.getGameData(gamePin));
    // the 'joinPoll' listener above has questionUpdate and submittecAnswersUpdate... where to put them? /sebbe
  });
  socket.on('participateInCustomGame', function(d){
    console.log("Adding participant: ", d.name, " in game: ", d.gamePin)
    data.participateInCustomGame(d.gamePin, d.name);
    console.log("User has joined. SocketID: ", socket.id)
    io.to(d.gamePin).emit('participantsUpdate', data.getCustomGameParticipants(d.gamePin)); //change to getGameData
  });
  socket.on("requestGameData", function(gamePin) { 
    let gameData = data.getGameData(gamePin);
    socket.emit("updateGameData", gameData)
  });
  socket.on("requestParticipants", function(gamePin) {
    socket.emit('participantsUpdate', data.getCustomGameParticipants(gamePin));
  });

  socket.on("deleteUser", function(gamePin, userName) {
    data.deleteUser(gamePin, userName);
    io.to(gamePin).emit('participantsUpdate', data.getCustomGameParticipants(gamePin));
  });

  socket.on('participateInPoll', function(d) {
    data.participateInPoll(d.pollId, d.name);
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  });
  socket.on('startPoll', function(pollId) {
    io.to(pollId).emit('startPoll');
  })
  socket.on('runQuestion', function(d) {
    let question = data.getQuestion(d.pollId, d.questionNumber);
    io.to(d.pollId).emit('questionUpdate', question);
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
  }); 

  
  socket.on('update-timer', function(data) {
    const { timerDisplay, gamePin, soundType } = data || {};
    console.log("Mottagit timerDisplay på servern:", timerDisplay, "Game Pin:", gamePin, "Sound Type:", soundType);
    if (gamePin) {
    console.log("Skickar timerDisplay till gamePin:", gamePin);
    socket.join(gamePin);
    io.to(gamePin).emit('update-timer', { timerDisplay, soundType });
    } else {
    console.log("Broadcastar timerDisplay till alla klienter:", timerDisplay);
    io.emit('update-timer', { timerDisplay, soundType });
    }
    });

    socket.on("requestGameData", function (gamePin) {
      const gameData = data.getGameData(gamePin);
      if (gameData) {
          console.log(`Sending current game data to client ${socket.id}`);
          socket.emit("update-timer", {
              timerDisplay: gameData.timerDisplay,
              soundType: null 
          });
      }
  });
  


    
}

export { sockets };