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
		if( i % 10 == 0 && i != pEnd )
		{
			document.write( "</tr><tr>\r\n" );	
		}
	}
	document.write( "</tr></table>\r\n" );
}

var sCurrentEquation = null;
var sStart = null;
var sRange = null;
var sNumberOfQuestions = null;
var sCorrectCount = null;
var sAskedCount = null;

function startQuiz( pStart, pEnd, pNumberOfQuestions )
{	
	sStart = pStart;
	sRange = pEnd - pStart;
	sNumberOfQuestions = pNumberOfQuestions;
	sAskedCount = 0;
	sCorrectCount = 0;
	
	askNextQuestion();
}

function askNextQuestion()
{
	if( sAskedCount++ < sNumberOfQuestions )
	{
		let lFirstNumber = 0;
		let lSecondNumber = 0;
		
		// pick 2 random numbers
		do
		{
			lFirstNumber = Math.floor( sRange * Math.random() ) + sStart;
			lSecondNumber = Math.floor( sRange * Math.random() ) + sStart;
		}
		while( lFirstNumber == lSecondNumber ); // make sure the number aren't equal
		
		// determine the operator
		let lIsAddition = Math.random() < 0.5;
		
		// create and show new equation
		sCurrentEquation = new Equation( lFirstNumber, lSecondNumber, lIsAddition );
		sCurrentEquation.show();
	}
	else // done, display results
	{
		alert(sCorrectCount);
	}
}

class Equation
{
	constructor( pFirstNumber, pSecondNumber, pIsAddition )
	{
		// transpose the numbers if the operation is subtraction and the second number is greater
		let lTransposeNumbers = !pIsAddition && ( pSecondNumber > pFirstNumber );
		
		this.mFirstNumber = lTransposeNumbers ? pSecondNumber : pFirstNumber;
		this.mSecondNumber = lTransposeNumbers ? pFirstNumber : pSecondNumber;
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

async function clickedAnswer( pNumber )
{
	if( pNumber == sCurrentEquation.mSumOrDifference )
	{
		// correct answer was given
		++sCorrectCount;
		sCurrentEquation.show( true );
		playSound( "right" );
		await sleep( 500 );
	}
	else // wrong answer
	{
		sCurrentEquation.show( true, true );
		playSound( "wrong" );
		await sleep( 2000 );
	}
	askNextQuestion();
}