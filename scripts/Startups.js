/**
 * Created by Adrien on 30/06/2014.
 */
var Startups = {};
(function () {
    var root = function (startups) {
        var rootNode = {
            name: '',
            children: []
        };
        startups.forEach(function (startup) {
            var category = _.find(rootNode.children,
                function (category) {
                    return category.name === startup.category
                });
            if (!category) {
                category = {
                    name: startup.category,
                    children: []
                }
                rootNode.children.push(category);
            }
            category.children.push(startup);
        });

        return rootNode;
    };
    var keywords = function (nodes){

    };

    Startups.root = root;
})();