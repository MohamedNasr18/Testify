window.onload = function () {
  
  const studentName = localStorage.getItem("fullName");
  const scores = JSON.parse(localStorage.getItem("examScores")) || [];

  if (studentName) {
    document.getElementById("studentName").textContent = studentName;
  } else {
    document.getElementById("studentName").textContent = "Not Available";
  }

  const scoreContainer = document.getElementById("studentScore");
  if (scoreContainer) {
    if (scores.length > 0) {
      const lastScore = scores[scores.length - 1];
      console.log("Last score object:", lastScore);

      if (lastScore.correctAnswers !== undefined && lastScore.totalQuestions !== undefined) {
        scoreContainer.textContent = `${lastScore.correctAnswers} / ${lastScore.totalQuestions}`;
      } else {
        console.error("Score data is missing correctAnswers or totalQuestions");
        scoreContainer.textContent = "Score data is incomplete";
      }
    } else {
      console.log("No scores available.");
      scoreContainer.textContent = "No exam scores available.";
    }
  } else {
    console.error('Score container not found');
  }
};
