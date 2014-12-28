var ObjManager = function()
{ 
	this.m_darkList = [];
	this.ax = 0;
	this.ay = 0;
	this.prevAXTile = 0;
	this.prevay = 0;
	this.movingDelayTimer = 0;
	this.Clear = function()
	{
		this.m_list = [];
		this.m_darkList = [];
		this.ax = 0;
		this.ay = 0;
		this.prevAXTile = 0;
		this.prevay = 0;
		this.movingDelayTimer = 0;
	}

	this.tryRandomGen = function(type)
	{
		var genList = ['gold'];
		var rand = randomRange(0, genList.length - 1);	
		var rand2 = randomRange(0, this.m_darkList.length - 1);	
		if(!type)
			type = genList[rand]; 

		var ret = false;
		var max = 1;

		if(type == 'box')
			max = 2;

		for(var i = 0; i < max; ++i)
		{
			var x = this.m_darkList[rand2].x + (randomRange(0, 2) - 1) * TILE_WIDTH;
			var y = this.m_darkList[rand2].y + (randomRange(0, 2) - 1) * TILE_HEIGHT;
			if((x == g_player.x + this.prevAXTile &&
			   y == g_player.y + this.prevAYTile) ||
			  (x == g_player.x - this.prevAXTile &&
			   y == g_player.y - this.prevAYTile))
			{
				console.log('skip gen');
				continue;
			}
			var list = this.GetObjByPos(x, y);
			if(list.length == 1 && list[0].type == 'dark')
			{ 
				var obj = this.Add(x, y, type); 
				return obj;
			}
		}

		return false;
	}

	this.RandomGen = function(type)
	{
		for(var i = 0; i < 10; ++i)
		{
			var ret = this.tryRandomGen(type);
			if(ret)
				return ret;
		}
		return false;
	}

	this.Generate = function(x, y, type)
	{
		var obj = new Obj();
		
		obj.x = x;
		obj.y = y;
		obj.type = type; 

		if(type == 'player' || type =='gold' || type=='box')
			obj.level = 1; 

		if(obj.IsMon())
		{
			obj.turnLife = 8;
//				obj.level = Math.min(Math.round(g_turn / 20), 5) + 1;
			obj.level = Math.min(g_floor, MON_LEVEL_MAX);
		}

		switch(type)
		{
			case 'boss':
				break;
				obj.level = 0;

			case 'merchant':
				obj.hp = 4;
				break;

			case 'npc':
				obj.hp = 2;
				break;

			default:
				obj.turnLife = -1; 
				break; 
		}

		return obj;
	}

	this.Add = function(x, y, type)
	{
		var obj = this.Generate(x, y, type);
		this.m_list.push(obj); 

		if(type == 'dark')
		{
			this.m_darkList.push(obj);
			obj.level = randomRange(0, 3);
		}

		obj.renderX = obj.x - g_cameraX;
		obj.renderY = obj.y - g_cameraY;
		obj.RefreshStat();

		return obj;
	}

	this.MoveDelay = function(msec)
	{
		console.log('move delay');
		this.movingDelayTimer = g_now.getTime() + msec;
	} 

	this.Update = function()
	{
		var prevCnt = this.moveCnt;
		moveCnt = 0;

		var deadList = [];
		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			var preX = item.x;
			var preY = item.y;
			item.Update();

			if(g_now.getTime() > this.movingDelayTimer)
				item.Move();

			if(preX != item.x || preY != item.y)
				moveCnt++;

			if(item.Removed())
				deadList.push(item);
		}

		for(var i in deadList)
			removeFromList(this.m_list, deadList[i]);

		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			if(item.Removed())
				console.log('dead alive');
		} 

