(function($){
$.fn.jsRapKnob = function(options){
	
return this.each(function(){
	this.opt = $.extend({
		enabled:true,
		position:0,
		steps:0,
		caption:'',
		onMouseUp:null,
		onChange:null
	},options);
	$(this).addClass('rapKnob');
	let base = this;
	let button = 0;
	let inBar = $('<div>').addClass('rapKnobIn').appendTo($(this));
	let caption = $('<div>').addClass('rapKnobCaption').text(this.opt.caption).appendTo($(this));
	let w = $(this).width();
	$(this).css({height:w});
	
	if(this.opt.enabled)
		$(this).bind({
			click : function(e){
				Update(e);
			},
			mousemove:function(e){
				if(button)
					Update(e)
			},
			mousedown:function(e){
				button = 1;
				e = e || window.event;
				e.stopPropagation();
				e.preventDefault();
				if(this.setCapture)
					this.setCapture();
				Update(e);
			},
			mouseup:function(e){
				button = 0;
				if(this.opt.onMouseUp)
					this.opt.onMouseUp.call(this,this.opt.position,this.opt.step);
			}
		});	
	
	function Update(e){
		let cx = e.clientX - $(base)[0].getBoundingClientRect().left;
		let cy = e.clientY - $(base)[0].getBoundingClientRect().top;
		let p = -Math.atan2(cx - w / 2,cy - w / 2) / (2 * Math.PI);
		if(p < 0)
			p = p > -0.125 ? 1 : 1 + (p + 0.125) * 0.5 / 0.375;
		else
			p = p < 0.125 ? 0 : (p - 0.125) * 0.5 / 0.375;
		base.SetPosition(p);
	}
			
	this.SetPosition = function(p){
		let s = 0;
		if(this.opt.steps > 1){
			let fs = 1 / (this.opt.steps - 1);
			s = Math.floor(p / fs + .5);
			p = s * fs;
		}
		this.opt.position = p;
		this.opt.step = s;
		let d = p * 270 - 135;
		inBar.css('transform','translate(-50%,-50%) rotate(' + d + 'deg) translate(0,-200%)');
		if(this.opt.onChange)
			this.opt.onChange.call(this,p,s);
	}
	
	this.SetPosition(this.opt.position);
})

}})(jQuery);