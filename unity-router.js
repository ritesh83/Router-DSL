/**
 * Customized Router object for use in Unity applications. Provides the ability
 * to define navigation items for routes.
 *    
 * @class Unity Router
 */
import Ember from 'ember';

var moduleNavigation = Ember.Object.create();

var Router = Ember.Router.extend({
    moduleNavigation: moduleNavigation
});

var route = Ember.RouterDSL.prototype.route;

Ember.RouterDSL.prototype.parentNav = function(label, className, weight) {
    var parentNavObj = Ember.Object.create();
    
    parentNavObj.set('label', label);
    parentNavObj.set('className', className);
    parentNavObj.set('weight', weight);

    return parentNavObj;
};

Ember.RouterDSL.prototype.route = function(name, options) {
    
    // populate nav object
    if(typeof options === "object" && options['navLabel']) {
        var parentNavObj = null;
        
        if(options['parentNav']) {
            var parentNavLabel = options['parentNav']['label'];
            var parentNavClassName = options['parentNav']['className'];
            var parentNavWeight = options['parentNav']['weight'];

            parentNavObj = moduleNavigation.get(parentNavLabel);
            if(!parentNavObj) {
                parentNavObj = Ember.Object.create();
                parentNavObj.setProperties({label: parentNavLabel, className: parentNavClassName, weight: parentNavWeight});
                moduleNavigation.set(parentNavLabel, parentNavObj); 
            }

            if(!parentNavObj.get('children')) {
                parentNavObj.set('children', Ember.A());
            }
        }
        
        var className = null;
        if(options['className']) {
            className = options['className'];
        }

        var acl = null;
        if(options['acl']) {
            acl = options['acl'];
        }

        var weight = null;
        if(options['weight']) {
            weight = options['weight'];
        }

        var navObj = Ember.Object.create();
        navObj.setProperties({label: options['navLabel'], route: name, className: className, acl: acl, weight: weight});

        if(parentNavObj) {
            parentNavObj.get('children').push(navObj);
        } else {
            moduleNavigation.set(name, navObj);
        }
    }

    route.apply(this, arguments);
};

export default Router;
