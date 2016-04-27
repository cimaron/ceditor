(function() {

	/**
	 * Log Window Class
	 */
	function CEWindowSites() {
		this.sites = [];
		this.currentSite = null;
		CEWindow.apply(this, ["Sites"]);
	}

	//Inherit from Widget
	util.inherits(CEWindowSites, CEWindow);

	CEWindowSites.prototype.init = function() {
		CEWindow.prototype.init.apply(this, []);
		this.element.addClass('ce-window-sites');
		
		this.select = $('<select />');
		
		this.body.append(this.select);

		var site, option;
		for (var i = 1; i < 100; i++) {
            site = CEApp.config.get('sites.' + i);
            if (!site) {
                break;
            }
            this.sites.push(site);
            
            if (i == 1) {
                this.currentSite = site;
            }

            //Fix some values
            if (!site.cwd) {
                site.cwd = site.path;
            }
            site.n = i;
            
		    option = $('<option />').attr('value', this.sites.length - 1).text(site.name);
		    this.select.append(option);
		}

		this.select.on('change', function() {
		    this.currentSite = this.sites[this.select.val()];
		    this.refresh();
		}.bind(this));

        setTimeout(function() {
            this.refresh();
        }.bind(this), 0);
	};

    CEWindowSites.prototype.getCurrent = function() {
        return this.currentSite;
    };

    CEWindowSites.prototype.setCwd = function(path) {
        this.currentSite.cwd = path;
        CEApp.config.set('sites.' + this.currentSite.n, this.currentSite);
    };

    CEWindowSites.prototype.refresh = function() {
	    CEApp.filelist.cd(this.currentSite.cwd);
    };

	window.CEWindowSites = CEWindowSites;

}());

