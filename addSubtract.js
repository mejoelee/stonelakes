/*
	dependencies:	common.js
					audio.js
*/


var sNumberSet = null;
var sCurrentIndex = null;
var sStart = null;
var sRange = null;
var sIncorrectCount = null;
var sStartTime = null;
var sEquations = null;
var sOperation = null;
var ALL = new Array();

class Operation
{
	static ADD = new Operation( "+", "+" );
	static SUBTRACT = new Operation( "-", "-" );
	static MULTIPLY = new Operation( "*", "&times;" );
	static DIVIDE = new Operation( "/", "&divide;" );
	
	constructor( pCode, pHtml )
	{
		this.code = pCode;
		this.html = pHtml;
		ALL.push( this );
	}
	
	getAnswer( pFirstNumber, pSecondNumber )
	{	
		switch( this )
		{
			case Operation.ADD:
				return pFirstNumber + pSecondNumber;
				
			case Operation.SUBTRACT:
				return pFirstNumber - pSecondNumber;
				
			case Operation.MULTIPLY:
				return pFirstNumber * pSecondNumber;
				
			case Operation.DIVIDE:
				return pFirstNumber / pSecondNumber;
		}
	}
	
	static find( pCode )
	{
		for( let i in ALL )
		{
			let lElement = ALL[ i ];
			if( lElement.code === pCode )
			{
				return lElement;
			}
		}
	}
	
	createQuestions( pNumberSet, pStart, pEnd, pArray )
	{
		hide( "answers" );
		hide( "answers100" );
		switch( this )
		{
			case Operation.ADD: 
				for( let iSecondNumber = pStart; iSecondNumber <= pEnd; iSecondNumber++ )
				{
					pArray.push( new Equation( pNumberSet, iSecondNumber, Operation.ADD ));
				}
				break;
			
			case Operation.SUBTRACT:
				for( let i = pStart; i <= pEnd; i++ )
				{
					let lFirstNumber = pNumberSet + i;
					pArray.push( new Equation( lFirstNumber, pNumberSet, Operation.SUBTRACT ));
				}
				break;
				
			
			case Operation.MULTIPLY:
				for( let iSecondNumber = pStart; iSecondNumber <= pEnd; iSecondNumber++ )
				{
					pArray.push( new Equation( pNumberSet, iSecondNumber, Operation.MULTIPLY ));
				}
				break;
				
			case Operation.DIVIDE:
				for( let i = pStart; i <= pEnd; i++ )
				{
					let lFirstNumber = pNumberSet * i;
					if( lFirstNumber != 0 )
					{
						pArray.push( new Equation( lFirstNumber, pNumberSet, Operation.DIVIDE ));
					}
				}
				break;
		}
	}
}

loadSound( "right", "right.mp3" );
loadSound( "wrong", "wrong.mp3" );