//		console.log(['prevCnt', 'moveCnt'], [prevCnt, this.moveCnt]);
		if((this.ax != 0 || this.ay != 0) && moveCnt == 0 && g_now.getTime() > this.movingDelayTimer)
		{ 
			this.prevAXTile = this.ax / MOVE_STEP * TILE_WIDTH;
			this.prevAYTile = this.ay / MOVE_STEP * TILE_WIDTH;
//			console.log(['prevAXTile', 'prevAYTile'], [this.prevAXTile, this.prevAYTile]);

			this.ax = 0;
			this.ay = 0;

			for(var i in this.m_list)
			{
				var item = this.m_list[i];
				item.forceStop = false;
			} 

			console.log('move end');
		} 

		this.moveCnt = moveCnt;
	}

	this.Render = function()
	{
		var objList = []
		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			if(item.type !='dark')
			{
				objList.push(item);
				continue;
			}
			item.Render();
//			Renderer.Text(item.renderX, item.renderY, i);
		} 

		objList.sort(function(a, b)
		{
			return a.y - b.y;
		}); 

		for(var i in objList)
		{
			var item = objList[i];
//			if(item.type =='dark')
//				continue;
//
			item.Render();
//			Renderer.Text(item.renderX, item.renderY, i);
		} 
	}

	this.CheckCollision = function(x, y, obj)
	{ 
		var list = [];

		if(obj && obj.Dead())
			return list;

		if(obj && obj.type =='dark')
			return list;

		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			if(item == obj)
				continue; 

			if(item.Dead())
				continue;
			
			if(item.type=='dark')
				continue;

			if(!(x >= item.x + TILE_WIDTH || 
				x + TILE_WIDTH <= item.x || 
				y >= item.y + TILE_HEIGHT ||
				y + TILE_HEIGHT <= item.y))
				list.push(item); 
		}
		return list; 
	}

	this.GetChrByPos = function(x,y)
	{ 
		var list = [];
		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			if((item.x == x) && (item.y == y))
				list.push(item);
		}

		return list;
	}

	this.Move = function(ax, ay)
	{
		this.ax = ax * MOVE_STEP;
		this.ay = ay * MOVE_STEP; 
		console.log('move start');
		this.m_list.sort(function(a, b)
		{
			if(ax < 0)
				return a.x - b.x;

			if(ax > 0)
				return b.x - a.x;

			if(ay < 0)
				return a.y - b.y;

			if(ay > 0)
				return b.y - a.y;

		}); 
	}

	this.CheckMoving = function()
	{
		if(g_now.getTime() <= this.movingDelayTimer)
			return true;

		if(this.moveCnt > 0)
			return true; 

		return false;
	}

	this.GetObjByType = function(type)
	{
		var list = []
		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			if(item.type == type || (type == 'mon' && item.IsMon()))
				list.push(item);
		} 
		return list;
	}

	this.GetObjByPos = function(x, y)
	{
		var list = [];
		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			if(item.x == x && item.y == y)
				list.push(item);
		} 
		return list;
	}

	this.GetEnemyCnt = function()
	{
		var cnt = 0;
		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			if(item.type.indexOf('lv') == 0)
				cnt++;
		} 
		return cnt;
	}

	this.DoTurn = function()
	{
		var cnt = 0;
		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			item.DoTurn();
		} 
	}

	this.GetMerchantCnt = function()
	{ 
		var list = g_objList.GetObjByType('merchant');
		return list.length;
	}

	this.GetNPCCnt = function()
	{ 
		var list = g_objList.GetObjByType('npc');
		return list.length;
	}

	this.GetAllGold = function()
	{ 
		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			if(item.type != 'gold')
				continue;
				
			AddGold(item.level);
			g_effectManager.Add(item.x - g_cameraX, item.y - g_cameraY, '#ffffff', 'gold + ' + item.level);
		} 

		this.ClearObjectType('gold'); 
	} 

	this.ClearObjectType = function(type)
	{
		var deadList = [];
		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			if(item.type != type)
				continue;
				
			item.SetDead();
			deadList.push(item);
		} 

		for(var i in deadList)
			removeFromList(this.m_list, deadList[i]);

		for(var i in this.m_list)
		{
			var item = this.m_list[i];
			if(item.Dead())
				console.log('dead alive');
		} 
	}
}; 
