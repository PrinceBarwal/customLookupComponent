import { LightningElement, wire, api} from 'lwc';
import fetchLookupData from "@salesforce/apex/customLookupController.fetchLookupData";
const DELAY = 1000;
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class MultiCustomLookup extends LightningElement {
    searchKey;
    @api objectApiName = 'Account';
    hasRecord = false;
    searchOutput =[];
    @api label = 'Account';
    @api placeHolder = 'Search Account';
    @api iconName = 'standard:account';
    delayTimeOut;
    selectedRecords = [];

    @wire(fetchLookupData, {
        searchKey : "$searchKey",
        objectApiName : "$objectApiName"
    }) searchResult({data, error}){
        if(data){
            console.log(data);
            this.hasRecord = data.length > 0 ? true : false;
            this.searchOutput = data;
        }
        else if(error){
            console.log(error);
        }
    }

    changeHandler(event){
        clearTimeout(this.delayTimeOut);
        let value = event.target.value;
        this.delayTimeOut = setTimeout(() => {
            this.searchKey = value;
        },DELAY);
    }

    clickHandler(event){
        let recId = event.target.getAttribute("data-recid");
        console.log('recId',recId);
        if(this.validateDuplicate(recId)){
            let selectRecord = this.searchOutput.find(currItem => currItem.Id === recId);
            let pill = {
                type: 'icon',
                label: selectRecord.Name,
                name: recId,
                iconName: this.iconName,
                alternativeText: selectRecord.Name,
            };
            this.selectedRecords = [...this.selectedRecords, pill];
        }
    }

    get showPillContainer(){
        return this.selectedRecords.length > 0 ? true : false;
    }

    handleItemRemove(event) {
        const index = event.detail.index;
        this.selectedRecords.splice(index, 1);
    }

    validateDuplicate(selectedRecord){
        console.log('inside the method');
        let isValid = true;
        // let isRecordAlreadySelected = this.selectedRecords.find(
        //     (currItem) => currItem.name === selectedRecord
        // );
        let isRecordAlreadySelected = this.selectedRecords.some(
            (currItem) => JSON.parse(JSON.stringify(currItem)).name === selectedRecord
        );
        console.log('isRecordAlreadySelected',isRecordAlreadySelected);
        if(isRecordAlreadySelected){
            isValid = false;
            this.dispatchEvent(new ShowToastEvent({
                title: "Error !",
                message: "Pill is Already Selected",
                variant: "error"
            })
        );
        }else{
            isValid = true;
        }
        return isValid;
    }
}