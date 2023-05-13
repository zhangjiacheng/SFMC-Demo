<script runat="server" language="JavaScript">
Platform.Load("core", "1.1.1");
try{
    
    // Use the external key of the DE
    var records = DataExtension.Init("3E20B286-6879-4354-895B-1E569531A1F6"); 
    // Retrive the records from the DE that need to be pushed CRM 
    var data = records.Rows.Retrieve({Property:"Flag",SimpleOperator:"equals",Value:0}); 
    var datalength = data.length;
    
    for (var i = 0 ; i < data.length ; i ++) {

        //construct the string for the AMPScript function CreateSalesforceObject to push the DE record to CRM
        var sf_fieldUpdateString = [];
        sf_fieldUpdateString.push('FirstName');
        sf_fieldUpdateString.push(data[i].FirstName);
        sf_fieldUpdateString.push('LastName');
        sf_fieldUpdateString.push(data[i].LastName);
        sf_fieldUpdateString.push('Email');
        sf_fieldUpdateString.push(data[i].Email);
        sf_fieldUpdateString.push('Phone');
        sf_fieldUpdateString.push(data[i].Phone);
        sf_fieldUpdateString.push('Company');
        sf_fieldUpdateString.push(data[i].Company);
        sf_fieldUpdateString.push('Score__c');
        sf_fieldUpdateString.push(data[i].Score);
        
        // Push the DE record to CRM (Lead Object of CRM)
        var updateSFObject = "";
        updateSFObject += "\%\%[ ";
        updateSFObject += "set @LeadId = CreateSalesforceObject('Lead',6,";
        updateSFObject += "'" +  sf_fieldUpdateString.join("','") + "'";
        updateSFObject += ") ";
        updateSFObject += "output(concat(@LeadId)) ";
        updateSFObject += " ]\%\%";
        Platform.Function.TreatAsContent(updateSFObject);

        // Update the record of the DE after the record pushed to CRM
        records.Rows.Update({LeadId:Platform.Variable.GetValue("@LeadId")}, ['Email'], [data[i].Email]);
        records.Rows.Update({Flag:'1'}, ['Email'], [data[i].Email]);
    }
}
catch(error) {
    Write(Stringify(error));
}
</script>