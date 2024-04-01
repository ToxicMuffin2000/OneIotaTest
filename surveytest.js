

	<div style="display: none;" class="loader" id="loader"></div>

	<div class="custom-container">
		<div class="titleText">Performance Baseline Assessment</div>
		<div id="survey-title" style="display: block;">
			<div class="descriptionText">
				The following assessment will provide you with a snapshot of your current approach to the mental side of performance and will take 5-10 minutes to complete. 
                Once you have clicked SUBMIT at the end of the survey you will receive a report via email with a summary of your results.
			</div>
			<div class="text-align: center;">
				<button id="begin-survey" style="display: block; margin: 50px auto;" class="buttonStyle">Begin</button>
			</div>
		</div>
		<div id="survey-content" class="surveyContentContainer" style="display: none;">
			<div id="surveyLoading" class="surveyHoldStates" style="display: none; padding: 100px 0;">
				<div style="font-size: 25px; font-weight: bold; color: #000000">
					<i class="fa-solid fa-spinner fa-spin"></i> Loading Assessment
				</div>
			</div>
			<div id="surveyContent" class="questionContent" style="display: none">
				<div class="questionCounter">Question <span id="qNumber">#</span> of <span id="totalQs">#</span></div>
				<div id="surveyQuestion" style="height: 70%;">
					<div class="questionText" id="question">This is a sample question that would be asked?</div>
					<div style="height: auto; min-height: 150px;">
						<input type="hidden" id="activeQuestionId"></input>
						<form id="likertQuestion" class="formContainer" style="display: none;">
							<div class="questionContainer">
								<div class="questionOption">
									<input id="likert-v5" type="radio" name="likertQuestion" style="cursor: pointer" value="5"></input>
									<br>
									<label for="likert-v5" style="cursor: pointer"><b>Very much</b> like me <br>(80-100% of time)</label>
								</div>
								<div class="questionOption">
									<input id="likert-v4" type="radio" name="likertQuestion" style="cursor: pointer" value="4"></input>
									<br>
									<label for="likert-v4" style="cursor: pointer"><b>Mostly</b> like me <br>(60-80% of time)</label>
								</div>
								<div class="questionOption">
									<input id="likert-v3" type="radio" name="likertQuestion" style="cursor: pointer" value="3"></input>
									<br>
									<label for="likert-v3" style="cursor: pointer"><b>Somewhat</b> like me <br>(40-60% of time)</label>
								</div>
								<div class="questionOption">
									<input id="likert-v2" type="radio" name="likertQuestion" style="cursor: pointer" value="2"></input>
									<br>
									<label for="likert-v2" style="cursor: pointer"><b>Not much</b> like me <br>(20-40% of time)</label>
								</div>
								<div class="questionOption">
									<input id="likert-v1" type="radio" name="likertQuestion" style="cursor: pointer" value="1"></input>
									<br>
									<label for="likert-v1" style="cursor: pointer"><b>Not at all</b> like me <br>(0-20% of time)</label>
								</div>
							</div>
						</form>
						<form id="textQuestion" class="formContainer" style="display: none;">
							<div style="width: 50%; margin: auto">
								<input name="textQuestionData" type="text" id="textQuestionData" maxlength="100" class="textInputStyle"/>
							</div>
						</form>
					</div>
				</div>
				<div id="surveyReview" style="min-height: 150px; display: none;">
					
				</div>
				<div id="questionNavigation" class="questionNavigationContainer">
					<div id="last-q" class="questionNavigationButton"><i class="fa-solid fa-arrow-left"></i> Last Question</div>
					<div style="width: 10%; color: #FFFFFF; opacity:0">Spacer</div>
					<div id="next-q" class="questionNavigationButton">Next Question <i class="fa-solid fa-arrow-right"></i></div>
				</div>
				<div id="surveySubmission" style="display: none; height: 30%;">
					<button id="submit-survey" style="margin: 0 auto; display: none;" class="buttonStyle">SUBMIT</button>
				</div>
			</div>
			<div id="surveyComplete" class="surveyHoldStates" style="display: none; padding: 100px 0;">
				<div style="font-size: 25px; font-weight: bold; color: #87CA80">
					<i class="fa-solid fa-circle-check"></i> Survey Complete
				</div>
				<br>
				<br>
				<div style="font-size: 18px; color: #000000; width: 75%; margin: auto">
					Thank you for completing the <b>Mental Performance Baseline Assessment!</b>
					<br><br>
					You will recieve <b>a report with your baseline results to your email shortly</b>. Don't forget to signup for our private beta to get early access to our platform!
				</div>
			</div>
			<div id="surveyError" class="surveyHoldStates" style="display: none; padding: 100px 0;">
				<div style="font-size: 20px; font-weight: bold; color: #A80606">
					<i class="fa-solid fa-circle-xmark"></i> Something Went Wrong
				</div>
				<br>
				<br>
				<div style="font-size: 16px; color: #000000; width: 75%; margin: auto">
					<span id="surveyErrorMessage">Something unexpected happened while trying to deliver the survey. This issue has been reported. </span>
					<br><br>
					In the meantime you can try <a onclick="location.reload()" style="color: blue; text-decoration: underline; cursor: pointer;">reloading the page</a> to see if that fixes the issue.
				</div>
			</div>
		</div>
	</div>

	

	<script>
	// Set Global Variables
	var _survey_gv = null;
	var _activeQuestion_gv = null;
	var _questionResponses_gv = [];

	const mentalSurveyId = "surv_7b3bdbce-6031-4f6a-a9c3-3189a2a90ed4";
	const emailQuestionId = "svqu_ef92ef0d-b745-41e8-bfac-43fe0b088a1b";

	// Load the survey as soon as the page loads
	LoadSurvey(); 

	$(function()
	{

	$("#begin-survey").on( "click", function() { BeginSurvey(); });
	$("#last-q").on( "click", function() { ChangeQuestion(false); });
	$("#next-q").on( "click", function() { ChangeQuestion(true); });
	$("input[name='likertQuestion']").on('change', function() { ChangeQuestion(true); });
	$("#submit-survey").on('click', function() { SubmitSurvey(false); });

	});

	function LoadSurvey()
		{
		// Will need to change to /funnel/survey on next deployment
		let getSurveyPath = "/survey/" + mentalSurveyId;
		try
			{
			apiRequest_NoAuth(getSurveyPath, method_gv.GET, null, (response) => 
				{
				if (response.success)
					{
					_survey_gv = response;
					SetupSurvey();
					}
				else 
					{
					ShowError(response.message);
					}
				});
			}
		catch(error)
			{
			ShowError();
			}
		}

	function SetupSurvey()
		{
		let totalQuestions = _survey_gv.questions.length;
		if (totalQuestions == 0)
			{
			ShowError();
			}
		else 
			{
			// Add email question to the survey
			AddEmailQuestion();
			totalQuestions++;

			$("#qNumber").text(1);
			$("#totalQs").text(totalQuestions);

			// Setup question responses
			for(let q = 0; q < totalQuestions; q++)
				{
				_questionResponses_gv.push({
					question_id: _survey_gv.questions[q].id,
					version: _survey_gv.questions[q].version,
					response: null
				});
				}

			_activeQuestion_gv = _survey_gv.questions[0];
			SetQuestion(_activeQuestion_gv.id);
			ShowSurveyContentsIfReady();
			}
		}

	function AddEmailQuestion()
		{
		_survey_gv.questions.push({
            "id": emailQuestionId, 
            "order": _survey_gv.questions.length + 1,
            "version": 1,
            "question": "Last Question! What is your email? (We will send your report to this address) ",
            "response_type": "Text",
            "response_options": null
        	});
		}

	function SubmitSurvey()
		{
		// Collect responses and send api response to server
		setLoaderVisibility(true);

		// Get email response and remove email question from submitted responses
		let userEmail = _questionResponses_gv.find(x => x.question_id === emailQuestionId)?.response ?? null;
		_questionResponses_gv = _questionResponses_gv.filter(x => x.question_id !== emailQuestionId);

		let data = 
			{
			user_email: userEmail,
			timezone_offset: Intl.DateTimeFormat().resolvedOptions().timeZone,
			survey_id: _survey_gv.id,
			external_link: null, 
			external_data: null, 
			responses: _questionResponses_gv
			};

		try 
			{
			apiRequest_NoAuth("/funnel/survey", method_gv.POST, data, (response) => 
				{
				setLoaderVisibility(false);
				if (response.success)
					{
					$("#surveyContent").hide();
					$("#surveyComplete").show();
					fbq('track', 'Lead');
					gtag('event', 'conversion', {'send_to': 'AW-11288036958/4SR0COm6gecYEN6Mx4Yq'});
					}
				else 
					{
					alert(response.message);
					}
				});
			}
		catch(error)
			{
			ShowError();
			}
		
		}

	function BeginSurvey()
		{
		$("#survey-title").hide();
		$("#survey-content").show();

		ShowSurveyContentsIfReady();
		gtag('event', 'conversion', {'send_to': 'AW-11288036958/ko0sCOa6gecYEN6Mx4Yq'});
		}

	function ShowSurveyContentsIfReady()
		{
		if (_survey_gv == null)
			{
			$("#surveyLoading").show();
			$("#surveyContent").hide();
			$("#surveyComplete").hide();
			}
		else 
			{
			$("#surveyLoading").hide();
			$("#surveyContent").show();
			$("#surveyComplete").hide();
			}
		}

	function ChangeQuestion(nextQuestion)
		{
		// Get current question id and save response
		let currentQid = $("#activeQuestionId").val();
		SaveCurrentResponse();

		// Remove existing classes if they are there  
		$("#surveyQuestion").removeClass("hideNext");
		$("#surveyQuestion").removeClass("showNext");
		$("#surveyQuestion").removeClass("hidePrev");
		$("#surveyQuestion").removeClass("showPrev");

		// Change question with 0.5 sec delay
		if (nextQuestion)
			{
			let nextId = GetNextQuestionId(currentQid);
			if (nextId != null)
				{
				$("#surveyQuestion").addClass("hideNext");

				setTimeout(function() {
					SetQuestion(nextId);
					$("#surveyQuestion").addClass("showNext");
				}, 300);
				}
			else 
				{
				$("#questionNavigation").hide();
				$("#surveyQuestion").hide();
				$("#surveyReview").show();
				$("#surveySubmission").show();

				ReviewSurvey();
				}
			}
		else 
			{
			let prevId = GetPreviousQuestionId(currentQid);
			if (prevId != null)
				{
				$("#surveyQuestion").addClass("hidePrev");

				setTimeout(function() {
					SetQuestion(prevId);
					$("#surveyQuestion").addClass("showPrev");
				}, 300);
				}
			}
		}

	function SaveCurrentResponse()
		{
		let questionId = $("#activeQuestionId").val();

		if (_activeQuestion_gv.response_type == "LikertPositive" || _activeQuestion_gv.response_type == "LikertNegative")
			_questionResponses_gv.find(x => x.question_id === questionId).response = $("input[name='likertQuestion']:checked").val();
		else 
			_questionResponses_gv.find(x => x.question_id === questionId).response = $("#textQuestionData").val();
		}

	function SetQuestion(questionId)
		{
		let index = GetQuestionIndex(questionId);

		if (index == null)
			{
			ShowError();
			}
		else 
			{
			let questionData = _survey_gv.questions[index];
			let responseData = _questionResponses_gv[index];

			$("#qNumber").text(index + 1);
			$("#activeQuestionId").val(questionId);
			_activeQuestion_gv = questionData;

			$("#question").text(questionData.question);
			if (questionData.response_type == "LikertPositive" || questionData.response_type == "LikertNegative")
				{
				$("#likertQuestion").show();
				$("#textQuestion").hide();

				$("input[name='likertQuestion']").prop('checked', false);
				if (responseData.response != null)
					$(`#likert-v${responseData.response}`).prop('checked', true);
				}
			else if (questionData.response_type == "Text")
				{
				$("#likertQuestion").hide();
				$("#textQuestion").show();

				$("#textQuestionData").val(responseData.response);
				}
			else 
				{
				ShowError();
				}
			}
		}

	function ReviewSurvey()
		{
		// If all questions have been answered then show message
		let errorQuestions = [];
		for (let q = 0; q < _questionResponses_gv.length; q++)
			{
			if (_questionResponses_gv[q].response == null || _questionResponses_gv[q].response == "")
				errorQuestions.push({qNumber: q + 1, data: _questionResponses_gv[q]});
			}

		if (errorQuestions.length == 0)
			{
			let successHtml = `<div class="headerText">Your assessment is complete and ready to submit!</div><br>`;
			successHtml += `<div class="subTitleText">Click the SUBMIT button below to complete your survey. Once submitted check your inbox for your results</div><br>`;
			successHtml += `<div id="fix-${_questionResponses_gv[0].question_id}" class="subTitleText" style="text-decoration: underline; cursor:pointer">Return to survey</div><br>`
			$("#surveyReview").html(successHtml);
			$("#submit-survey").show();
			}
		else 
			{
			let errorHtml = `<div style="font-size: 25px; font-weight: bold; color: #000000">You have ${errorQuestions.length} unanswered questions</div><br><br>`;
			errorHtml += `<div style="height: 80%; overflow-y: scroll;"">`;
			for(let q = 0; q < errorQuestions.length; q++)
				{
				errorHtml += `<div id="fix-${errorQuestions[q].data.question_id}" style="font-size: 18px; color: #A80606; width: 75%; margin: auto; text-decoration: underline; cursor:pointer">Fix Question ${errorQuestions[q].qNumber}</div><br>`;
				}
			errorHtml += `</div>`;
			
			$("#surveyReview").html(errorHtml);
			$("#submit-survey").hide();
			}

		$("[id^='fix-']").on('click', function() { FixQuestion($(this).attr("id").replace("fix-", "")); });
		}

	function FixQuestion(questionId)
		{
		$("#questionNavigation").show();
		$("#surveyQuestion").show();
		$("#surveyReview").hide();
		$("#surveySubmission").hide();

		SetQuestion(questionId);
		}

	function GetQuestionIndex(questionId)
		{
		let index = null;
		for(let q = 0; q < _survey_gv.questions.length; q++)
			{
			if (_survey_gv.questions[q].id == questionId)
				{
				index = q;
				break;
				}
			}

		return index;
		}

	function GetNextQuestionId(currentQid)
		{
		let nextQid = null;
		for(let q = 0; q < _survey_gv.questions.length; q++)
			{
			if (_survey_gv.questions[q].id == currentQid && q != _survey_gv.questions.length - 1)
				{
				nextQid = _survey_gv.questions[q + 1].id;
				break;
				}
			}

		return nextQid;
		}

	function GetPreviousQuestionId(currentQid)
		{
		let prevQid = null;
		for(let q = 0; q < _survey_gv.questions.length; q++)
			{
			if (_survey_gv.questions[q].id == currentQid && q != 0)
				{
				prevQid = _survey_gv.questions[q - 1].id;
				break;
				}
			}

		return prevQid;
		}

	function ShowError(message)
		{
		if (message != null)
			$("#surveyErrorMessage").text(message);

		$("#surveyLoading").hide();
		$("#surveyContent").hide();
		$("#surveyComplete").hide();
		$("#surveyError").show();
		}

	</script>

	<style>
		.custom-container{
			margin: auto; 
			width: 90%; 
			min-height: 75vh; 
            padding: 3%;
			background-color: #F1F1F1;  
			border: 1px solid #F1F1F1; 
			border-radius: 20px;
            font-family: Open Sans, sans-serif;
		}

		.surveyContentContainer{  
			padding: 15px;
			text-align: center; 
			background-color: #FFFFFF; 
			border-radius: 20px; 
			box-shadow: 0 10px 20px rgba(0,0,0, 0.2);
			width: 60%;
			margin: auto;
		}

		.titleText{
			text-align: center; 
			font-size: 40px; 
			font-weight: bold;
			padding-bottom: 20px;
		}

		.descriptionText{
			margin: 25px auto; 
			width: 40%; 
			text-align: center; 
			padding-top: 25px; 
			font-size: 20px; 
			font-weight: medium;
		}

		.headerText{
			text-align: center; 
			font-size: 25px; 
			font-weight: bold;
		}

		.subTitleText{
			margin: 0 auto;
			width: 50%; 
			text-align: center; 
			font-size: 20px; 
			font-weight: medium;
		}

		.questionContent{
			display: flex; 
			flex-direction: column; 
			height: 60vh;
			min-height: 340px;
		}

		.surveyHoldStates{
			min-height: 30vh;
			margin: auto;
		}

		.questionCounter{
			height: auto; 
			min-height: 50px;
			color: #777777;
			font-weight: normal;
		}

		.questionText{
			font-size: 20px;
			padding: 8px 4px;
			font-weight: bold;
			height: auto;
			min-height: 100px;
		}

		.buttonStyle{
			color: #fff;
			border: 1px solid #F1F1F1;
			border-radius: 8px;
			padding: 15px 30px;
			font-size: 20px; 
			cursor: pointer;
			background-image: linear-gradient(to right, #87CA80 0%, #51C3BC 50%, #1DBEF1 100%)
		}

		.buttonStyle2{
			color: #fff;
			border: 1px solid #F1F1F1;
			background-color: #777777;
			border-radius: 8px;
			padding: 15px 30px;
			font-size: 20px; 
			cursor: pointer;
		}

		.formContainer{
			margin: 8px 0; 
			margin: auto;
		}

		.questionContainer{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			color: #777777;
			font-size: 18px;
		}

		.questionOption{
			margin: 0 4px;
            font-size: 14px;
             line-height: normal !important;
		}

		.questionOption input:checked ~ label {
			color: #51C3BC;
			font-weight: bold;
		}

		.questionOption input:checked {
			accent-color: #51C3BC;
		}

		.questionNavigationContainer{
			height: 10%;
			min-height: 40px;
			display: flex;
			flex-direction: row;
			justify-content: center;
			margin: auto;
			width: 100%;
		}

		.questionNavigationButton{
			font-size: 16px;
			font-weight: bold;
			color: #000000;
			cursor: pointer;
		}

		.questionNavigationButton:hover{
			color: #51C3BC;
		}

		.textInputStyle{
			border: 1px solid #51C3BC;
			border-radius: 8px;
			background: #F1F1F1;
			width: 100%;
			height: 35px;
			padding: 1px 10px;
			z-index: 1;
		}

		@media(max-width: 1200px) {
			.surveyContentContainer{
				width: 90%; 
			}
		}

		@media(max-width: 1024px) {
           .custom-container{
			  width: 92%; 
              padding: 3%;
		    }

			.surveyContentContainer{  
				padding: 0;
				background-color: #F1F1F1; 
				border-radius: 0; 
				box-shadow: none;
				width: 100%;
			}

			.titleText{
				font-size: 35px; 
			}

			.descriptionText{
				padding-top: 20px; 
				font-size: 18px;
				width: 60%;  
			}

			.headerText{
				font-size: 20px; 
			}

			.subTitleText{
				width: 65%; 
				font-size: 16px; 
			}

			.questionText{
				font-size: 17px;
			}

			.buttonStyle{
				padding: 10px 20px;
				font-size: 22px; 
			}

			.questionContainer{
				font-size: 16px;
			}

			.questionOption{
				margin: 0 8px;
                font-size: 9px;
			}
		}

		@media(max-width: 850px) {
			.titleText{
				font-size: 25px; 
			}

			.descriptionText{
				padding-top: 15px; 
				font-size: 16px; 
				width: 80%; 
			}

			.headerText{
				font-size: 18px; 
			}

			.subTitleText{
				width: 80%; 
				font-size: 14px; 
			}

			.buttonStyle{
				padding: 8px 16px;
				font-size: 20px; 
			}

			.questionContainer{
				font-size: 15px;
			}
		}

		@keyframes hidePrev {
			0% { transform: translate(0);}
			100% { transform: translate(120vw);}
		}

		@keyframes hideNext {
			0% { transform: translate(0);}
			100% { transform: translate(-120vw);}
		}

		@keyframes showPrev {
			0% { transform: translate(-120vw);}
			100% { transform: translate(0vw);}
		}

		@keyframes showNext {
			0% { transform: translate(120vw);}
			100% { transform: translate(0vw);}
		}

		.hidePrev {
			animation: hidePrev 0.5s forwards ease-in-out;
			animation-delay: 0.2s;
		}

		.showPrev {
			animation: showPrev 0.3s forwards ease-in-out;
		}

		.hideNext {
			animation: hideNext 0.5s forwards ease-in-out;
			animation-delay: 0.2s;
		}

		.showNext {
			animation: showNext 0.3s forwards ease-in-out;
		}
	</style>
