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
    //TODO optimiser mais possible perte de clarte du code
    var keywords = function (nodes){
        var words = [];
        var links = [];
        // recuperation des mots clefs
        nodes.forEach(function(node){
           if(node.keywords){
               words = _.union(words, node.keywords);
           }
        });

        // creation des liens
        words.forEach(function(word){
          // recuperation des node en rapport avec le mot
          var toBind =  _.filter(nodes, function(node){
             return _.contains(node.keywords, word);
          });
          // creation des liens
          toBind.forEach(function(node1){
              toBind.forEach(function(node2){
                 if(node1 !== node2){
                     var link = _.find(links, function(link){
                        var isNodes = (link.source == node1 && link.target === node2)
                         || (link.source == node2 && link.target == node1);
                        return isNodes;
                     })
                     if(!link){
                         links.push({source: node1, target: node2, keywords : [word]})
                     }
                     else if(!_.contains(link.keywords, word)){
                         link.keywords.push(word);
                     }
                 }
              });
          });
        });

        return links;
    };

    Startups.root = root;
    Startups.keywords = keywords;
})();