function writeAnswerDiv()
{
	document.writeln( "<select id='hundreds' class='answer' onfocus='showLong( this )' onblur='showShort( this, 100 )' onchange='this.blur()'>" );
	for( let i = 0; i <= 1; i++ )
	{
		let lValue = i * 100;
		document.write( "<option value='");
		document.write( lValue );
		document.write( "'>" );
		document.write( lValue );
		document.write( "</option>")
	}
	document.write( "</select>" );
	document.write( "<select id='tens' class='answer' onfocus='showLong( this )' onblur='showShort( this, 10 )' onchange='this.blur()'>" );
	for( let i = 0; i <= 9; i++ )
	{
		let lValue = i * 10;
		document.write( "<option value='");
		document.write( lValue );
		document.write( "'>" );
		document.write( lValue );
		document.write( "</option>")
	}
	document.write( "</select>" );
	document.write( "<select id='ones' class='answer'>" );
	for( let i = 0; i <= 9; i++ )
	{
		document.write( "<option value='");
		document.write( i );
		document.write( "'>" );
		document.write( i );
		document.write( "</option>")
	}
	document.write( "</select>" );
	document.write( "<button onClick='submitMultiplicationAnswer()'> ok </button>" );
}
async function submitMultiplicationAnswer()
{
	let lHundreds = parseInt( get( "hundreds" ).value );
	let lTens = parseInt( get( "tens" ).value );
	let lOnes = parseInt( get( "ones" ).value );
	submitAnswer( lHundreds + lTens + lOnes );
	get( "hundreds" ).value = 0;
	get( "tens" ).value = 0;
	get( "ones" ).value = 0;
}
function showLong( pSelect )
{
	[].forEach.call( pSelect.options, function( pOption )
	{
		pOption.textContent = pOption.getAttribute( 'value' );
	});
}
function showShort( pSelect, pDenominator )
{
	[].forEach.call( pSelect.options, function( pOption )
	{
		pOption.textContent = pOption.getAttribute( 'value' ) / pDenominator;
	});
}
function writeTable( pStart, pEnd )
{
	document.write( "<table><tr>\r\n" );
	for( let i = pStart; i <= pEnd; i++ )
	{
		document.write( "<td onClick='submitAnswer(" );
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

function writeSelectNumberSet()
{
	document.write( "<option value='c0'></option>" );
	document.write( "<option value='+9999'>All Addition</option>" );
	document.write( "<option value='-9999'>All Subtraction</option>" );
	document.write( "<option value='*9999'>All Multiplication</option>" );
	document.write( "<option value='/9999'>All Division</option>" );
	// addition
	for( let i = 0; i <= 10; i++ )
	{
		document.write( "<option value='+" );
		document.write( i );
		document.write( "'>add " );
		document.write( i );
		document.write( "</option>" );
	}
	
	// subtraction
	for( let i = 0; i <= 10; i++ )
	{
		document.write( "<option value='-" );
		document.write( i );
		document.write( "'>subtract " );
		document.write( i );
		document.write( "</option>" );
	}
	
	// multiplication
	for( let i = 0; i <= 12; i++ )
	{
		document.write( "<option value='*" );
		document.write( i );
		document.write( "'>multiply " );
		document.write( i );
		document.write( "</option>" );
	}
	
	// division
	for( let i = 1; i <= 12; i++ )
	{
		document.write( "<option value='/" );
		document.write( i );
		document.write( "'>divide by " );
		document.write( i );
		document.write( "</option>" );
	}
}

function startQuiz( pNumberSet, pStart, pEnd, pOperation )
{
	sNumberSet = pNumberSet;
	sStart = pStart;
	sRange = pEnd - pStart;
	sIncorrectCount = 0;
	sStartTime = Date.now();
	sOperation = pOperation;
	
	/**
		create the questions. the only way to avoid duplicates
		and omissions is to generate all of the questions
		sequentially and pick them at random, removing them
		from the array as we go
	**/
	sEquations = new Array();
	if( sNumberSet == 0000 ) // code for clear 
	{
		hide( "answers" );
		hide( "answers100" );
		get( "equation" ).innerHTML = "";	
	}
	else
	{
		if( sNumberSet == 9999 ) // code for all
		{
			for( let iFirstNumber = pStart; iFirstNumber <= pEnd; iFirstNumber++ )
			{
				pOperation.createQuestions( iFirstNumber, pStart, pEnd, sEquations );
			}
		}
		else
		{
			pOperation.createQuestions( pNumberSet, pStart, pEnd, sEquations );
		}
		show( pOperation == Operation.MULTIPLY ? "answers100" : "answers" );
		askNextQuestion();
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
		hide( "answers100" );
		const lTime = Math.round(( Date.now() - sStartTime ) / 1000 );
		if( sIncorrectCount == 0 )
		{
			get( "equation" ).innerHTML = "You answered all correctly<br>in " + lTime + " seconds!<br><button onClick='startQuiz( sNumberSet, sStart, sRange + sStart, sOperation )'>Try Again</button>"
		}
		else
		{
			get( "equation" ).innerHTML = "You answered " + sIncorrectCount + " incorrectly<br>in " + lTime + " seconds!<br><button onClick='startQuiz( sNumberSet, sStart, sRange + sStart, sOperation )'>Try Again</button>"		
		}
	}
}

class Equation
{
	constructor( pFirstNumber, pSecondNumber, pOperation )
	{
		this.mFirstNumber = pFirstNumber;
		this.mSecondNumber = pSecondNumber;
		this.mOperation = pOperation;
		this.mAnswer = pOperation.getAnswer( pFirstNumber, pSecondNumber );
	}
	
	show( pShowAnswer, pWasWrong )
	{
		let lAnswer = "?";
		if( pShowAnswer )
		{
			if( pWasWrong )
			{
				lAnswer = "<span class='wrong'>" + this.mAnswer + "</span>";
			}
			else
			{
				lAnswer = this.mAnswer;
			}
		}
		showEquation( this.mFirstNumber + " " + this.mOperation.html + " " + this.mSecondNumber + " = " + lAnswer );
	}
}

function showEquation( pText )
{
	get( "equation" ).innerHTML = "<p class='equation'>" + pText + "</p>";
}

var sWasClicked = false;
async function submitAnswer( pNumber )
{
	if( !sWasClicked )
	{
		sWasClicked = true;
		const lCurrentEquation = sEquations[ sCurrentIndex ];
		if( pNumber == lCurrentEquation.mAnswer )
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
	const lNumberSet = parseInt( pNumberSet.substring( 1, pNumberSet.length ));
	const lCode = pNumberSet.substring ( 0, 1 );
	let lOperation = Operation.find( lCode );
	startQuiz( lNumberSet, 0, 10, lOperation );
}
