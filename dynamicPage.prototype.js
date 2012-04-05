dynamicPage = {
	
	linkSelector: 'a.rewrite',
	
	selection: 'article',
	
	target: null,
	
	hideEffect: 'hide',
	
	showEffect: 'show',
	
	callback: Prototype.emptyFunction,
	
	initialize: function(options) {
		if(typeof options.linkSelector == 'string') this.linkSelector = options.linkSelector;
		if($(options.target)) this.target = $(options.target);
		if(options.hideEffect) this.hideEffect = options.hideEffect;
		if(options.showEffect) this.showEffect = options.showEffect;
		if(options.selection) this.selection = options.selection;
		if(options.callback) this.callback = options.callback;
		
		if(window.history && history.pushState) {
			//observe links with class "rewrite"
			$$(this.linkSelector).invoke('observe','click', function(event){
				event.stop();
				var elem = event.element();
				var url = elem.href || elem.url;
				this.loadPage(url);
				history.pushState({'url':url},'',url);
				return false;
			}.bind(this));
			
			window.onpopstate = function(stack){
				var state = stack.state;
				if(state && state.url){
					this.loadPage(state.url);
				}
			}.bind(this);
		} else{
			//add code to use hash hack
			return false;
		}
	},
	
	loadPage: function(url) {
		
		new Ajax.Request(url, {
			onSuccess: function(response){
				//var article = new Element("article", {
				//	'class':"current",
				//	'style':'display:none;'
				//});
				
				var div = new Element('div',{style:'display:none;'});
				
				var page = response.responseText.stripScripts();
				var content = page.match(/<body[^>]*>([\s\S]*?)<\/body>/);
				div.update(content[1]);
				
				//article.update(div.select(this.selection)[0].innerHTML);
				
				if(this.target.down()) {
					$A([this.target.down()]).invoke(this.hideEffect,{
						after: afterHide.bind(this)
					});
				} else {
					afterHide()
				}
				
				function afterHide(){
					this.target.update(div.select(this.selection)[0]);
					$A([this.target.down()]).invoke(this.showEffect);
				}
			}.bind(this)
		});
	}
}
