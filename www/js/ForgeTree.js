$(document).ready(function()
    {
        prepareAppBucketTree();
        $('#refreshBuckets').click(function()
        {
            $('#appBuckets').jstree(true).refresh();
        });

        $('#createNewBucket').click(function()
        {
            createNewBucket();
        });

        $('#createBucketModal').on('shown.bs.modal', function()
        {
            $("#newBucketKey").focus();
        });
    }
);

function createNewBucket()
{
    var bucketKey = $('#newBucketKey').val();
    var policyKey = $('#newBucketPolicyKey').val();
    jQuery.post(
        {
            url: '/api/forge/oss/buckets',
            contentType: 'application/json',
            data: JSON.stringify({'bucketKey': bucketKey, 'policyKey': policyKey}),
            success: function (res)
            {
                $('#appBuckets').jstree(true).refresh();
                $('#createBucketModal').modal('toggle');
            },
            error: function(err)
            {
                if (err.status == 409)
                {
                    alert('Bucket already exists - 409: Duplicate');
                }
                console.log(err);
            }
        }
    );
}

function prepareAppBucketTree()
{
    $('#appBuckets').jstree(
        {
            'core':
            {
                'themes': {"icons": true},
                'data':
                {
                    "url": '/api/forge/oss/buckets',
                    "dataType": "json",
                    "multiple": false,
                    "data": function(node)
                    {
                        return {"id": node.id};
                    }
                }
            },
            'types':
            {
                'default':
                {
                    'icon': 'glyphicon glyphicon-question-sign'
                },
                '#':
                {
                    'icon': 'glyphicon glyphicon-folder-open'
                },
                'bucket': 
                {
                    'icon': 'glyphicon glyphicon-folder-open'
                },
                'object': 
                {
                    'icon': 'glyphicon glyphicon-file'
                }
            },
            "plugins": ["types", "state", "sort", "contextmenu"],
            contextmenu: {items: autodeskCustomMenu}
        }
    ).on('loaded.jstree', function()
        {
            $('#appBuckets').jstree('open_all');
        }
    ).bind("activate_node.jstree", function(evt, data)
        {
            if(data != null && data.node != null && data.node.type == 'object')
            {
                $("#forgeViewer").empty();
                var urn = data.node.id;
                getForgeToken(function(access_token)
                    {
                        jQuery.ajax(
                            {
                                url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urn + '/manifest',
                                headers: { 'Authorization': 'Bearer ' + access_token },
                                success: function (res) 
                                {
                                    if (res.status === 'success') launchViewer(urn);
                                    else $("#forgeViewer").html('The translation job still running: ' + res.progress + '. Please try again in a moment.');
                                },
                                error: function(err)
                                {
                                    var msgButton = 'This file is not translated yet! ' +
                                    '<button class="btn btn-xs btn-info" onclick="translateObject()"><span class="glyphicon glyphicon-eye-open"></span> ' +
                                    'Start translation</button>'
                                    $("#forgeViewer").html(msgButton);
                                }
                            }
                        );
                    }
                );
            }
        }
    );
}

function autodeskCustomMenu(autodeskNode)
{
    var items;

    switch(autodeskNode.type)
    {
        case "bucket":
            items =
            {
                uploadFile:
                {
                    label:"Upload file",
                    action: function()
                    {
                        var treeNode = $('#appBuckets').jstree(true).get_selected(true)[0];
                        uploadFile(treeNode);
                    },
                    icon: 'glyphicon glyphicon-cloud-upload'
                }
            };
            break;
        case "object":
            items =
            {
                translateFile: 
                {
                    label: "Translate",
                    action: function () 
                    {
                        var treeNode = $('#appBuckets').jstree(true).get_selected(true)[0];
                        translateObject(treeNode);
                    },
                    icon: 'glyphicon glyphicon-eye-open'
                }
            };
            break;  
        
    }
    return items;
}

function uploadFile(node)
{
    
}