pragma solidity ^0.4.0;
//smart contract for bitscreen MVP - for the art gallery plan


//prev called ballot
contract Bitscreen {
//custom types

    //from https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes
    //simply contains an IPFS address
    struct IPFSHash {
    bytes32 hash;
    uint8 hashFunction;
    uint8 size;
    }
    
    //state type
    struct ScreenData {
    string currFundDest; //init state needs to be empty
    uint currLargestAmount; //init state needs to be 0
    address currHolder;
    }//note: currFundDest may perform better as a bytes32 type, because a very long string may use a lot of gas.

//contract variables

    //creator of the contract
    address public owner;
    
    //current ipfs hash 
    IPFSHash public currPicHash;
    
    //current state of the screen
    ScreenData public screenstate;



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
    function Bitscreen(bytes32 _ipfsHash, uint8 _ipfsHashFunc, uint8 _ipfsHashSize) public {
        owner = msg.sender;
        currPicHash = IPFSHash(_ipfsHash,_ipfsHashFunc,_ipfsHashSize);
        screenstate = ScreenData("",0, msg.sender);
    }
    
    //delete and get eth back
    function remove() public {
        if(msg.sender == owner) { // Only let the contract creator do this
        selfdestruct(owner); // Makes contract inactive, returns funds
        }
    }


    function changeBid(bytes32 _ipfsHash, uint8 _ipfsHashFunc, uint8 _ipfsHashSize, string _dest) payable external {
            if(msg.value>screenstate.currLargestAmount) {
                screenstate.currLargestAmount=msg.value;
                screenstate.currHolder=msg.sender;
                screenstate.currFundDest= _dest;

                currPicHash.hash=_ipfsHash;
                currPicHash.hashFunction=_ipfsHashFunc;
                currPicHash.size=_ipfsHashSize;
                
            }else {
                revert();
            }
    }  

    //fallback func to accept eth directly
    function () payable public {}

}