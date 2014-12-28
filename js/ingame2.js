var g_effectManager = new EffectManager();
var g_gameUI = new BtnManager();
var g_endGameUI = new BtnManager(); 
var g_objList = new ObjManager(); 
var g_imgs = []; 
var defaultState = 'gameOver';

var FontProto = function()
{
	this.size = 10;
	this.Text = function(x, y, text)
	{
		var str = text.toString();
		var img = g_imgs['font'];
		var size = this.size;
		for(var i in str)
		{
			var ascii = str[i].charCodeAt(0);
			var imgX = parseInt(ascii % 16) * 10;
			var imgY = parseInt(ascii / 16) * 10;

			Renderer.ImgBlt(x + i * size * 0.75, y, 
					img.img, 
					imgX, imgY, 10, 10,	
					size, size);
		}
	}

	this.SetSize = function(n)
	{
		this.size = n;
	}

	this.GetTextWidth = function(text)
	{
		return text.length * this.size * 0.75;
	}
} 
var Font = new FontProto();

var SceneIngame = function()
{ 
	this.SetState = function(state)
	{
		this.state = state;
		this.stateChangeTime = g_now;

//		if(state == 'lobby')
//			this.OpenShop();
		
		if(state == 'game')
		{
			g_floor = 0;
			g_player = null;
//			g_armorLv = 0;
//			g_weaponLv = 0;
			this.LoadStage();
		}
	}

	this.LoadImg = function(name, img, width, height)
	{
		g_imgs[name] = {};
		g_imgs[name].img = ImageManager.Register( "assets/"+img, name, true);
		g_imgs[name].width = width;
		g_imgs[name].height = height;
	}

	this.Start = function()
	{ 
		this.SetState(defaultState);
		this.LoadImg('font', 'font.png');
	}

	this.End = function()
	{
	} 
	
	this.Update = function()
	{ 
	}


	this.Render = function()
	{
		Renderer.SetAlpha(1.0); 
		Renderer.SetColor("#444"); 
		Renderer.Rect(0, 0, Renderer.width, Renderer.height);
		Renderer.SetColor('#000'); 
		Font.SetSize(16);
		Font.Text(0, 0, Renderer.lastFPS.toString()); 
	} 
};
