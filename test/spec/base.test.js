
describe("request", function() {
	
	var module = window.transit
	module.library = {
		morph : window.morph
	}

	describe("to", function() {

		beforeEach(function () { 
			jasmine.Ajax.install()
		})

		afterEach(function () { 
			jasmine.Ajax.uninstall()
		})

		var definition, spy
		spy        = {
			opened    : function () {

			},
			sent      : function () {

			},
			loading   : function () {

			},
			finished  : function () {

			},
			sucessful : function () {

			},
			aborted   : function () {

			},
		}
		definition = {
			url   : "some/basic",
			do    : "post",
			with  : {
				d : "some",
				s : "ss"
			},
			when  : {
				opened    : function () {
					spy.opened()
				},
				sent      : function () {
					spy.sent()
				},
				loading   : function () {},
				finished  : function ( state ) {
					spy.finished( state.result )
				},
				sucessful : function () {

				},
				aborted   : function () {},
			},
			expect : "json"
		}

		spyOn( spy, "opened" )
		spyOn( spy, "sent" )
		spyOn( spy, "finished" )

		it("calls finished with the correct paramaters", function() {

			jasmine.Ajax.stubRequest("some/basic").andReturn({
				"responseText" : JSON.stringify({
					s : "some"
				})
			})

			module.to(definition)

			expect(spy.finished).toHaveBeenCalledWith({ s : "some" })
		})
	})

	describe("convert url and data to full url", function() {
		
		it("converts a plain url", function() {
			expect(module.convert_url_and_data_to_full_url({
				url  : "some/some",// data : {}
			})).toEqual("some/some")
		})

		it("converts a url with object data", function() {
			var result
			result = module.convert_url_and_data_to_full_url({
				url  : "some/some",
				data : {
					"s" : "some"	
				}
			})
			expect( JSON.parse( window.decodeURIComponent( result.split("data=")[1] ) ) ).toEqual({
				"s" : "some"
			})
		})

		it("converts a url with array data", function() {
			var result
			result = module.convert_url_and_data_to_full_url({
				url  : "some/some",
				data : ["some", "some"]
			})
			expect( JSON.parse( window.decodeURIComponent( result.split("data=")[1] ) ) ).toEqual(["some", "some"])
		})

		it("converts a url with flat array data", function() {
			var result
			result = module.convert_url_and_data_to_full_url({
				url  : "some/some",
				data : ["some", "some"],
				flat : true
			})
			expect(result).toEqual("some/some?0=some&1=some")
		})

		it("converts a url with flat object data", function() {
			var result
			result = module.convert_url_and_data_to_full_url({
				url  : "some/some",
				data : {
					s : "some",
					d : "some",
					b : ["some", "some"],
					c : { b : "s" }
				},
				flat : true
			})
			// expect(result).toEqual("some/some?0=some&1=some")
		})
	})

	describe("convert array or object to flat uri paramaters", function() {
		it("converts array ", function() {
			expect(
				module.convert_array_or_object_to_flat_uri_paramaters([
					"some",
					"value",
					"there"
				])
			).toEqual("0=some&1=value&2=there")

			expect(
				decodeURI( module.convert_array_or_object_to_flat_uri_paramaters([
					"some some",
					"value value",
					"there there"
				]) )
			).toEqual("0=some some&1=value value&2=there there")
		})

		it("convets arrays with multuple value types", function() {
			var split_result, result
			result = module.convert_array_or_object_to_flat_uri_paramaters([
				"some",
				"some",
				["some", "some"],
				{ b : "s" }
			])
			split_result = result.split("&")
			expect(window.decodeURIComponent( split_result[0] )).toEqual("0=some")
			expect(window.decodeURIComponent( split_result[1] )).toEqual("1=some")
			expect(window.decodeURIComponent( split_result[2] )).toEqual('2=["some","some"]')
			expect(window.decodeURIComponent( split_result[3] )).toEqual('3={"b":"s"}')
		})

		it("converts object", function() {
			expect(
				module.convert_array_or_object_to_flat_uri_paramaters({
					some    : "value",
					another : "value"
				})
			).toEqual("some=value&another=value")

			expect(
				decodeURI( module.convert_array_or_object_to_flat_uri_paramaters({
					some    : "value v",
					another : "value b"
				}))
			).toEqual("some=value v&another=value b")
		})

		it("convets objects with multuple value types", function() {
			var split_result, result
			result = module.convert_array_or_object_to_flat_uri_paramaters({
				s : "some",
				d : "some",
				b : ["some", "some"],
				c : { b : "s" }
			})
			split_result = result.split("&")
			expect(window.decodeURIComponent( split_result[0] )).toEqual("s=some")
			expect(window.decodeURIComponent( split_result[1] )).toEqual("d=some")
			expect(window.decodeURIComponent( split_result[2] )).toEqual('b=["some","some"]')
			expect(window.decodeURIComponent( split_result[3] )).toEqual('c={"b":"s"}')
		})
	})

	describe("convert url and data to full url", function() {
		it("converts string", function() {
			expect(module.convert_url_and_data_to_full_url({
				url  : "http://somesome/some",
				data : "some value"
			})).toEqual("http://somesome/some?data=some%20value")
		})
	})
})