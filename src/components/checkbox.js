var fs = require('fs');
module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(formioComponentsProvider) {
      formioComponentsProvider.register('checkbox', {
        title: 'Check Box',
        template: 'formio/components/checkbox.html',
        tableView: function(data) {
          return data ? 'Yes' : 'No';
        },
        controller: ['$scope', '$timeout', function($scope, $timeout) {
          if ($scope.builder) return;
          var boolean = {
            true: true,
            false: false
          };
          var defaultValue = $scope.component.hasOwnProperty('defaultValue')
            ? boolean[$scope.component.defaultValue] || false
            : false;

          // On the first load, attempt to set the default value.
          $scope.data[$scope.component.key] = boolean[$scope.data[$scope.component.key]] || defaultValue;

          // FA-850 - Ensure the checked value is always a boolean object when loaded, then unbind the watch.
          $scope.$watch('data.' + $scope.component.key, function() {
            if (!$scope.data || !$scope.component.key) return;

            // If the component is required, and its current value is false, delete the entry.
            if (
              $scope.component.validate
              && $scope.component.validate.required
              && (boolean[$scope.data[$scope.component.key]] || false) === false
            ) {
              $timeout(function() {
                delete $scope.data[$scope.component.key];
              });
            }
          });
        }],
        settings: {
          input: true,
          inputType: 'checkbox',
          tableView: true,
          // This hides the default label layout so we can use a special inline label
          hideLabel: true,
          label: '',
          datagridLabel: true,
          key: 'checkboxField',
          defaultValue: false,
          protected: false,
          persistent: true,
          clearOnHide: true,
          validate: {
            required: false
          }
        }
      });
    }
  ]);
  app.run([
    '$templateCache',
    function($templateCache) {
      $templateCache.put('formio/components/checkbox.html',
        fs.readFileSync(__dirname + '/../templates/components/checkbox.html', 'utf8')
      );
    }
  ]);
};
