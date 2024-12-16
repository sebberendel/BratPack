function sockets(io, socket, data) {

  // Check if poll exists
  socket.on('pollExists', function(poll) {
    socket.emit('pollExists', data.pollExists(poll))
  });

  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('createPoll', function(d) {
    data.createPoll(d.pollId, d.lang)
    socket.emit('pollData', data.getPoll(d.pollId));
  });

  socket.on('createGame', function(lang) {
    data.createCustomGame(lang); 
    // Implement error handling if game could not be created
  });
  socket.on('readyForPin', function() {
    const pin = data.getPin();
    socket.emit('gameCreated', pin);
  });
  
  socket.on('startGame', function(gameData) {
    data.storeGameData(gameData)
    //socket emit
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

  socket.on('update-timer', function(timerDisplay, pollId) {
    console.log("Mottagit timerDisplay på servern:", timerDisplay, "Poll ID:", pollId);
    if (pollId) {
    console.log("Skickar timerDisplay till pollId:", pollId);
    socket.join(pollId);
    io.to(pollId).emit('update-timer', timerDisplay);
    } else {
    console.log("Broadcastar timerDisplay till alla klienter:", timerDisplay);
    io.emit('update-timer', timerDisplay);
    }
    });
    
}

export { sockets };