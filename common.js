function get( pId )
{
	return document.getElementById( pId );
}

function debug( pMessage )
{
	if( true )
	{
		console.log( pMessage );
	}
}
function show( pId, pDisplay )
{
	get( pId ).style.display = pDisplay == null ? "inline" : pDisplay;
}

function hide( pId )
{
	get( pId ).style.display = "none";
}

function sleep( pMillis )
{
	return new Promise( resolve => setTimeout( resolve, pMillis ));
}

			
function insertBlankOption( pSelect )
{
	const lBlank = document.createElement( "option" );
	lBlank.value = -1;
	lBlank.text = "";
	pSelect.add( lBlank );
}
