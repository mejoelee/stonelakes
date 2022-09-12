
			
class Word
{
	constructor( pWord )
	{
		this.mWord = pWord;
		
		// lookup the definition
		const lUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + pWord;
		const lHttpResponse = httpGet( lUrl );
		const lDefinition = JSON.parse( lHttpResponse );
		
		// grab the first recorded pronunciation
		let lSoundUrl = null;
		this.mHasPronunciation = false;
		for( let i in lDefinition[ 0 ].phonetics )
		{
			lSoundUrl = lDefinition[ 0 ].phonetics[ i ].audio;
			if( lSoundUrl != null && lSoundUrl.length > 0 )
			{
				loadSound( "word:" + pWord, lSoundUrl );
				this.mHasPronunciation = true;
				break;
			}
		}
	}
	
	pronounce( pCallback )
	{
		if( this.mHasPronunciation )
		{
			playSound( "word:" + this.mWord, pCallback );					
		}
		else
		{
			synthesizeWord( this.mWord, pCallback );
		}
	}
}