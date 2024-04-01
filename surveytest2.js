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
