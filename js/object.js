var g_objTable = {
					player:[
								[0, 0, 40, 80],
								[10, 0, 80, 80], 
					],
					block:[
								[0, 0, 60, 60 + 14],
					],
					boss:[
								[0, 0, 40, 40],
					],
					key :[
								[0, 0, 60, 60],
							],
					gold :[
								[0, 0, 40, 40],
								[0, 0, 40, 40],
								[0, 0, 40, 40],
								[0, 0, 40, 40],
								[0, 0, 40, 40],
								[0, 0, 40, 40],
							], 
					mon : [
								[00		, 00, 00, 00],
//chicken								
								[10		, 12, 30, 30],
								[20		, 14, 30, 30],
								[30		, 16, 30, 30],
								[40		, 18, 30, 30],
								[50		, 20, 30, 30],
//slime
								[60		, 30, 20, 20],
								[70		, 32, 20, 20],
								[80		, 34, 20, 20],
								[90		, 36, 20, 20],
								[100	, 38, 20, 20],
//bat
								[120	, 40, 20, 20],
								[130	, 42, 20, 20],
								[140	, 44, 20, 20],
								[150	, 46, 20, 20],
								[160	, 48, 20, 20],
							],
					weapon : [
								[00, 02, 40, 40],
								[00, 04, 40, 40],
								[00, 06, 40, 40],
								[00, 08, 40, 40],
								[00, 08, 40, 40],
								[00, 08, 40, 40],
								[00, 08, 40, 40],
								[00, 08, 40, 40],
								[00, 00, 40, 40]
							],
					armor : [
								[00, 02, 40, 40],
								[00, 04, 40, 40],
								[00, 06, 40, 40],
								[00, 08, 40, 40],
								[00, 08, 40, 40],
								[00, 08, 40, 40],
								[00, 08, 40, 40],
								[00, 08, 40, 40],
								[00, 00, 40, 40]
							]
				};

