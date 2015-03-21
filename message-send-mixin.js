/**
 * Sends router-related messages to the chrome.
 * 
 * @class Message Send Mixin
 */

// TODO: Use the unity-message-event addon and the extend send mixin within it.

import Ember from 'ember';

export default Ember.Mixin.create({
  
    /**
     * Sends nav message for the module for the chrome.
     * 
     * @method sendNavMessage
     */
    sendNavMessage: function() {
        var moduleNavObj = this.container.lookup('router:main').get('moduleNavigation');  
        
        window.addEventListener("message", this, false);
        
        var self = this;

        // filtered nav object
        var sendModuleNavObj = Ember.Object.create();

        sendModuleNavObj.set("legacy", false);
        
        Object.keys(moduleNavObj).forEach(function(navKey) {
            var navObj = moduleNavObj[navKey];

            if(navObj.get('children')) {
                var tmpNavObj = Ember.Object.create();
                
                tmpNavObj.set("className", navObj.get("className"));
                tmpNavObj.set("label", navObj.get("label"));
                tmpNavObj.set("weight", navObj.get("weight"));
                
                var tmpChildren = Ember.A();
                tmpNavObj.set("children", tmpChildren);
                
                var navChildren = navObj.get('children');
                for(var j=0; j<navChildren.length; j++) {
                    var subNavObj = navChildren[j];
                    if(subNavObj.get('acl')) {
                        if(self._checkPermission(subNavObj)) {                            
                            tmpChildren.push(subNavObj);       
                        }   
                        delete subNavObj['acl'];             
                    } else {                        
                        tmpChildren.push(subNavObj);       
                    }
                }

                // Add main nav object only if some of its children have permission
                if(tmpChildren.length > 0) {
                    sendModuleNavObj.set(navKey, tmpNavObj);
                } 

            } else {
                if(navObj.get("acl")) {                    
                    if(self._checkPermission(navObj)) {                        
                        sendModuleNavObj.set(navKey, navObj);
                    }
                    delete navObj['acl'];
                } else {                    
                    sendModuleNavObj.set(navKey, navObj);
                }
            }
        });
        
        // send message
        var message = {"type" : "unity", "name" : "nav-register", "data" : sendModuleNavObj, "source" : "module"};          
        window.parent.postMessage(JSON.stringify(message), "*");
    },

    /**
     * Used by sendNavMessage()
     * 
     * @method _checkPermission
     * @param  {Object} navObj
     */
    _checkPermission: function(navObj) {
        var userAcl = this.get('aclService');  
            
        var aclValue = navObj.get('acl');
        var aclResources = this._createAclResources(aclValue);
        if(userAcl.isAllowed(aclResources)) {
            return true;
        }

        return false;
    },

    /**
     * Used by sendNavMessage()
     * 
     * @method _createAclResources
     * @param  {String} navAclValue
     * @return {Array}
     */
    _createAclResources: function(navAclValue) {
        var resources = navAclValue;
        if(resources) {
            resources = resources.replace(/\s+/g, '');
            resources = resources.split(",");
        }

        var resourcesList = Ember.A();
        for(var i=0; i<resources.length; i++) {
            var resourceObj = Ember.Object.create();
            resourceObj.set("resource", resources[i]);       

            resourcesList.push(resourceObj);
        }
        
        return resourcesList;
    }
});