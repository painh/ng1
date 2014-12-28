var g_logo;
var g_ingame;

$(document).ready(function()
{
	jengineStart();
} );

function startGame()
{
	g_logo		= new SceneLogo();
	g_ingame	= new SceneIngame();
	SceneManager.Add( g_logo );
	SceneManager.Add( g_ingame );
}