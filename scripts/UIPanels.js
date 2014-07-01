/**
 * Created by Adrien on 30/06/2014.
 */
var UIPanels = {};

(function(){
    var suAdresse = $('.su_panel.left h3');
    var description = $('.description');

    UIPanels.changeStartup = function(startup){
        $('.su_panel.left h2').text(startup.name);
    };
})();