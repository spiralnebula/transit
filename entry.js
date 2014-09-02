(function ( window, module ) {

	var loaded_scripts, last_loaded_script, root_directory

	loaded_scripts     = document.getElementsByTagName("script")
	last_loaded_script = loaded_scripts[loaded_scripts.length-1]
	root_directory     = module.get_the_root_directory_based_on_last_loaded_script( last_loaded_script )

	if ( typeof window.define === 'function' && window.define.amd) {
		moudle.begin_loading({
			directory : root_directory
		})
	} else {


		if ( typeof window.jasmine === "object" ) {

			var module_name
			module_name         = this_script.getAttribute("data-module-name") || "entry"
			window[module_name] = module

		} else { 
			var require_js
			require_js         = document.createElement("script")
			require_js.src     = root_directory + "/require.js"
			require_js.onload  = function () {

				require.config({
					baseUrl : root_directory
				})

				requirejs([
					"nebula/configuration",
					"configuration"
				], function ( tool_configuration, module_configuration ) {

					var tool_module_paths
					tool_module_paths = module.prefix_every_string_in_array({
						string : "nebula/",
						array  : [].concat( tool_configuration.main, tool_configuration.module )
					})

					requirejs( tool_module_paths , function () {

						var tool_path_map, loaded_modules

						loaded_modules = Array.prototype.slice.call( arguments )
						tool_path_map  = module.sort_module_paths_and_objects_into_path_map({
							paths   : [].concat( tool_configuration.module, "entry" ),
							objects : loaded_modules.slice(1).concat( module )
						})

						arguments[0].make({
							nebula        : tool_path_map,
							configuration : module_configuration,
							root          : root_directory
						})
					})
				})
			}

			document.head.appendChild(require_js)
		}
	}

})( 
	window,
	{

		sort_module_paths_and_objects_into_path_map : function ( map ) {
			map.index = map.index || 0
			map.into  = map.into  || {}
			if ( map.index >= map.paths.length ) { 
				return map.into
			} else {
				map.into[map.paths[map.index]] = map.objects[map.index]
				return this.sort_module_paths_and_objects_into_path_map({
					index   : map.index + 1,
					into    : map.into,
					paths   : map.paths.slice(0),
					objects : map.objects
				})
			}
		},

		prefix_every_string_in_array : function ( prefix ) { 
			prefix.at   = prefix.at   || 0
			prefix.into = prefix.into || []
			if ( prefix.at >= prefix.array.length ) { 
				return prefix.into
			} else { 
				return this.prefix_every_string_in_array({
					array  : prefix.array.slice(0),
					at     : prefix.at + 1,
					into   : prefix.into.concat( prefix.string + prefix.array[prefix.at] ),
					string : prefix.string
				})
			}
		},

		get_the_root_directory_based_on_last_loaded_script : function ( last_loaded_script ) { 

			var directory_from_attribute

			directory_from_attribute = last_loaded_script.getAttribute("data-directory")
			if (  directory_from_attribute )  { 
				return directory_from_attribute
			} else {
				
				var root_path, script_source_from_attribute

				script_source_from_attribute = last_loaded_script.getAttribute("src")

				if ( last_loaded_script.src === script_source_from_attribute ) {
					return this.get_path_directory( script_source_from_attribute )
				}
				
				root_path = last_loaded_script.src.replace( script_source_from_attribute, "" )

				if ( root_path[root_path.length-1] === "/" ) {
					return root_path.slice( 0, root_path.length-1 )
				} else { 
					return root_path
				}
			}
		},

		get_path_directory : function ( path ) {
			var split_path, split_directory_path
			split_path           = path.split("/")
			split_directory_path = split_path.slice( 0, split_path.length-1 )
			if ( split_directory_path.length > 0 ) {
				return split_directory_path.join("/")
			} else { 
				return null
			}
		},
	}
)