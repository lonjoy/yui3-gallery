"use strict";

/**
 * @module gallery-layout-datatable
 */

/**********************************************************************
 * <p>Plugin for scrolling DataTable to make it fit inside a PageLayout
 * module.  After you plug it in, it automatically detects the PageLayout
 * module, so you don't have to do anything.</p>
 * 
 * @main gallery-layout-datatable
 * @class PageLayoutDataTableModule
 * @namespace Plugin
 * @extends Plugin.Base
 * @constructor
 * @param config {Object} configuration
 */

function PLDTModule(
	/* object */ config)
{
	PLDTModule.superclass.constructor.call(this, config);
}

PLDTModule.NAME = "PageLayoutDataTableModulePlugin";
PLDTModule.NS   = "layout";

PLDTModule.ATTRS =
{
	/**
	 * Instance of Y.PageLayout
	 * 
	 * @attribute layout
	 * @type {PageLayout}
	 * @required
	 * @writeonce
	 */
	layout:
	{
		value:     null,
		writeonce: true
	}
};

Y.extend(PLDTModule, Y.Plugin.Base,
{
	initializer: function(config)
	{
		this.afterHostMethod('render', function()
		{
			var table  = this.get('host'),
				layout = this.get('layout'),

				module_bd =
					table.get('boundingBox')
						 .ancestor('.' + Y.PageLayout.module_body_class),

				scroll_top = 0;

			module_bd.generateID();

			layout.on('beforeResizeModule', function(e)
			{
				if (e.bd.get('id') == module_bd.get('id') && e.height == 'auto')
				{
					if (table._yScrollNode)
					{
						scroll_top = table._yScrollNode.get('scrollTop');
					}

					table.set('height', 'auto');
					table.set('scrollable', 'x');
				}
			});

			layout.on('afterResizeModule', function(e)
			{
				if (e.bd.get('id') == module_bd.get('id'))
				{
					table.set('width', (e.width - Y.DOM.getScrollbarWidth())+'px');
					table.set('height', e.height+'px');
					table.set('scrollable', true);

					if (table._yScrollNode)
					{
						table._yScrollNode.set('scrollTop', scroll_top);
					}
				}
			});
		});
	}
});

Y.namespace("Plugin");
Y.Plugin.PageLayoutDataTableModule = PLDTModule;
