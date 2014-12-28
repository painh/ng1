var Effect = function()
{
	var LIFE_TIME = 2000;

	this.Init = function(x, y, color, str, img)
	{
		this.x = x;
		this.y = y;
		this.str = str;
		this.img = img;
		this.color = color;
		this.alpha = 1.0;
		this.bornTime = Renderer.currentTime;
		this.font = '8pt Arial';
		this.world = false;
		this.life_time = LIFE_TIME;

		this.ax = 0;
		this.ay = 0; 
		this.type = 'normal';
		this.width = 0;
		this.height = 0;
		this.noBG = false;
		this.visible = false;
	}

	this.Update = function()
	{
		if(Renderer.currentTime - this.bornTime > this.life_time)
		{
			this.visible = false;
			return;
		}

		this.visible = true;
		this.alpha = 1.0 - ((Renderer.currentTime - this.bornTime) / this.life_time);
		this.x += this.ax;
		this.y += this.ay;
	}

	this.RenderText = function(x, y, text)
	{
		Renderer.SetFont(this.font); 
		if(this.noBG == false)
		{
			Renderer.SetColor("#000");
			var textWidth = Renderer.GetTextWidth(this.str); 
			Renderer.Rect(x, y, textWidth, Renderer.GetFontSize());
		}
		Renderer.SetColor(this.color);
		Renderer.Text(x , y, this.str);
	}

	this.Render = function()
	{
		if(!this.visible)
			return;

		Renderer.SetAlpha(this.alpha);

		var x = this.x;
		var y = this.y;
		if(this.world)
		{
			x -= g_cameraX;
			y -= g_cameraY;
		}

		if(this.img)
			Renderer.Img(x , y, this.img);

		if(this.str)
			this.RenderText(x, y, this.str);

		if(this.type == 'rect')
		{
			Renderer.SetColor(this.color);
			Renderer.Rect(x, y, this.width, this.height);
		}
	}
}


var EffectManager = function()
{
	this.list = [];
	this.effectIndex = 0;
	this.list.length = 50;

	for(var i = 0; i < this.list.length; ++i)
		this.list[i] = new Effect();

	this.Add = function(x, y, color, str, img)
	{
		this.effectIndex++;
		if(this.effectIndex >= this.list.length)
			this.effectIndex = 0; 

		this.list[this.effectIndex].Init(x, y, color, str, img);
		return this.list[this.effectIndex];
	} 

	this.Update = function()
	{
		for(var i = 0; i < this.list.length; ++i)
			this.list[i].Update();
	}

	this.Render = function()
	{
		for(var i = 0; i < this.list.length; ++i)
			this.list[i].Render();
	}

}


