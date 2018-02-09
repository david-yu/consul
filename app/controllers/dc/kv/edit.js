import Controller from '@ember/controller';
import { computed } from '@ember/object';

import { get as getter } from '@ember/object';

import put from 'consul-ui/lib/request/put';
import del from 'consul-ui/lib/request/del';

export default Controller.extend({
  isLoading: false,
  isLockedOrLoading: computed.or('isLoading', 'isLocked'),
  needs: ["dc"],
  // dc: computed.alias("controllers.dc"),
  actions: {
    // Updates the key set as the model on the route.
    updateKey: function() {
      var controller = this;
      controller.set('isLoading', true);
      var dc = this.get('dc');//.get('datacenter');
      var key = this.get("model");
      // Put the key and the decoded (plain text) value
      // from the form.
      put("/v1/kv/" + getter(key, 'Key'), dc, getter(key, "valueDecoded")).then(function(response) {
        // If success, just reset the loading state.
        controller.set('isLoading', false);
      }).fail(function(response) {
        // Render the error message on the form if the request failed
        controller.set('errorMessage', 'Received error while processing: ' + response.statusText);
      });
    },
    cancelEdit: function() {
      this.set('isLoading', true);
      this.transitionToRoute('kv.show', this.getParentKeyRoute());
      this.set('isLoading', false);
    },
    deleteKey: function() {
      var controller = this;
      controller.set('isLoading', true);
      var dc = controller.get('dc');//.get('datacenter');
      var key = controller.get("model");
      var parent = controller.getParentKeyRoute();
      // Delete the key
      del("/v1/kv/" + key.get('Key'), dc).then(function(data) {
        controller.transitionToNearestParent(parent);
      }).fail(function(response) {
        // Render the error message on the form if the request failed
        controller.set('errorMessage', 'Received error while processing: ' + response.statusText);
      });
    }
  }
});
