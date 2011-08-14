(function($){
  
  $.fn.mustache_maker = function(options){
    
    var opts = $.extend({}, $.fn.mustache_maker.defaults, options);
    
    var attach_canvas = function($img){
      $img.load(function(){
        var clickX = new Array();
        var clickY = new Array();
        var clickDrag = new Array();
        var paint;
        var height = $img.height();
        var width = $img.width();
        var canvas = $("<canvas/>");
        canvas.attr("height", height);
        canvas.attr("width", width);
        var context = canvas[0].getContext("2d");
        function addClick(x, y, dragging)
        {
          clickX.push(x);
          clickY.push(y);
          clickDrag.push(dragging);
        }
        canvas.mousedown(function(e){
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            paint = true;
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
            $.fn.mustache_maker.draw({
							x : clickX,
							y : clickY,
							drag : clickDrag
						}, context, canvas);
        });
        canvas.mousemove(function(e){
          if(paint){
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            $.fn.mustache_maker.draw({
							x : clickX,
							y : clickY,
							drag : clickDrag
						}, context, canvas);
          }
        });
        canvas.mouseup(function(e){
          paint = false;
					opts.mustache_callback({
						x : clickX,
						y : clickY,
						drag : clickDrag
					});
        });
        canvas.mouseleave(function(e){
          paint = false;
					opts.mustache_callback({
						x : clickX,
						y : clickY,
						drag : clickDrag
					});
        });
        
        //Store the original image on the canvas and replace it with the canvas version.
        $img.parent().append(canvas);
        canvas.position($img.position());
        canvas.data('original', $img);
        $img.detach();
        context.drawImage($img[0],0, 0, width, height);
      });
    }
    
    return this.each(function(){
      var img = $('img', this);
      attach_canvas(img);
    });
  
  };
  
  $.fn.mustache_maker.draw = function(mustache, context, canvas){
    canvas.width = canvas.width; // Clears the canvas

    context.strokeStyle = "#000000";
    context.lineJoin = "round";
    context.lineWidth = 5;

		var clickX = mustache.x,
				clickY = mustache.y,
				clickDrag = mustache.drag;

    for(var i=0; i < clickX.length; i++)
    {   
      context.beginPath();
      if(clickDrag[i] && i){
        context.moveTo(clickX[i-1], clickY[i-1]);
       }else{
         context.moveTo(clickX[i]-1, clickY[i]);
       }
       context.lineTo(clickX[i], clickY[i]);
       context.closePath();
       context.stroke();
    }
  };
  
  $.fn.mustache_maker.defaults = {
    mustache_callback : function(mustache){}
  };
  
})( jQuery );