/*////////////////////////////////////////////////
DOCUMENT READY
*/////////////////////////////////////////////////

$(document).ready(function() {
	var survey = new Survey();
	var view = new View(survey);
	var controller = new Controller($('body'),survey, view)
});

/*////////////////////////////////////////////////
CONTROLLER
*/////////////////////////////////////////////////

function Controller(el, survey, view) {
	this.$el = el;
	this.survey = survey;
	this.view = view;

	// CREATE SURVEY EVENTS
	// listen for button to add new question
	$('.new_question').on('click', this.addNewQuestion.bind(this));
	// listen for button to submit survey
	$('.submit_survey').on('click', this.submitSurvey.bind(this));
	// listen for button to add choice to current question
	$('#question').on('click', '.add_choice', this.addChoice.bind(this));
	// listen for button to remove choice from current question
	$('#question').on('click', '.remove_class', this.removeChoice.bind(this));

	// TAKE SURVEY EVENTS
	// listen for button to take new survey
	$('.take_survey').on('click', this.getSurvey.bind(this));
	// listen for a choice selection
	$('.take_survey_question_display').on('click', 'p.choice', this.selectChoice.bind(this));
	// listen for button to get next question
	$('.take_survey_question_display').on('click', 'a.next_question', this.getNextQuestion.bind(this));
	// listen for button to finish survey
	$('.take_survey_question_display').on('click', 'a.finish_survey', this.finishSurvey.bind(this));

}

Controller.prototype.createSurvey = function(e) {
	this.survey.createSurvey(title); 
	this.view.displayAddNewQuestion();
};

Controller.prototype.addNewQuestion = function(e) {
	this.view.displayAddNewQuestion(e.target);
};

Controller.prototype.submitSurvey = function(e) {
	this.survey.submitSurvey();
};

Controller.prototype.getSurvey = function(e) {
	e.preventDefault();
	this.survey.id = e.target.id;
	var request = this.survey.getSurvey();
	request.done( this.startSurvey.bind(this) );
};

Controller.prototype.startSurvey = function(response) {
	this.survey.setTitleQuestions(response);
	this.view.surveyStats('hide');
	this.view.displayGetNextQuestion();
}

Controller.prototype.selectChoice = function(e) {
	$('.choice').removeClass('selected');
	$(e.target).addClass('selected');
}

Controller.prototype.getNextQuestion = function(e) {
	e.preventDefault();
	this.survey.saveUserChoice();
	this.view.displayGetNextQuestion();
};

Controller.prototype.finishSurvey = function(e) {
	e.preventDefault();
	this.survey.saveUserChoice();
	this.survey.finishSurvey();
	this.view.surveyStats('show');
};

Controller.prototype.addChoice = function(e) {
	this.view.displayAddedChoice(e.target);
}

Controller.prototype.removeChoice = function(e) {
	this.view.removeAddedChoice(e.target)
}

/*////////////////////////////////////////////////
MODELS
*/////////////////////////////////////////////////

function Survey() {
	this.id;
	this.title;
	this.questions;
	this.currentQuestionIndex;
};

Survey.prototype.saveUserChoice = function() {
	var questionIndex = $('.question').attr('id');
	var selectedChoiceIndex = $('.selected').attr('id') || null;
	if (selectedChoiceIndex != null) {
		this.questions[questionIndex].userChoice = this.questions[questionIndex].choices[selectedChoiceIndex].id;
	}
};

Survey.prototype.setTitleQuestions = function(response) {
	this.title = response[0];
	var ques  = response[1];
	this.questions = [];
	this.currentQuestionIndex = 0;

	for (var i=0; i<ques.length; i++) {
		var question = new Question();
		question.id = ques[i].id;
		question.content = ques[i].content;
		question.setChoices(ques[i].choices);
		this.questions.push(question);
	}
};

Survey.prototype.getSurvey = function() {
	var request = $.ajax({
		url: '/surveys/' + this.id + '/questions',
		type: 'GET'
	});
	return request;
};

Survey.prototype.getNextQuestion = function() {
	var nextQuestion = this.questions[this.currentQuestionIndex]
	return nextQuestion;
};

Survey.prototype.finishSurvey = function() {
	var request = $.ajax({
		url: '/surveys/' + this.id + '/finish',
		type: 'POST',
	   	data: {qs: JSON.stringify(this.questions)}
	});
	return request;
};

Survey.prototype.questionMarkup = function(question) {
	var markup = "<h1>" + this.title + "</h1><h2 class='question' id='" + this.currentQuestionIndex + "'>" + question.content + "</h2>";
	for (var i = 0; i < question.choices.length; i++ ) {
		markup += "<p id='" + i + "' class='choice'>" + question.choices[i].content + "</p>";
	}
	markup += "<a class='next_question' href='/'>Next Question</a><br/>";
	markup += "<a class='finish_survey' href='/'>Finish Survey</a>";
	return markup;
}

Survey.prototype.createSurvey = function(title) {
	this.survey.title = title;
	this.survey.questions = [];
	this.survey.id = null;
	this.survey.currentQuestionIndex = 0;
};

Survey.prototype.addNewQuestion = function() {

};

Survey.prototype.submitSurvey = function() {

};

function Question() {
	this.id;
	this.content;
	this.choices = []; 
	this.userChoice;
};

Question.prototype.setChoices = function(choices) {
	for (var i = 0; i < choices.length; i++) {
		var choice = choices[i];
		this.choices.push(new Choice(choice.id, choice.content));
	}
};

function Choice(id, content) {
	this.id = id;
	this.content = content;
};

/*////////////////////////////////////////////////
VIEWS
*/////////////////////////////////////////////////

function View(survey) {
	this.survey = survey;
	this.questionNumber = 1;
	this.choiceNumber = 3;
	this.divNumber = 1;
};

View.prototype.displayGetNextQuestion = function() {
	var nextQuestion = this.survey.getNextQuestion();
	var markup = this.survey.questionMarkup(nextQuestion);
	this.survey.currentQuestionIndex++;
	$('.take_survey_question_display').empty();
	$('.take_survey_question_display').append(markup);
};

View.prototype.displayAddNewQuestion = function() {
	this.choiceNumber = 3;
	this.divNumber += 1
	this.questionNumber += 1
	$("ul").append(
		'<div id=' + this.divNumber + '><p>Question: </p><input type="text" name="' + this.questionNumber +
		'[]"> <p>Choices: </p> <li><input type="text" name="' + this.questionNumber +
		'[][1]"></li> <li><input type="text" name="' + this.questionNumber +
		'[][2]"></li> <button class="add_choice" type="button">Add Choice</button><br>')
};

View.prototype.displayAddedChoice = function(e) {
	this.questionNumber = $(e).parent().attr("id")
	this.choiceNumber = $(e).parent().children("li").length
	this.choiceNumber += 1
	$(e).prev().after("<li><input type='text' name=" +
		this.questionNumber + "[][" + this.choiceNumber +
		"]> <button class='remove_class' type='button'>delete</button><br></li>")
}

View.prototype.removeAddedChoice = function(e) {
	$(e).parent().remove();
}
View.prototype.surveyStats = function(display) {
	if (display==='show') {
		$('.take_survey_question_display').hide();
		$('.survey_stats').show();
		$('.survey_stats').prepend("<p>You've taken this survey</p>");
		$('a.take_survey').remove();
	} else if (display==="hide") {
		$('.survey_stats').hide();
	}
}
