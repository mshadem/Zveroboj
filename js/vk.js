function VK_start () {
    VK.addCallback("onApplicationAdded", VK_allowSettings);
    VK.addCallback("onSettingsChanged", VK_allowSettings);

    VK.init(function() {
        VK.api("isAppUser", {}, function(data) { 
            if (data.response == 0) {
                VK.callMethod("showInstallBox");   
            }
        }); 
    });
};

function VK_allowSettings () {
    VK.api("getUserSettings", function(data) {
        if (data.response != 3) {
            VK.callMethod("showSettingsBox", 3);   
        } else {
            prepare ();
        }
    });
};

function VK_friends_getAppUsers () {
    VK.api("friends.getAppUsers", function(data) {
        //var obj = JSON && JSON.parse(data) || $.parseJSON(data);
        //if (obj && obj.count > 0) {
            alert(data)
            alert(data.count)
        };   
    });  
};