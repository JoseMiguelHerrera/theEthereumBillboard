pragma solidity ^0.4.0;

contract Bitscreen {
//custom types

    //simply contains an IPFS address
    struct IPFSHash {
    bytes32 hash;
    uint8 hashFunction;
    uint8 size;
    }
    event ImageChange(bytes32 _hash,uint8 _hashFunction,uint8 _size);

    
    //state type
    struct ScreenData {
    uint currLargestAmount;
    uint totalRaised;
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

    

    //contract variables

    //creator of the contract
    address public owner;
    
    //current ipfs hash 
    IPFSHash public currPicHash;
    
    //current state of the screen
    ScreenData public screenstate;
    ContentRules public rules;



//NEEDED FUNCTIONS:
    //initialization/contructor FUNCTION
    //receive tx FUNCTION
        //check if valid tx FUNCTION
        //write current state FUNCTION
    //withdraw funds FUNCTION


    //initiator/contructor
    //initiate the default IPFS hash using https://www.reddit.com/r/ethdev/comments/6lbmhy/a_practical_guide_to_cheap_ipfs_hash_storage_in/
    //the default pic now is the spongebob one:
    //ipfs hash: QmVju7FfeucrNEzamVjzXGUW4WZeFLaAsjeKtP2Dthi62y
    //in hex: 12 20 6DF672BCC2CF6DDE42E4E648C94F8546C8E189AC2317AB5AB5596630B3CB956E
    //bytes memory defaulthash = hex"6DF672BCC2CF6DDE42E4E648C94F8546C8E189AC2317AB5AB5596630B3CB956E";
    //18
    //32
    function Bitscreen(bytes32 _ipfsHash, uint8 _ipfsHashFunc, uint8 _ipfsHashSize, uint8 _heightRatio, uint8 _widthRatio, string _country) public {
        owner = msg.sender;
        currPicHash = IPFSHash(_ipfsHash,_ipfsHashFunc,_ipfsHashSize);
        screenstate = ScreenData(0,0, msg.sender,_heightRatio,_widthRatio,_country);
        rules = ContentRules(false,false,false,false,false);
    }
    
    //delete and get eth back
    function remove() public {
        if(msg.sender == owner) { // Only let the contract creator do this
        selfdestruct(owner); // Makes contract inactive, returns funds
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


    function changeBid(bytes32 _ipfsHash, uint8 _ipfsHashFunc, uint8 _ipfsHashSize) payable external {
            if(msg.value>screenstate.currLargestAmount) {
                screenstate.currLargestAmount=msg.value;
                screenstate.currHolder=msg.sender;
                screenstate.totalRaised+=msg.value;

                currPicHash.hash=_ipfsHash;
                currPicHash.hashFunction=_ipfsHashFunc;
                currPicHash.size=_ipfsHashSize;
                
                ImageChange(_ipfsHash,_ipfsHashFunc,_ipfsHashSize);
                
            }else {
                revert();
            }
    }  

    //fallback func to accept eth directly
    function () payable public {}

}