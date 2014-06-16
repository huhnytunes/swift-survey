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

	var self = this;

	// CREATE SURVEY EVENTS
	// // listen for button to create new survey
	// $('.create_survey').on('click', this.createSurvey.bind(this));
	// listen for button to add new question
	$('.new_question').on('click', this.addNewQuestion.bind(this));
	// listen for button to submit survey
	$('.submit_survey').on('click', this.submitSurvey.bind(this));
	// listen for button to add choice to current question
	$('#question').on('click', '.add_choice', this.addChoice.bind(this));
	// listen for button to remove choice from current question
	$('#question').on('click', '.remove_class', this.removeChoice.bind(this));
	// $('.add_choice').on('click', this.addChoice.bind(this));
	// listen for button to remove choice from current question
	// $('.remove_choice').on('click', this.removeChoice.bind(this));

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
	// We're creating a new survey. Let's reset all of the survey object's properties
	this.survey.createSurvey(title); //get title from the form; set controller's survey object

	this.view.displayAddNewQuestion();
};

Controller.prototype.addNewQuestion = function(e) {
	console.log(e.target)
	// based on the user input, add a new question object to this.survey questions array
	this.view.displayAddNewQuestion(e.target); // ask view to display a new blank form

};

Controller.prototype.submitSurvey = function(e) {
	this.survey.submitSurvey(); // have survey object send ajax request to save the survey (and its questions/choices) to the database
	// dont use e.preventDefault(). in the erb, have the route redirect to user's homepage.
	// this way, we both have an ajax request and a route to the users homepage
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
	// update appropriate question.userChoice based on what the user selected
	this.view.displayGetNextQuestion(); // ask the view to display the next question:
};

// Controller.prototype.finishSurvey = function(e) {
// 	// when this happens, user has answered every question in the survey (i.e. userChoice property exists for every question in the survey)
// 	// we need to save this info in the db via AJAX => ask survey to do this
// 	this.survey.finishSurvey();
// 	// dont use e.preventDefault(). in erb, the route should redirect to some page (thanks for taking survey, etc?)
// 	// this way, we both have an ajax request and a route to the users homepage
// 	e.preventDefault();
// 	this.survey.saveUserChoice();
// 	this.view.displayGetNextQuestion();
// };

Controller.prototype.finishSurvey = function(e) {
	e.preventDefault();
	this.survey.saveUserChoice();
	this.survey.finishSurvey();
	this.view.surveyStats('show');
};

Controller.prototype.addChoice = function(e) {
	// console.log(e.target)
	this.view.displayAddedChoice(e.target);
}

Controller.prototype.removeChoice = function(e) {
	console.log("anything")
	console.log(e.target)
	this.view.removeAddedChoice(e.target)
}

/*////////////////////////////////////////////////
MODELS
*/////////////////////////////////////////////////

function Survey() {
	this.id;
	this.title;
	this.questions;
	this.currentQuestionIndex; // starts at 0. increment/decrement based on user clicks (next/previous question). you will know which question to grab from the questions array
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
	this.answered = false;
	this.content;
	this.choices = {}; // an object where property is choice.id and value is choice.content
	this.userChoice; // the choice.id that the user selected. this will be used when we need to save a user's response.
};

/*////////////////////////////////////////////////
VIEWS
	this.choices = []; // an object where property is choice.id and value is choice.content
	this.userChoice; // the choice.id that the user selected. this will be used when we need to save a user's response.
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

// /*////////////////////////////////////////////////
// // VIEWS
// */////////////////////////////////////////////////

function View(survey) {
	this.survey = survey;
	this.questionNumber = 1;
	this.choiceNumber = 3;
};

View.prototype.displayGetNextQuestion = function() {
	var nextQuestion = this.survey.getNextQuestion();
	var markup = this.survey.questionMarkup(nextQuestion); // markupNextQuestion(nextQuestion, this.survey.currentQuestionIndex, this.survey.questions.length);
	this.survey.currentQuestionIndex++;
	$('.take_survey_question_display').empty();
	$('.take_survey_question_display').append(markup);
};

View.prototype.displayAddNewQuestion = function() {
	this.choiceNumber = 3;
	$("ul").append(
		'<p>Question: </p><input type="text" name="' + this.questionNumber++ +
		'[]"> <p>Choices: </p> <li><input type="text" name="' + this.questionNumber +
		'[][1]"></li> <li><input type="text" name="' + this.questionNumber +
		'[][2]"></li> <button class="add_choice" type="button">Add Choice</button><br>')
};

View.prototype.displayAddedChoice = function(e) {
	// this.questionNumber =
	// var currentQuestionNumber =
	console.log(this);
	console.log($(e).next())
	$(e).prev().after("<li><input type='text' name=" +
		this.questionNumber + "[][" + this.choiceNumber++ +
		"]> <button class='remove_class' type='button'>delete</button><br></li>")
}

View.prototype.removeAddedChoice = function(e) {
	console.log(e)
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
