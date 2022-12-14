function playNote( pFrequency, pDurationSeconds, pWaveType )
{
	var sContext = new ( window.AudioContext || window.webkitAudioContext )();
	var sOscillator = sContext.createOscillator();
	sOscillator.type = pWaveType == null ? "sine" : pWaveType;
	sOscillator.frequency.value = pFrequency;
	sOscillator.connect( sContext.destination );
	sOscillator.start();
	sOscillator.stop( sContext.currentTime + pDurationSeconds );
}

var sSounds = new Array();

function loadSound( pId, pUrl )
{
	sSounds[ pId ] = new Audio( pUrl );
}

function playSound( pId, pCallback )
{
	sSounds[ pId ].onended = pCallback;
	sSounds[ pId ].play();
}

const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

				
function synthesizeWord( pWord, pCallback )
{
	const lUtterance = new SpeechSynthesisUtterance( pWord );
	lUtterance.onend = pCallback;
	speechSynthesis.speak( lUtterance );
}