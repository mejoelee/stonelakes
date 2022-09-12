function httpGet( pUrl )
{
	const lHttpRequest = new XMLHttpRequest();
	lHttpRequest.open( "GET", pUrl, false );
	lHttpRequest.send( null );
	return lHttpRequest.responseText;
}