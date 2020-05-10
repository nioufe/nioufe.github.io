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
            if(startup.Nb_tweets!== "" && startup.Nb_followers !== "") {
                if(parseFloat(startup.Nb_follow) !== 0){
                   startup.metric = Math.round(startup.Nb_followers/startup.Nb_follow);
                } else {
                    startup.metric = Math.round(startup.Nb_followers);
                }
                if(startup.metric !== 0) {
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
                }
            }
        });

        return rootNode;
    };
    //TODO optimiser mais possible perte de clarte du code
    var keywords = function (nodes) {
        var words = [];
        var links = [];
        // recuperation des mots clefs
        nodes.forEach(function (node) {
            if (node.keywords) {
                var extractedWords = _.pluck(node.keywords, 'keyword');
                words = _.union(words, extractedWords);
            }
        });

        // creation des liens
        words.forEach(function (word) {
            // recuperation des node en rapport avec le mot
            var toBind = _.filter(nodes, function (node) {
                if (_.findWhere(node.keywords, {keyword: word})) {
                    return true;
                }
                return false;
            });
            // creation des liens
            toBind.forEach(function (node1) {
                toBind.forEach(function (node2) {
                    if (node1 !== node2) {
                        var link = _.find(links, function (link) {
                            var isNodes = (link.source == node1 && link.target === node2)
                                || (link.source == node2 && link.target == node1);
                            return isNodes;
                        })
                        if (!link) {
                            links.push({source: node1, target: node2, keywords: [word]})
                        }
                        else if (!_.contains(link.keywords, word)) {
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