function get( pId )
{
	return document.getElementById( pId );
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