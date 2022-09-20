var sDeck = null;

// callback after the word is read
function finishWord()
{
	/*
		this if check is necessary because of race condition in which the
		sound for correct answer is still playing, but "start over" was
		clicked before the asynchronous callback is called to show the
		next slide. the result was that the thumb div was not shown
	*/
	if( sDeck.mIsBusy )
	{
		sDeck.mIsBusy = false;
		sDeck.showNextCard();
	}
}

class Deck
{
	
	constructor( pWords, pInstructions )
	{
		this.mWords = pWords;
		this.mWordsToAsk = null;
		this.mCurrentWord = null;
		this.mIndex = -1;
		this.mStartMillis = Date.now();
		this.mIsBusy = false;
		
		/*
			because javascript passes arrays by reference,
			we need to copy the array one element at a time
			so that when we remove elements from the "asked"
			list, it doesn't affect the "master" word list
		*/
		this.mWordsToAsk = new Array( this.mWords.length );
		for( let i = 0; i < this.mWords.length; i++ )
		{
			this.mWordsToAsk[ i ] = this.mWords[ i ];
		}
		
		get( "flashcard" ).innerHTML = pInstructions;
		show( "flashcard" );
		hide( "buttons" );
		hide( "message" );
	}
	
	start()
	{
		this.showNextCard();
		get( "message" ).innerHTML = "";
		show( "buttons", "flex" );
		show( "message" );
	}
	
	showNextCard()
	{
		
		let lWord = null;
		
		if( this.mWordsToAsk.length == 0 )
		{
			// done
			this.endRound();
		}
		else // there at least one card left in the deck
		{
			// figure out which card to display
			while( true )
			{
				// pick a random word
				this.mIndex = Math.floor( this.mWordsToAsk.length * Math.random() );
				lWord = this.mWordsToAsk[ this.mIndex ];
				
				if( this.mCurrentWord != null && lWord == this.mCurrentWord.getWord() )
				{
					// we picked the same word two times in a row
					if( this.mWordsToAsk.length == 1 )
					{
						/*
							there is a possibility of the same word coming up two or more times in a row
							since we're not tracking number of times a particular word is asked. a quick
							fix is to check if we're asking the same word 2 times in a row. the only time
							that should be allowed is if it is the last word in the deck and the student
							keeps getting that word wrong, which is kind of an absurd scenario.
							therefore, if that happens, the round will just end.
						*/
						this.endRound();
						return;
					}
					// else, there are more than 1 card in the deck, so keep iterating
				}
				else // we didn't pick the same word twice
				{
					 // we're good to go
					 break;
				}
			} // end while

			// display the word
			this.mCurrentWord = new Word( this.mWordsToAsk[ this.mIndex ]);
			this.setCard( lWord );
			this.initCard();
		}
	}
	
	initCard()
	{
		;
	}
	
	setCard( pText )
	{
		get( "flashcard" ).innerHTML = "<p style='font-size:80px'>" + pText + "</p>";
	}

	getCurrentWord()
	{
		return this.mCurrentWord;
	}
	
	pass()
	{
		if( !this.mIsBusy )
		{	
			
			this.mIsBusy = true;
			
			// remove the word from list of words to ask
			this.mWordsToAsk.splice( this.mIndex, 1 );
			
			get( "message" ).innerHTML = ( sDeck.mWords.length - sDeck.mWordsToAsk.length ) + " / " + sDeck.mWords.length + " correct";

			playSound( "right", finishWord );
		}
	}
	
	fail()
	{
		if( !this.mIsBusy )
		{
			this.mIsBusy = true;
			
			this.mCurrentWord.pronounce( finishWord );
		}
	}
	
	endRound()
	{
		debug( "ending round" );
		hide( "buttons" );
		hide( "message" );
		
		const lSeconds = Math.round(( Date.now() - this.mStartMillis ) / 1000 );
		get( "flashcard" ).innerHTML = this.getResults( lSeconds );
	}

	getResults( pSeconds )
	{
		return this.constructor.name + " class must override Deck.getResults(pSeconds)";
	}
	
};
			
function populateGroupSelect( pGroups )
{
	const lGroupSelect = get( "groupSelect" );
	insertBlankOption( lGroupSelect );

	for( let iGroup in pGroups )
	{
		const lOption = document.createElement( "option" );
		lOption.value = iGroup;
		lOption.text = iGroup;
		lGroupSelect.add( lOption );
	}
}

function populateListSelect()
{
	// in case a new group was selected in the middle of a round, hide the cards/buttons
	hide( "flashcard" );
	hide( "buttons" );
	hide( "message" );
	
	const lGroupSelect = get( "groupSelect" );

	// remove all list options
	const lListSelect = get( "listSelect" );
	for( ignored in lListSelect.options )
	{
		lListSelect.options.remove( 0 );
	}
	
	// only populate the list if an actual group (not blank line) was selected
	const lGroupId = lGroupSelect.value;
	if( lGroupId != -1 )
	{
		insertBlankOption( lListSelect );

		let lList = sWords[ lGroupId ];
		for( let iList in lList )
		{
			let lOption = document.createElement( "option" );
			lOption.value = iList;
			lOption.text =iList;
			lListSelect.add( lOption );
		}
		show( "list" );
	}
	else // blank line selected
	{
		hide( "list" );
	}
}

loadSound( "right", "right.mp3" );
loadSound( "wrong", "wrong.mp3" );