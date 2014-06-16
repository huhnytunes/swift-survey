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

	// TAKE SURVEY EVENTS
	// listen for button to take new survey
	$('.take_survey').on('click', this.getSurvey.bind(this));
	// listen for button to get next question
	$('.next_question').on('click', this.getNextQuestion.bind(this));
	// listen for button to finish survey
	$('.finish_survey').on('click', this.finishSurvey.bind(this));

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
	this.survey.id = // get this from the survey_id in href
	this.survey.getSurvey(); // send AJAX request to load up title and questions associated with this survey
	this.view.displayGetNextQuestion(); // ask the view to display the next question
};

Controller.prototype.getNextQuestion = function(e) {
	// update appropriate question.userChoice based on what the user selected
	this.view.displayGetNextQuestion(); // ask the view to display the next question:
};

Controller.prototype.finishSurvey = function(e) {
	// when this happens, user has answered every question in the survey (i.e. userChoice property exists for every question in the survey)
	// we need to save this info in the db via AJAX => ask survey to do this
	this.survey.finishSurvey();
	// dont use e.preventDefault(). in erb, the route should redirect to some page (thanks for taking survey, etc?)
	// this way, we both have an ajax request and a route to the users homepage
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
	this.questions = [];
	this.currentQuestionIndex = 0 // starts at 0. increment/decrement based on user clicks (next/previous question). you will know which question to grab from the questions array
};

Survey.prototype.getSurvey = function() {
	// based on this.id, send an AJAX call, which should return survey title, questions, and choices.
	// based on the response, we should set this.title and this.questions
	this.currentQuestionIndex = 0; // reset this to 0
};

Survey.prototype.getNextQuestion = function() {
	var nextQuestion = this.questions[this.currentQuestionIndex]
	this.currentQuestionIndex++;
	return nextQuestion;
};

Survey.prototype.finishSurvey = function() {

};

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
*/////////////////////////////////////////////////

function View(survey) {
	this.survey = survey;
	this.questionNumber = 1;
	this.choiceNumber = 3;
};

View.prototype.displayGetNextQuestion = function() {
	// ask survey what it's next available question is
	var nextQuestion = this.survey.getNextQuestion();
	// display this question (make sure to remove any questions currently on the page)
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
