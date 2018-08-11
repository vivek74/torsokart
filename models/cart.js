module.exports=function Cart(oldCart, size) {
	this.items = oldCart.items || {};
	this.totalQty= oldCart.totalQty || 0;
	this.totalCost= oldCart.totalCost || 0;
	this.totalOrgCost= oldCart.totalOrgCost || 0;

	this.add= function(item, id) {
		var storedItem = this.items[id];
		if(!storedItem){
			storedItem= this.items[id] = {item: item, qty:0, orgcost:0, cost: 0, size: ''};
		}		
		storedItem.qty++;
		storedItem.size = storedItem.size + " " + size;
		storedItem.cost = storedItem.item.cost * storedItem.qty;
		storedItem.orgcost = storedItem.item.orignal_price * storedItem.qty;
		this.totalQty++;
		this.totalCost += storedItem.item.cost;
		this.totalOrgCost += storedItem.item.orignal_price;
	};
	
	this.reduceByOne = function(id){
		this.items[id].qty--;
		this.items[id].cost -= this.items[id].item.cost;
		this.items[id].orgcost -= this.items[id].item.orignal_price;
		this.totalQty--;
		this.totalCost -= this.items[id].item.cost;
		this.totalOrgCost -= this.items[id].item.orignal_price;

		if(this.items[id].qty <= 0) {
			delete this.items[id];
		}
	};
		this.increaseByOne = function(id){
		this.items[id].qty++;
		this.items[id].cost += this.items[id].item.cost;
		this.items[id].orgcost += this.items[id].item.orignal_price;
		this.totalQty++;
		this.totalCost += this.items[id].item.cost;
		this.totalOrgCost += this.items[id].item.orignal_price;
	};

	this.removeItem = function(id){
		this.totalQty -= this.items[id].qty;
		this.totalCost -= this.items[id].cost;
		this.totalOrgCost -= this.items[id].orignal_price;
		delete this.items[id];
	};

	this.generateArray = function(){
		var arr = [];
		for (var id in this.items){
			arr.push(this.items[id]);
		}
		return arr;
	};
};