(function() {

	/**
	 * Tabs Class
	 */
	function CETabs() {
		CEWidget.apply(this, []);

		this.tabs = [];
		this.panes = [];
	}

	//Inherit from Widget
	util.inherits(CETabs, CEWidget);

	CETabs.prototype.init = function() {
		
		this.element = $('<div />').addClass('ce-tabs');

		this.tabWrapper = $('<div />').addClass('ce-tabs-tabs');
		this.element.append(this.tabWrapper);

		this.paneWrapper = $('<div />').addClass('ce-tabs-panes');
	    this.element.append(this.paneWrapper);
	};

    CETabs.prototype.addTab = function(name, content) {

        var tab = $('<div />').addClass('ce-tabs-tab').text(name);
        var pane = $('<div />').addClass('ce-tabs-pane').append(content);
        tab.data('pane', pane);

        this.tabWrapper.append(tab);
        this.tabs.push(tab);

        this.paneWrapper.append(pane);
        this.panes.push(pane);
        
        tab.on('click', function() {
            this.selectTab(tab);
        }.bind(this));
        
        if (this.tabs.length == 1) {
            this.selectTab(tab);
        }
        
    };

    CETabs.prototype.selectTab = function(tab) {

        tab = $(tab);
        var pane = tab.data('pane');
        this.tabWrapper.children('.ce-tabs-tab').removeClass('active');
        tab.addClass('active');

        this.paneWrapper.children('.ce-tabs-pane').removeClass('active');
        pane.addClass('active');
    };

	window.CETabs = CETabs;

}());

