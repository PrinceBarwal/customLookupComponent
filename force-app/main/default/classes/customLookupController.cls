public with sharing class customLookupController {
    @AuraEnabled(cacheable = true)
    public static List<sobject> fetchLookupData(String searchKey, String objectApiName) {
        List<sobject> sObjectList = new List<sObject>();
        if(String.isBlank(searchKey)){
            return sObjectList;
        }else{
            String key = '%' + searchKey + '%';
            String query = 'Select id, Name from ' + objectApiName + ' where name Like :key order by Name limit 5';
            sObjectList = Database.query(query, AccessLevel.USER_MODE);
            return sObjectList;
        }
    }
}