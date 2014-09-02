(function ( window, module ) {

	if ( window.define && window.define.amd ) {
		define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || "transit"
		window[module_name] = module
	}
})( 
	window,
	{
		define : {
			allow   : "*",
			require : [
				"morph"
			],
		},

		to : function ( define ) { 
			var request
			request   = new XMLHttpRequest()
			define.do = define.do || "get"
			request.onreadystatechange = function () { 
				// could eventualy pass an abstracted object of the this object 
				// so it can allow for more funkey behaviour
				if ( this.readyState === 1 ) {
					if ( define.when && define.when.opened ) {
						define.when.opened.call( {}, {
							event : this,
							with  : define.with
						})
					}
				}

				if ( this.readyState === 2 ) {
					if ( define.when && define.when.sent ) {
						define.when.sent.call( {}, {
							event : this,
							with  : define.with
						})
					}
				}

				if ( this.readyState === 3 ) {
					if ( define.when && define.when.loading ) {
						define.when.loading.call( {}, {
							event : this,
							with  : define.with
						})
					}
				}

				if ( this.readyState === 4 ) {
					if ( define.when && define.when.finished ) {
						define.when.finished.call( {}, {
							event  : this,
							with   : define.with,
							result : self.convert_response_text({
								to   : define.expect || "json",
								text : this.responseText
							})
						})
					}
				}
			}
			request.open( define.do, define.url )
			request.send()
		},

		convert_url_and_data_to_full_url : function ( from ) {

			if ( from.data.constructor === String ) {
				return from.url +"?data="+ window.encodeURIComponent( from.data )
			}

			if ( from.data.constructor === Array || from.data.constructor === Object ) {
				if ( from.flat ) { 

				}
			}
		},

		convert_array_or_object_to_flat_uri_paramaters : function ( data ) { 
			
			if ( data.constructor === Array ) {
				return this.library.morph.index_loop({
					subject : data,
					into    : "",
					else_do : function ( loop ) {
						var prefix = ( loop.index > 0 ? "&" : "" )
						return loop.into + prefix + loop.index +"="+ window.encodeURIComponent( loop.indexed )
					}
				})
			}

			if ( data.constructor === Object ) {
				return this.library.morph.object_loop({
					"subject" : data,
					"into?"   : "",
					"else_do" : function ( loop ) {
						return {
							into : ( loop.index > 0 ?
								loop.into +"&"+ loop.key +"="+ loop.value :
								loop.into + loop.key +"="+ loop.value 
							)
						}
					}
				})	
			}
		},

		convert_response_text : function ( convert ) { 

		},

		convert_object_to_uri_string : function () { 

		}
	}
)