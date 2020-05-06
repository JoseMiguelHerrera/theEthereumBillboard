pragma solidity ^0.4.0;
// compile with 0.4.20+commit.3155dd80.Emscripten.clang
//note, we can consider 1 block = 14s if I experiment with blocktime stuff
contract Bitscreen {
//custom types

    //simply contains an IPFS address
    struct IPFSHash {
    bytes32 hash;
    uint8 hashFunction;
    uint8 size;
    }
    event ImageChange(bytes32 _hash,uint8 _hashFunction,uint8 _size, uint _cost);
    event PriceChange(uint price);
    
    //state type
    struct ScreenData {
    uint currTopBid;
    uint currTopBidTimeStamp;
    uint lifetimeValue; //total eth that has gone into contract (historical)
    uint periodPercentagePriceDecrease;
    uint PriceDecreasePeriodLengthSecs;
    address currHolder;
    uint8 heightRatio;
    uint8 widthRatio;
    string country;
    }
    

    struct ContentRules {
        bool sexual;
        bool violent;
        bool political;
        bool controversial;
        bool illegal; //content that goes agaisnt the law of the country it is operating in
    }
    
    event RuleChange(bool _sexual,bool _violent,bool _political,bool _controversial,bool _illegal);

    //struct containing info about an ad buyer
    struct AdBuyerInfo{
        uint numberAdBuys;
        bool cashedOut;
    }
    
    struct DividendInfo{
        uint  activeAdBuysForDividend; //gets lowered (according to their numberAdBuys) when someone cashes out
        uint  ownerpool;
        uint  dividendPool;
        mapping(address => AdBuyerInfo) adbuyerMap;
    }
    

    //contract variables

    //creator of the contract
    address public owner;
    
    //total eth currently in contract
    uint public contractValue;

    //current ipfs hash 
    IPFSHash public currPicHash;
    
    //current state of the screen
    ScreenData public screenstate;
    ContentRules public rules;
    address[] private badAddresses;
    
    //current dividend info
    DividendInfo public dividendinfo;

    function Bitscreen(bytes32 _ipfsHash, uint8 _ipfsHashFunc, uint8 _ipfsHashSize, uint8 _heightRatio, uint8 _widthRatio, string _country, uint _periodPercentagePriceDecrease,uint _priceDecreasePeriodLengthSecs) public {
        owner = msg.sender;
        currPicHash = IPFSHash(_ipfsHash,_ipfsHashFunc,_ipfsHashSize);
        screenstate = ScreenData(0,now,0,_periodPercentagePriceDecrease,_priceDecreasePeriodLengthSecs,msg.sender,_heightRatio,_widthRatio,_country);
        rules = ContentRules(false,false,false,false,false);
        dividendinfo=DividendInfo(0,0,0);
    }
    
    //delete and get eth fallback
    //for 2.0 this needs to be gone in production
    function remove() public {
        if(msg.sender == owner) { // Only let the contract creator do this
        selfdestruct(owner); // Makes contract inactive, returns funds
        }
    }
    
    
    function withdrawOwnerAmount() external{
        if(msg.sender == owner) { // Only let the contract creator do this
            uint withdrawAmount = dividendinfo.ownerpool;
            dividendinfo.ownerpool=0;
            contractValue-=withdrawAmount;
            msg.sender.transfer(withdrawAmount);
        }else{
            revert();
        }
    }
    
    
    //request to know how much dividend you can get
    function inquireDividentAmount()  view external returns(uint){
        uint dividendToSend=calcuCurrTxDividend(msg.sender);
        return dividendToSend;
    }
    
    function withdrawDividend() external{
        uint dividendToSend=calcuCurrTxDividend(msg.sender);
        if(dividendToSend==0){
            revert();
        }else{
        //UPON CASHOUT REMEMBER TO:
        //LOWER activeAdBuysForDividend
        uint senderNumAdbuys=dividendinfo.adbuyerMap[msg.sender].numberAdBuys;
        dividendinfo.activeAdBuysForDividend-=senderNumAdbuys;
        //DECREASE dividendPool BY CALCULATED DIVIDEND 
        dividendinfo.dividendPool-=dividendToSend;
        //DECREASE AMOUNT THAT TOTAL CONTRACT HOLDS BY CALCULATED DIVIDEND
        contractValue-=dividendToSend;
        //SET PERSON TO CASHED OUT
        dividendinfo.adbuyerMap[msg.sender].cashedOut=true;
        //SET ACCUMULATED AD BUYS TO 0 SO THEY CAN JOIN AGAIN
        dividendinfo.adbuyerMap[msg.sender].numberAdBuys=0;
        
        //send
        msg.sender.transfer(dividendToSend);
        }
    }
    
    function calcuCurrTxDividend(address dividentRecepient) view private returns(uint) {
        //pseudocode
        /*dividend = (dividendPool*#adbuysfromperson)/(activeAdBuysForDividend)*/
        
        //if dividentRecepient is not in mapping, should return 0;
        uint totaldividend;
        if(dividendinfo.activeAdBuysForDividend==0 || dividendinfo.adbuyerMap[dividentRecepient].cashedOut){ //everyone cashed out or person cashed out 
            totaldividend=0;
        }else{
            totaldividend=(dividendinfo.dividendPool*dividendinfo.adbuyerMap[dividentRecepient].numberAdBuys)/(dividendinfo.activeAdBuysForDividend);
        }
        return totaldividend;
    }
    
    function getBadAddresses() external constant returns (address[]) {
        if(msg.sender == owner) { // Only let the contract creator do this
            return badAddresses;
        }else{
            revert();
        }
    }

    function changeRules(bool _sexual,bool _violent, bool _political, bool _controversial, bool _illegal) public {
                if(msg.sender == owner) { // Only let the contract creator do this
                rules.sexual=_sexual;
                rules.violent=_violent;
                rules.political=_political;
                rules.controversial=_controversial;
                rules.illegal=_illegal;
                
                RuleChange(_sexual,_violent,_political,_controversial,_illegal);
                
                }else{
                revert();
                }
    }


    //assumption: this can be caleld without gas - like a getter
    function calculateCurrDynamicPrice() public view returns (uint){
        uint currDynamicPrice;
        uint periodLengthSecs=screenstate.PriceDecreasePeriodLengthSecs;
        
        uint ellapsedPeriodsSinceLastBid= (now - screenstate.currTopBidTimeStamp)/periodLengthSecs;
        
        uint totalDecrease=((screenstate.currTopBid*screenstate.periodPercentagePriceDecrease*ellapsedPeriodsSinceLastBid)/100);
        
        if(totalDecrease>screenstate.currTopBid){
            currDynamicPrice=0;
        }else{
            currDynamicPrice= screenstate.currTopBid-totalDecrease;
        }
        
        return currDynamicPrice;
        
    }

    function truncToThreeDecimals(uint amount) private pure returns (uint){
        return ((amount/1000000000000000)*1000000000000000);
    }


    //note: weighing the dividends by # of participations is prone to abuse if there is no minimum bid size, in the lens of decimal places... how to get around that?
    function changeBid(bytes32 _ipfsHash, uint8 _ipfsHashFunc, uint8 _ipfsHashSize) payable external {
        
            uint dynamicPrice=calculateCurrDynamicPrice();
        
            if(msg.value>dynamicPrice) { //prev: msg.value>screenstate.currTopBid
            
                //check if this bid meets the minimum bidrequirement, an increase by 0.001
                if(truncToThreeDecimals(msg.value)-truncToThreeDecimals(dynamicPrice)<1000000000000000){
                    revert();
                }else{
                    
                screenstate.currTopBid=msg.value;
                screenstate.currTopBidTimeStamp=now;
                screenstate.currHolder=msg.sender;
                
                screenstate.lifetimeValue+=msg.value;
                contractValue+=msg.value;//total eth CURRENTLY IN contract
                //store 33% to dividend pool, send 66% to ownerpool
                dividendinfo.dividendPool+=msg.value/3;
                dividendinfo.ownerpool+=((msg.value*2)/3);
                
                currPicHash.hash=_ipfsHash;
                currPicHash.hashFunction=_ipfsHashFunc;
                currPicHash.size=_ipfsHashSize;
                
                dividendinfo.activeAdBuysForDividend++;
                if(dividendinfo.adbuyerMap[msg.sender].numberAdBuys==0){
                    //first time seeing this sender (or starting again after cashout)
                    dividendinfo.adbuyerMap[msg.sender]=AdBuyerInfo(1,false);
                }else{
                    dividendinfo.adbuyerMap[msg.sender].numberAdBuys++;
                }
                
                ImageChange(_ipfsHash,_ipfsHashFunc,_ipfsHashSize,screenstate.currTopBid);
                
                }
                
            }else {
                revert();
            }
    }
    
    function emergencyOverwrite(bytes32 _ipfsHash, uint8 _ipfsHashFunc, uint8 _ipfsHashSize) external {
        if(msg.sender == owner) { // Only let the contract creator do this
            badAddresses.push(screenstate.currHolder);
            currPicHash.hash=_ipfsHash;
            currPicHash.hashFunction=_ipfsHashFunc;
            currPicHash.size=_ipfsHashSize;
            screenstate.currHolder=msg.sender;
            ImageChange(_ipfsHash,_ipfsHashFunc,_ipfsHashSize,0);
        }else{
            revert();
        }
    }
    
    function changePriceDecreasePeriod(uint newPeriod) public{
        require(msg.sender==owner);
        screenstate.PriceDecreasePeriodLengthSecs=newPeriod;
    }
    
    function changePriceDecreasePercent(uint newPercent) public{
        require(msg.sender==owner);
        screenstate.periodPercentagePriceDecrease=newPercent;
    }
    
    
    //fallback func to accept eth directly
    function () payable public {}

}