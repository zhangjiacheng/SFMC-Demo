<script runat="server">
  
    Platform.Load("Core", "1");
   
    var fname = Variable.GetValue("@fname");
    var lname = Variable.GetValue("@lname");
    var email = Variable.GetValue("@email");
    var orderProduct = Variable.GetValue("@orderProduct");
    var orderQuantity = Variable.GetValue("@orderQuantity");
    var orderAmount = Variable.GetValue("@orderAmount");
    if( (email != '' && email != undefined && email != null) && (lname != '' && lname != undefined && lname != null) ) {
      Write(' 2-- email: '+ email + '\n'); 
      var payload = {
          "grant_type": "client_credentials",
          "client_id" : "dfadfdxxx", 
          "client_secret" : "xxdfaeexxx"
        };
        //---- 1 Get the accessToken and service URL
        var authorURL = "https://xxx-dadad-dm.auth.marketingcloudapis.com/v2/token";
        var result = HTTP.Post(authorURL, 'application/json', Stringify(payload));
        
        if(result.StatusCode == 200){
          
          var responseJson = Platform.Function.ParseJSON(result.Response[0]);
          var accessToken = responseJson.access_token;
          var restURL = responseJson.rest_instance_url;
          //--- 2 post the contact through the rest API
          var postURL = restURL + 'interaction/v1/events';
          Write(' 5-- postURL : '+ postURL + '\n'); 
          var payloadA = {
            "ContactKey" : email+'.contactkey',
            "EventDefinitionKey" : "APIEvent-dafd-2023-d8dc-8c9a-dad",
            "Data" : {
              "Email" : email,
              "FirstName" : fname,
              "LastName" : lname,
              "IsPurchased" : "False",
              "OrderProduct" : orderProduct,
              "orderQuantity" : orderQuantity,
              "orderAmount" : orderAmount,
              'SubscriberKey': email+'.contactkey',
              "OrderId": Platform.Function.GUID()
             }
           };
           
          Write(' 6-- payloadA : '+ Stringify(payloadA) ); 
          var headNames1 = ["Authorization"];
          var headValues1 = ["Bearer " + accessToken];
          HTTP.Post(postURL, 'application/json', Stringify(payloadA), headNames1, headValues1);
          
        }

    }
  
</script>