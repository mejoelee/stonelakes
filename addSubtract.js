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

function startQuiz( pStart, pEnd, pNumberOfQuestions )
{	
	let lRange = pEnd - pStart;
	
	for( let iQuestions = 0; iQuestions < pNumberOfQuestions; iQuestions++ )
	{
		let lFirstNumber = 0;
		let lSecondNumber = 0;
		
		// pick 2 random numbers
		do
		{
			lFirstNumber = Math.floor( lRange * Math.random() ) + pStart;
			lSecondNumber = Math.floor( lRange * Math.random() ) + pStart;
		}
		while( lFirstNumber == lSecondNumber );
		
		let lIsAddition = Math.random < 0.5;
		sCurrentEquation = new Equation( lFirstNumber, lSecondNumber, lIsAddition );
		sCurrentEquation.show();
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
	
	show( pShowAnswer )
	{
		showEquation( this.mFirstNumber + " " + this.mOperator + " " + this.mSecondNumber + " = " + ( pShowAnswer ? this.mSumOrDifference : "?" ));
	}
}

function showEquation( pText )
{
	get( "equation" ).innerHTML = "<p class='equation'>" + pText + "</p>";
}

async function clickedAnswer( pNumber )
{
	// show the answer
	sCurrentEquation.show( true );
	
	if( pNumber == sCurrentEquation.mSumOrDifference )
	{
		// correct answer was given
		playSound( "right" );
		await sleep( 1000 );
	}
	else // wrong answer
	{
		playSound( "wrong" );
		await sleep( 2000 );
	}
	alert("foo");
}