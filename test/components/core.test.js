/* global QUnit, module, test, asyncTest, expect, start, stop, ok, equal, notEqual, deepEqual,
 * notDeepEqual, strictEqual, notStrictEqual, raises, sinon, console */
(function( $ ) {

	"use strict";

	QUnit.testStart(function() {
		window.location.hash = "#";
	});

	QUnit.done(function() {
		$( "body" ).css( "overflow", "auto" );
	});

	module( "core#init", {
		setup: function() {
			this.fixture = "#qunit-fixture #jmpress";
		}
	});

	test( "init", 2, function() {
		$( this.fixture ).jmpress();
		ok( $( this.fixture ).hasClass( "step-about" ), "first step class is set" );
		ok( $( this.fixture ).jmpress( "initialized" ) );
	});

	test( "init with settings", 2, function() {
		$( this.fixture ).jmpress({
			canvasClass: "testcanvas",
			stepSelector: "li"
		});
		var result = $( this.fixture ).jmpress( "settings" );
		equal( result.canvasClass, "testcanvas", "canvasClass has been set" );
		equal( result.stepSelector, "li", "stepSelector has been set" );
	});

	test( "settings on first step", 5, function() {
		$( this.fixture ).jmpress();
		var step = $( this.fixture ).find( ".step:first" );
		ok( step.hasClass( "active" ), "first step has active class" );
		equal( step.css( "position" ), "absolute", "position is absolute" );
		ok( step.attr( "style" )
			.indexOf( "translate(-50%, -50%)" ), "css translate should be set" );
		ok( step.attr( "style" )
			.indexOf( "translate3d(-900px, -1500px, 0px)"), "css translate3d should be set" );
		ok( step.attr( "style" )
			.indexOf( "preserve-3d" ), "css preserve-3d should be set" );
	});

	test( "deinit", 1, function() {
		$( this.fixture ).jmpress();
		$( this.fixture ).jmpress( "deinit" );
		ok( !$( this.fixture ).jmpress( "initialized" ) );
	});

	module( "core#select", {
		setup: function() {
			this.fixture = "#qunit-fixture #jmpress";
			$( this.fixture ).jmpress();
		}
	});

	test( "should select a step", 4, function() {
		var step;

		step = $( this.fixture ).jmpress( "select", $( this.fixture ).find( "#docs" ) );
		ok( step.hasClass( "active" ) );
		step = null;

		step = $( this.fixture ).jmpress( "select", "#download" );
		ok( step.hasClass( "active" ) );
		step = null;

		step = $( this.fixture ).jmpress( "reselect", "#download" );
		ok( step.hasClass( "active" ) );
		step = null;

		step = $( this.fixture ).jmpress( "goTo", "#docs" );
		ok( step.hasClass( "active" ) );
		step = null;
	});

	// TODO: scrollFix method

	test( "should select the next step", 1, function() {
		var step = $( this.fixture ).jmpress( "next" );
		equal( step.attr( "id" ), "download" );
	});

	test( "should select the prev step", 1, function() {
		var step = $( this.fixture ).jmpress( "prev" );
		equal( step.attr( "id" ), "docs" );
	});

	test( "should select the home step", 1, function() {
		$( this.fixture ).jmpress( "next" );
		var step = $( this.fixture ).jmpress( "home" );
		equal( step.attr( "id" ), "about" );
	});

	test( "should select the end step", 1, function() {
		var step = $( this.fixture ).jmpress( "end" );
		equal( step.attr( "id" ), "docs" );
	});

	// TODO: current method

	module( "core#data", {
		setup: function() {
			this.fixture = "#qunit-fixture #jmpress";
			$( this.fixture ).jmpress();
		}
	});

	test( "should return settings", 1, function() {
		var settings = $( this.fixture ).jmpress( "settings" );
		ok( $.isPlainObject( settings ) );
	});

	test( "should return defaults", 3, function() {
		var defaults = $( this.fixture ).jmpress( "defaults" );
		ok( $.isPlainObject( defaults ) );
		equal( defaults.activeClass, "active" );
		equal( defaults.stepSelector, ".step" );
	});

	test( "should return active step", 1, function() {
		var active = $( this.fixture ).jmpress( "active" );
		equal( active.attr( "id" ), "about" );
	});

	test( "should set style on canvas", function() {
		expect( 1 );
		var canvas;
		$( this.fixture ).jmpress( "canvas", {
			"transitionDuration": "5s"
		});
		canvas = $( this.fixture ).find( ".step" ).parent();
		ok( canvas.css( "transition-duration" ), "5s" );
	});

	// TODO: fire method
	// TODO: container method
	// TODO: reapply method

	module( "core#callbacks", {
		setup: function() {
			this.fixture = "#qunit-fixture #jmpress";
		}
	});

	test( "should fire beforeChange event", function() {
		expect( 3 );
		var elementId, eventDataReason,
			count = 0;

		$( this.fixture ).jmpress();
		$( this.fixture ).jmpress( "beforeChange", function( element, eventData ) {
			count += 1;
			elementId = $( element ).attr( "id" );
			eventDataReason = eventData.reason;
		});
		$( this.fixture ).jmpress( "next" );

		strictEqual( count, 1, "event fired" );
		strictEqual( elementId, "download", "got the correct element id" );
		strictEqual( eventDataReason, "next", "got the correct event reason" );
	});

	test( "should fire beforeInit event", function() {
		expect( 1 );
		var count = 0;
		$( this.fixture ).jmpress({
			"beforeInit": function( element, eventData ) {
				count += 1;
			}
		});
		strictEqual( count, 1, "event fired" );
	});

	test( "should fire afterInit event", function() {
		expect( 1 );
		var count = 0;
		$( this.fixture ).jmpress({
			"afterInit": function( element, eventData ) {
				count += 1;
			}
		});
		strictEqual( count, 1, "event fired" );
	});

	test( "should fire selectNext event", function() {
		expect( 1 );
		var count = 0;
		$( this.fixture ).jmpress();
		$( this.fixture ).jmpress( "selectNext", function( element, eventData ) {
			count += 1;
		});
		$( this.fixture ).jmpress( "next" );
		strictEqual( count, 1, "event fired" );
	});

	test( "should fire selectPrev event", function() {
		expect( 1 );
		var count = 0;
		$( this.fixture ).jmpress();
		$( this.fixture ).jmpress( "selectPrev", function( element, eventData ) {
			count += 1;
		});
		$( this.fixture ).jmpress( "prev" );
		strictEqual( count, 1, "event fired" );
	});

	module( "core#async callbacks", {
		setup: function() {
			this.fixture = "#qunit-fixture #jmpress";
			this.clock = sinon.useFakeTimers();
		},
		teardown: function() {
			this.clock.restore();
		}
	});

	test( "should fire idle event", function() {
		expect( 2 );
		var jmpress,
			count = 0;

		$( this.fixture ).jmpress();
		$( this.fixture ).jmpress( "idle", function( element, eventData ) {
			jmpress = eventData.jmpress;
			count += 1;
		});

		// settings.transitionDuration - 100
		// 1500 - 100
		this.clock.tick( 1400 );

		strictEqual( count, 1, "event fired" );
		ok( !!jmpress, "should have a valid value on eventData.jmpress" );
	});

	module( "core#duration", {
		setup: function() {
			this.fixture = "#qunit-fixture #jmpress";
		}
	});

	test( "Transition duration for all steps via data attributes", function() {
		var transitionDuration;
		expect( 1 );
		$( this.fixture ).attr( "data-transition-duration", "100" );
		$( this.fixture ).jmpress();
		transitionDuration = $( this.fixture )
			.find( ".step" )
			.parent()
			.css( "transition-duration" );
		// The whole value of "transition-duration" is inconsistent between Unix and Windows
		ok(
			transitionDuration.indexOf( "0.1" ) !== -1,
			"should set correct transition for the first step"
		);
	});

	test( "Transition duration for an individual step", function() {
		var transitionDuration;
		expect( 1 );
		$( this.fixture ).find( ".step:eq(1)" ).attr( "data-transition-duration", "100" );
		$( this.fixture ).jmpress();
		$( this.fixture ).jmpress( "next" );
		transitionDuration = $( this.fixture )
			.find( ".step" )
				.parent()
				.css( "transition-duration" );
		// The whole value of "transition-duration" is inconsistent between Unix and Windows
		ok(
			transitionDuration.indexOf( "0.1" ) !== -1,
			"should set transition for the second step"
		);
	});

}( jQuery ));
