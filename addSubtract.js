/*
	dependencies:	common.js
					audio.js
*/

loadSound( "right", "right.mp3" );
loadSound( "wrong", "wrong.mp3" );

function writeTable( pStart, pEnd )
{
	document.write( "<table><tr>\r\n" );
	for( let i = pStart; i <= pEnd; i++ )
	{
		document.write( "<td onClick='clickedAnswer(" );
		document.write( i );
		document.write( ")'>" );
		document.write( i );
		document.write( "</td>\r\n" );
		if( i % 10 == 9 && i != pEnd )
		{
			document.write( "</tr><tr>\r\n" );	
		}
	}
	document.write( "</tr></table>\r\n" );
}

var sNumberSet = null;
var sCurrentIndex = null;
var sStart = null;
var sRange = null;
var sIncorrectCount = null;
var sStartTime = null;
var sEquations = null;
var sIsAddition = null;

function startQuiz( pNumberSet, pStart, pEnd, pIsAddition )
{
	sNumberSet = pNumberSet;
	sStart = pStart;
	sRange = pEnd - pStart;
	sIncorrectCount = 0;
	sStartTime = Date.now();
	sIsAddition = pIsAddition;
	
	/**
		create the questions. the only way to avoid duplicates
		and omissions is to generate all of the questions
		sequentially and pick them at random, removing them
		from the array as we go
	**/
	sEquations = new Array();
	if( sNumberSet == 8888 )
	{
		hide( "answers" );
		get( "equation" ).innerHTML = "";	
	}
	else
	{
		if( sNumberSet == 9999 )
		{
			for( let iFirstNumber = pStart; iFirstNumber <= pEnd; iFirstNumber++ )
			{
				createAdditionQuestions( iFirstNumber, pStart, pEnd );
				createSubtractionQuestions( iFirstNumber, pStart, pEnd );
			}
		}
		else if( pIsAddition )
		{
			createAdditionQuestions( pNumberSet, pStart, pEnd );
		}
		else
		{
			createSubtractionQuestions( pNumberSet, pStart, pEnd );
		}
		
		show( "answers" );
		askNextQuestion();
		}
}

function createAdditionQuestions( pNumberSet, pStart, pEnd )
{
	for( let iSecondNumber = pStart; iSecondNumber <= pEnd; iSecondNumber++ )
	{
		let lEquation = new Equation( pNumberSet, iSecondNumber, true );
		sEquations.push( lEquation );
	}
}

function createSubtractionQuestions( pNumberSet, pStart, pEnd )
{
	for( let i = pStart; i <= pEnd; i++ )
	{
		let lFirstNumber = pNumberSet + i;
		let lEquation = new Equation( lFirstNumber, pNumberSet, false );
		sEquations.push( lEquation );
	}
}

function askNextQuestion()
{
	// are there more questions?
	if( sEquations.length > 0 )
	{
		sCurrentIndex = Math.floor( sEquations.length * Math.random() );
		sEquations[ sCurrentIndex ].show();
	}
	else // done, display results
	{
		hide( "answers" );
		const lTime = Math.round(( Date.now() - sStartTime ) / 1000 );
		if( sIncorrectCount == 0 )
		{
			get( "equation" ).innerHTML = "You answered all correctly<br>in " + lTime + " seconds!<br><button onClick='startQuiz( sNumberSet, sStart, sRange + sStart, sIsAddition )'>Try Again</button>"
		}
		else
		{
			get( "equation" ).innerHTML = "You answered " + sIncorrectCount + " incorrectly<br>in " + lTime + " seconds!<br><button onClick='startQuiz( sNumberSet, sStart, sRange + sStart, sIsAddition )'>Try Again</button>"		
		}
	}
}

var sOperations = [ "+", "-" ];
function writeSelectNumberSet()
{
	// addition
	for( let i = 2; i <= 10; i++ )
	{
		document.write( "<option value='" );
		document.write( i );
		document.write( "+'>+" );
		document.write( i );
		document.write( "</option>" );
	}
	
	// subtraction
	for( let i = 0; i <= 10; i++ )
	{
		document.write( "<option value='" );
		document.write( i );
		document.write( "-'>-" );
		document.write( i );
		document.write( "</option>" );
	}
}

class Equation
{
	constructor( pFirstNumber, pSecondNumber, pIsAddition )
	{
		this.mFirstNumber = pFirstNumber;
		this.mSecondNumber = pSecondNumber;
		this.mOperator = pIsAddition ? "+" : "-";
		this.mSumOrDifference = pIsAddition ? pFirstNumber + pSecondNumber : this.mFirstNumber - this.mSecondNumber;
	}
	
	show( pShowAnswer, pWasWrong )
	{
		let lAnswer = "?";
		if( pShowAnswer )
		{
			if( pWasWrong )
			{
				lAnswer = "<span class='wrong'>" + this.mSumOrDifference + "</span>";
			}
			else
			{
				lAnswer = this.mSumOrDifference;
			}
		}
		showEquation( this.mFirstNumber + " " + this.mOperator + " " + this.mSecondNumber + " = " + lAnswer );
	}
}

function showEquation( pText )
{
	get( "equation" ).innerHTML = "<p class='equation'>" + pText + "</p>";
}

var sWasClicked = false;
async function clickedAnswer( pNumber )
{
	if( !sWasClicked )
	{
		sWasClicked = true;
		const lCurrentEquation = sEquations[ sCurrentIndex ];
		if( pNumber == lCurrentEquation.mSumOrDifference )
		{
			// correct answer was given
			lCurrentEquation.show( true );
			sEquations.splice( sCurrentIndex, 1 );
			playSound( "right" );
			await sleep( 500 );
		}
		else // wrong answer
		{
			++sIncorrectCount;
			lCurrentEquation.show( true, true );
			playSound( "wrong" );
			await sleep( 2000 );
		}
		askNextQuestion();
		sWasClicked = false;
	}
}
var sNumberSet = null;
function selectNumberSet( pNumberSet )
{
	const lNumberSet = parseInt( pNumberSet.substring( 0, pNumberSet.length - 1 ));
	startQuiz( lNumberSet, 0, 10, pNumberSet.endsWith( "+" ));
}