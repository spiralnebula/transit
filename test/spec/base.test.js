
describe("request", function() {
	
	var module = window.transit
	module.library = {
		morph : window.morph
	}
	beforeEach(function () { 
		jasmine.Ajax.install()
	})

	afterEach(function () { 
		jasmine.Ajax.uninstall()
	})

	describe("to", function() {
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
					spy.finished({

					})
				},
				sucessful : function () {},
				aborted   : function () {},
			},
			expect : "json"
		}

		spyOn( definition.when, "opened" )
		spyOn( definition.when, "sent" )
		spyOn( definition.when, "finished" )

		jasmine.Ajax.stubRequest("some/basic").andReturn({
			"responseText" : "string string"
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

		it("converts object", function() {
			expect(
				module.convert_array_or_object_to_flat_uri_paramaters({
					some    : "value",
					another : "value"
				})
			).toEqual("some=value&another=value")
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