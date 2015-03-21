import config from './config/environment';
import UnityRouter from 'unity-router/unity-router';

var Router = UnityRouter.extend({
    location: config.locationType
});

Router.map(function() {
    var settingsParentNav = this.parentNav("Settings", "icon-cog", "3");

    this.route('actions', {navLabel: "Actions", parentNav: settingsParentNav, acl: "actions.read"}, function() {
        this.route('add');
        this.route('edit', { path: '/:id/edit' });
    });

    this.route('cabin-classes', {navLabel: "Cabin Classes", parentNav: settingsParentNav, acl: "cabinclasses.read"}, function() {
        this.route('add');
        this.route('edit', { path: '/:id/edit' });
    });

    this.route('routes', {navLabel: "Routes", parentNav: settingsParentNav}, function() {
        this.route('add');
        this.route('edit', { path: '/:id/edit' });
    }); 
    
    this.route('events', {navLabel: "Events", className: "icon-calendar", acl: "events.read", weight: "2"}, function() {
        this.route('add');
        this.route('edit', { path: '/:id/edit' });
        this.route('view', { path: '/:id' });
        this.route('delete');
    });

    var exportParentNav = this.parentNav("Export", "icon-export", "4");

    this.route('loadables', {navLabel: "Loadables", parentNav: exportParentNav}, function() {
        this.route('generate');
        this.route('loadable', { path: '/:id' }, function() {
            this.route('deploy');
        });
    });

    this.route('aircraft-content', {navLabel: "Aircraft Content Report", parentNav: exportParentNav, acl: "loadables.cds"});

    this.route('loading');

    this.route('timelines', {navLabel: "Timelines", className: "icon-hourglass", acl: "timelines.read", weight: "1"}, function() {       
        this.route('edit', { path: '/:id/edit' });
        this.route('events', { path: '/:id/events' }, function() {           
            this.route('edit', { path: '/:event_id/edit' });
        });
        this.route('handle', { path: '/:id/handle' }, function() {            
            this.route('edit', { path: '/edit' });
        });
        this.route('routes', { path: '/:id/routes' }, function() {
            this.route('add', { path: 'add' });
            this.route('edit', { path: 'edit' });
        });
    });

    this.route('403');
});

export default Router;
