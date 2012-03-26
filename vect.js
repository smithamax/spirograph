function Vect(x,y){
  this.x = x || 0.0;
  this.y = y || 0.0;
}

Vect.prototype.distTo = function(v){
  var dx = Math.abs(v.x - this.x);
  var dy = Math.abs(v.y - this.y);
  return Math.sqrt((dx*dx)+(dy*dy));
};
Vect.prototype.length = function(){
  return Math.sqrt((this.x*this.x)+(this.y*this.y));
};
Vect.prototype.lengthSq = function(){
  return (this.x*this.x)+(this.y*this.y);
};
Vect.prototype.normalise = function() {
  var l = this.length();
  if (l === 0){
    this.x = 0;
    this.y = 0;
  }else{
    this.x = this.x/l;
    this.y = this.y/l;
  }
  return this;
};
Vect.prototype.getNormalised = function() {
  var c = this.copy();
  return c.normalise();
};
Vect.prototype.sub = function(v){
  this.x -= v.x;
  this.y -= v.y;
  return this;
};
Vect.prototype.add = function(v){
  this.x += v.x;
  this.y += v.y;
  return this;
};

Vect.prototype.copy = function() {
  return new Vect(this.x, this.y);
};
Vect.prototype.angle = function() {
  return Math.atan2(this.x,this.y);
};
Vect.prototype.angleTo = function(v) {
  return Math.atan2(v.x-this.x,v.y-this.y);
};
Vect.prototype.rot = function (ang) {
  var x = this.x;
  var y = this.y;
  this.x = x*Math.cos(ang) - y*Math.sin(ang);
  this.y = x*Math.sin(ang) + y*Math.cos(ang);
  return this;
};

Vect.sub = function(v1,v2){
  return new Vect(v1.x-v2.x,v1.y-v2.y);
};
Vect.add = function(v1,v2){
  return new Vect(v1.x+v2.x,v1.y+v2.y);
};
Vect.mid = function(v1,v2){
  return new Vect((v1.x+v2.x)/2,(v1.y+v2.y)/2);
};