var moveDelay = 300;
function GetPlayer(obj1, obj2)
{
	var ret = { player : null, other : null};

	if(obj1.Dead() || obj2.Dead())
		return false;

	if(obj1.type == 'player')
	{
		ret.player = obj1;
		ret.other = obj2;
		return ret;
	} 

	if(obj2.type == 'player')
	{
		ret.player = obj2;
		ret.other = obj1;
		return ret;
	}

	return false;
}
var Obj = function()
{
	this.x = 0;
	this.y = 0;
	this.ax = 0;
	this.ay = 0;
	this.hp = 1;
	this.maxHP = 1;
	this.ap = 10;
	this.exp = 0;
	this.turnLife = -1;
	this.hpRegen = 0.0;
	this.forceStop = false;
	this.scaleDefalt = 1.0;
	this.renderX = this.x;
	this.renderY = this.y;
	this.alredyFight = false;
//	this.turnLife = 3;

	this.scale = 0.0;
	this.type = 0;
	this.level = 0;
	this.state = 'normal';
	this.stateChangeDate = new Date();

	this.isPlayer = false;
	this.dead = false;

	this.setTypeDelay = 0;
	this.setType = '';
	this.imgWidth = TILE_WIDTH;
	this.imgHeight = TILE_HEIGHT;

	this.IsMon = function()
	{
		switch(this.type)
		{
			case 'mon':
				return true;
		}

		return false;
	}

	this.SetType = function(type, delay)
	{
		if(delay == undefined)
			delay = 0;

		if(delay == 0)
		{
			this.type = type;
			return;
		}

		this.setTypeDelay = g_now.getTime() + delay; 
		this.setType = type;
	}

	this.SetDead = function(after)
	{
		if(after == undefined)
			after = 0;

		this.dead = g_now.getTime() + after;
	}

	this.Dead = function()
	{
		if(this.dead == false)
			return false;

		return true;
	}

	this.Removed = function()
	{
		if(this.dead == false)
			return false;


		if(g_now.getTime() > this.dead)
			return true;

		return false;
	}

	this.RefreshStat = function()
	{
		var ret = g_objTable.hasOwnProperty(this.type);
//		console.log(this.type, ret, g_objTable);
		if(!g_objTable.hasOwnProperty(this.type))
			return;

		var obj = g_objTable[this.type][this.level];

//		console.log('-------');
//		console.log(this, obj);

//		this.ap = this.level;
		this.ap = obj[0];
		this.hp = obj[1]; 
		this.imgWidth = obj[2];
		this.imgHeight = obj[3];
//		this.def = def;
		this.turnLife = 8;
		if(this.type == 'block')
			console.log(this, obj);
	}

	this.SetState = function(state)
	{
		this.state = state;
		this.stateChangeDate = new Date(); 
	}

	this.Update = function()
	{
		if(this.scale < 1.0)
		{
			this.scale += 0.05;
			if(this.scale > 1.0)
				this.scale = 1.0;
		}

		if(this.scale > 1.0)
		{
			this.scale -= 0.05;
			if(this.scale < 1.0)
				this.scale = 1.0;
		}

		this.renderX = this.x - g_cameraX;
		this.renderY = this.y - g_cameraY;
		var cur = new Date;

		if(this.setTypeDelay < g_now && this.setType != '')
		{
			this.type = this.setType;
			this.setType = ''; 
		}

		switch(this.state)
		{
			case 'normal':
				break;

			case 'damaged':
				if(cur.getTime() - this.stateChangeDate.getTime() > 100)
					this.SetState('norma');
				else
				{
					this.renderX += randomRange(0, 10) - 5; 
					this.renderY += randomRange(0, 10) - 5; 
				}
				break;

		}
	}

	this.Moveable = function()
	{
		switch(this.type)
		{
			case 'key':
			case 'boss':
			case 'block':
			case 'merchant':
			case 'dark':
			case 'npc':
			case 'ddong':
			case 'door':
				return false;

			case 'mon':
//				if(this.level >= 3)
//					return false;
				break;

			case 'gold':
//				if(this.level >= 3)
//					return false;
				break;
		} 

		return true;
	}

	this.Move = function()
	{ 
		if(this.Dead())
			return;

		if(this.Moveable() == false)
			return;

		if(g_objList.ax == 0 && g_objList.ay == 0)
			return;

		if(this.forceStop)
			return;

		var x = this.x + g_objList.ax;
		var y = this.y + g_objList.ay;

		if(x < 0 || y < 0 ||
			x + TILE_WIDTH > MAP_WIDTH * TILE_WIDTH ||
			y + TILE_HEIGHT > MAP_HEIGHT * TILE_HEIGHT)
		{
			this.forceStop = true;
			return;
		}

		var ret = g_objList.CheckCollision(x, y, this);
		var finalFlag = false; 

		for(var i in ret)
		{
			var target = ret[i];

			if(target.Dead())
				continue;

			if(target.type == 'dark')
				continue;

//			if(target.type == 'block')
//				this.forceStop = true;

			if(target.type != this.type)
				this.forceStop = true;

			if((target.type == 'weapon' && this.type == 'weapon') ||
				(target.type == 'armor' && this.type == 'armor'))

			{
				var level = Math.max(this.level, target.level) + 1;
				if(level <= WEAPON_LEVEL_MAX)
				{
					console.log('combined');
					target.level = level;
					target.RefreshStat();
					target.scale = 1.5;
					this.SetDead();
				}
				this.forceStop = true;
			}

			if(target.IsMon() && this.IsMon())
			{
				var level = Math.max(this.level, target.level) + 1;
				if(level <= MON_LEVEL_MAX)
				{
					target.level = level;
					target.RefreshStat();
					target.scale = 1.5;
					this.SetDead();
				}
				this.forceStop = true;
			}

			if(target.type == 'gold' && this.type == 'gold')
			{
				var level = Math.max(this.level, target.level) + 1;
				this.SetDead();
					target.scale = 2.0;
				if(level <= 3)
					target.level = level;
				else
				{
					var rand = randomRange(0, 1);
					if(rand == 0)
						target.type = 'weapon';
					else 
						target.type = 'armor';

					target.level = 1; 
				}
				this.forceStop = true;
			} 

			var obj =  GetPlayer(this, target); 
			if(obj)
			{ 
				var player = obj.player; 
				var other = obj.other;
				var effectX = other.x - g_cameraX;
				var effectY = other.y - g_cameraY;

				if(other.type == 'key')
				{
					target.SetDead();
					g_summonKey++;
				} 

				if(other.type == 'weapon')
				{
					var prevLevel = g_weaponLv;

					if(g_weaponLv < other.level)
						g_weaponLv = other.level; 
					else
					{
						g_weaponExp += other.level;
						if(g_weaponExp >= g_weaponLv * 2)
							g_weaponLv++;
					}

					if(g_weaponLv > prevLevel)
						g_weaponExp = 0;
					other.SetDead(); 
					if(g_weaponLv > WEAPON_LEVEL_MAX)
						g_weaponLv = WEAPON_LEVEL_MAX;
					this.forceStop = true;
				}

				if(other.type == 'armor')
				{
					var prevLevel = g_armorLv;

					if(g_armorLv < other.level)
						g_armorLv = other.level; 
					else
					{
						g_armorExp += other.level;
						if(g_armorExp >= g_armorLv * 3)
							g_armorLv++;
					}

					if(g_armorLv > prevLevel)
						g_armorExp = 0;
					other.SetDead(); 
					if(g_armorLv > WEAPON_LEVEL_MAX)
						g_armorLv = WEAPON_LEVEL_MAX;
					this.forceStop = true;
				}

				if(other.type == 'gold')
				{
					AddGold(other.level);
//					g_effectManager.Add(effectX, effectY, '#ffffff', 'gold + ' + other.level);

					other.SetDead(); 
					this.forceStop = true;
				}

				if((other.IsMon() || other.type == 'boss' ) && other.alredyFight == false)
				{ 
					g_objList.MoveDelay(moveDelay); 

					var img = g_imgs['effect'];
					var efx = player.x - (player.x - other.x) / 2 + (TILE_WIDTH - img.width) / 2; 
					var efy = player.y - (player.y - other.y) / 2 + (TILE_WIDTH - img.height) / 2;
					console.log(player.x, player.y);
					console.log(other.x, other.y);
					console.log(img);
					console.log(efx, efy);
					var effect = g_effectManager.Add(efx, efy, 0, 0, img.img);
					effect.life_time = 500;
					effect.world = true;

					other.alredyFight = true;
					var playerDmg = - (g_playerAp + (g_weaponLv) * 10);
					console.log('player dmg' + playerDmg);
					if(playerDmg < 0)
					{
						other.SetState('damaged');
						other.hp += playerDmg; 
//						g_effectManager.Add(other.renderX, other.renderY + TILE_HEIGHT / 2 - 5, '#f00', playerDmg);
//						if(other.hp  > 0)
//							g_effectManager.Add(other.renderX, other.renderY + TILE_HEIGHT / 2 + 5, '#fff', 'hp : ' + other.hp);
					}

					if(other.hp <= 0)
					{
						var rand = randomRange(1, 5);
						console.log('key convert rand', [rand, other.level % 5]);
						if(rand <= other.level )
						{
							other.SetType('key', 0);
							other.scale = 0;
							other.SetState('normal');
							other.level = 0;
							other.RefreshStat();
						}
						else
							other.SetDead();

						g_killMonCnt++; 

						var levelUp = AddExp(other.level);
						this.forceStop = true;

						if(other.type == 'boss')
						{
							g_newGameFlag = true;
							g_newGameFlagTime = g_now; 
							g_newGameFlagLoaded = false;
						}


						var colors = ['#954349', '#d9ac00', '#b4ea00', '#089398', '#8202be'] ;
						var color = colors[other.level - 1];


						for(var i = 0; i < 30; ++i)
						{
							var x = other.x + TILE_WIDTH/ 2;
							var y = other.y + TILE_HEIGHT / 2;
							var eff = g_effectManager.Add(x, y, color);
							eff.ax = (randomRange(0, 100) - 50) / 10;
							eff.ay = (randomRange(0, 100) - 50) / 10;
							eff.x += eff.ax;
							eff.y += eff.ay;
							eff.type = 'rect';
							var size = randomRange(5, 10);
							eff.width = size;
							eff.height = size;
							eff.world = true;
							eff.life_time = 300;
						}
					} 

					if(other.Dead() == false)
					{ 
						var dmg = (g_playerDp + g_armorLv) * 10 -other.ap;
						console.log(g_playerDp, g_armorLv, other.ap, dmg);
//						dmg = Math.max(dmg, -1);
						if(dmg < 0) 
							AddHP(dmg);
//						else 
//							g_effectManager.Add(effectX, effectY, '#0f0', 'no damage!');
					}
				} 
			}
		}

		if(this.forceStop == false)
		{
			this.x = x;
			this.y = y;
		} 
	}

	this.Render = function()
	{ 
		Renderer.SetAlpha(1);

//			if(this.flip == false) 
//				Renderer.Img(x, y, img);
//			else
//				Renderer.ImgFlipH(x, y, img);

	
		var x = this.renderX;
		var y = this.renderY;
		var img = g_imgs[this.type];

		if(this.type == 'gold' || this.type == 'box' || this.IsMon() || this.type == 'weapon' || this.type == 'armor' || this.type =='dark')
			img = g_imgs[this.type+'_'+this.level];

//		if(this.type == 'mon')
//		{
//			var enemyAp = this.ap;
//			var enemyExp = this.level; 
//
//			if(g_player.def >= enemyAp)
//			{
//				if(this.hp + this.def <= g_player.ap) 
//					img = g_imgs['mon_onetunekill'];
//				else
//					img = g_imgs['mon_green'];
//			}
//			if(g_feverMode)
//				img = g_imgs['mon_onetunekill'];
//		}

		var scale = this.scale;
		if(this.IsMon())
			if((this.level % 5) == 0)
				scale += 1;
			else
				scale += ((this.level % 5) / 5) / 2;
		if(img)
			Renderer.ImgBlt(x - (this.imgWidth * scale - TILE_WIDTH ) / 2, 
						y + TILE_HEIGHT - this.imgHeight * scale, 
					img.img, 
					0, 0, img.img.width, img.img.height,	
					this.imgWidth * scale, this.imgHeight * scale);
		else
		{
			Renderer.SetColor('#000');
			Renderer.Rect(x, y, TILE_WIDTH, TILE_HEIGHT); 
		}

		if(this.turnLife == 0 && this.IsMon())
		{
			Renderer.SetFont('8pt Arial');
			var text = 'range attack!';
			var textWidth = Renderer.GetTextWidth(text); 
			Renderer.SetColor('#000');
			Renderer.Rect(x, y + Renderer.GetFontSize() , textWidth, Renderer.GetFontSize());
			Renderer.SetColor('#f00');
			Renderer.Text(x, y + Renderer.GetFontSize() , text);
		}

		Renderer.SetFont('8pt Arial');
		var text = '';
		
		if(this.type == 'npc' || this.type == 'merchant')
			text = 'hp : ' + this.hp;
		
		if(this.type == 'gold')
			text = (this.level * 4) + ' gold';

		if(text != '')
		{
//			var textWidth = Renderer.GetTextWidth(text); 
//			Renderer.SetColor('#000');
//			Renderer.Rect(x, y + TILE_HEIGHT - Renderer.GetFontSize() , textWidth, Renderer.GetFontSize());
//			Renderer.SetColor('#0f0');
//			Renderer.Text(x, y + TILE_HEIGHT - Renderer.GetFontSize() , text);
		}

		if(this.IsMon() || this.type == 'player')
		{
//			Renderer.SetColor('#000');
//			Renderer.Rect(x, y + TILE_HEIGHT - 10, TILE_WIDTH, 10);
//			Renderer.SetColor('#0f0');
//
//			var imgAttack = g_imgs['sword'];
//			var imgHeart = g_imgs['heart']; 
//			var iconSize = 10;
//			img = imgHeart;
//			Renderer.ImgBlt(x, y + TILE_HEIGHT - iconSize, img.img, 0, 0, img.width, img.height, iconSize,  iconSize);
//			Renderer.Text(x + 10, y + TILE_HEIGHT - Renderer.GetFontSize() , this.hp);
//
//			img = imgAttack;
//			Renderer.ImgBlt(x + 20, y + TILE_HEIGHT - iconSize, img.img, 0, 0, img.width, img.height, iconSize,  iconSize);
//			Renderer.Text(x + 30, y + TILE_HEIGHT - Renderer.GetFontSize() , this.ap);
		}

//		Renderer.Text(x + TILE_WIDTH / 2 - textWidth / 2, 
//						y + TILE_HEIGHT / 2 - Renderer.GetFontSize() / 2 , this.hp);

//		if(!this.Moveable() && this.type != 'dark' )
//		{
//			Renderer.SetColor("#0f0");
//			Renderer.RectStroke(this.renderX, this.renderY, TILE_WIDTH, TILE_HEIGHT); 
//		}

//		if(this.type =='mon' && this.hp > g_player.ap)
//		{
//			Renderer.SetColor("#f00");
//			Renderer.RectStroke(this.renderX + 1, this.renderY + 1, TILE_WIDTH - 2, TILE_HEIGHT - 2); 
//
//		}
	}

	this.DoTurn = function()
	{
		if(this.Dead())
			return;

		this.alredyFight = false;
//		if(this.type == 'player')
//		{
//			this.hp += this.hpRegen;
//			if(this.hp >= this.maxHP)
//				this.hp = this.maxHP; 
//		}
//
		var rangeAttack = false;
//		if(this.turnLife >= 0)
//		{
//			this.turnLife--;
//			if(this.turnLife < 0)
//				this.turnLife = 0;
//
//			if(this.turnLife == 0)
//			{ 
//				if(this.type == 'merchant')
//					this.isDead = true; 
//
//				if(this.type != 'mon')
//					this.isDead = true; 
//
//				if(this.type == 'mon' && !g_feverMode)
//					rangeAttack = true;
//
//			}
//		}
//
		if(this.IsMon() && this.level >= 5)
			rangeAttack = true;

		rangeAttack = false;

		if(rangeAttack)
		{ 
			var dmg =  - this.ap;
			if(dmg < 0) 
				AddHP(dmg);
//			else 
//				g_effectManager.Add(this.x, this.y, '#0f0', 'no damage!');
			this.scale = 2.0;
		}

		if(this.type == 'boss')
		{
			var x = this.x;
			var y = this.y;
			for(var i = 0; i < 10; ++i)
			{
				var rx = (randomRange(0, 2) - 1) * 2 * TILE_WIDTH + this.x;
				var ry = (randomRange(0, 2) - 1) * 2 * TILE_HEIGHT + this.y;
				var list = g_objList.GetObjByPos(rx, ry);
				if(list.length == 1 && list[0].type == 'dark')
				{ 
					x = rx;
					y = ry;
					break;
				}
			} 

			this.x = x;
			this.y = y;
		}
	}
};

