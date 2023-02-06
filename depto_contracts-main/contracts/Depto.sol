// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import {MarketAPI} from "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import {CommonTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/CommonTypes.sol";
import {MarketTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";
import {Actor} from "@zondax/filecoin-solidity/contracts/v0.8/utils/Actor.sol";
import {Misc} from "@zondax/filecoin-solidity/contracts/v0.8/utils/Misc.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./governance/GovernorContract.sol";

/* 
Contract Usage
    Step   |   Who   |    What is happening  |   Why 
    ------------------------------------------------
    Deploy | contract owner   | contract owner deploys address is owner who can call addCID  | create contract setting up rules to follow
    AddCID | data pinners     | set up cids that the contract will incentivize in deals      | add request for a deal in the filecoin network, "store data" function
    Fund   | contract funders |  add FIL to the contract to later by paid out by deal        | ensure the deal actually gets stored by providing funds for bounty hunter and (indirect) storage provider
    Claim  | bounty hunter    | claim the incentive to complete the cycle                    | pay back the bounty hunter for doing work for the contract
*/
contract Depto is ERC721URIStorage, Ownable {
    struct PatentStorageDeal {
        bytes cidraw;
        uint size;
        address proposer;
        address patentClaimer;
        bool set;
        uint mintedAt;
    }
    mapping(bytes => PatentStorageDeal) public patents;
    mapping(bytes => mapping(uint64 => bool)) public cidProviders;
    mapping(address => uint256) public rewards;
    uint256 public currentApprovedPatentCount;
    mapping(address => uint256) validationClaim;

    uint public currentTokenId;

    address constant CALL_ACTOR_ID = 0xfe00000000000000000000000000000000000005;
    uint64 constant DEFAULT_FLAG = 0x00000000;
    uint64 constant METHOD_SEND = 0;

    GovernorContract governorContract;

    uint256 public constant VERIFIER_FEE = 215053763440000000;
    uint256 public constant VALIDATOR_FEE = 4301075260000000;
    uint256 public constant SP_FEE = 645161290320000000;
    uint256 public constant GOVERNMENT_FEE = 667741935480000000;
    uint256 public constant CREATOR_FEE = 300000000000000000;
    uint256 public constant PROPOSAL_FEE = 2000000000000000000;
    uint256 public constant FALSE_CLAIM_FEE = 1000000000000000000;

    address public constant GOVERNMENT_ADDRESS =
        0x5353448037eb0d940f209d47f31DbdDd66237A90;
    address public constant DEPTO_CREATOR_ADDRESS =
        0x5353448037eb0d940f209d47f31DbdDd66237A90;

    constructor(address payable governorContractAddress)
        ERC721("Depto", "DPT")
    {
        governorContract = GovernorContract(governorContractAddress);
        currentApprovedPatentCount = 0;
    }

    receive() external payable {
        rewards[DEPTO_CREATOR_ADDRESS] += msg.value;
    }

    fallback() external payable {
        rewards[DEPTO_CREATOR_ADDRESS] += msg.value;
    }

    function claimFeeRewards() public {
        require(
            governorContract.isDAOMember(msg.sender) ||
                msg.sender == GOVERNMENT_ADDRESS ||
                msg.sender == DEPTO_CREATOR_ADDRESS,
            "Not authorized to claim rewards"
        );
        uint reward = 0;
        bool success;
        bytes memory data;
        if (governorContract.isDAOMember(msg.sender)) {
            if (currentApprovedPatentCount - validationClaim[msg.sender] > 0) {
                reward +=
                    VALIDATOR_FEE *
                    (currentApprovedPatentCount - validationClaim[msg.sender]);
                validationClaim[msg.sender] = currentApprovedPatentCount;
            }
        }
        reward += rewards[msg.sender];
        rewards[msg.sender] = 0;
        require(reward > 0, "No rewards to claim");
        (success, data) = payable(msg.sender).call{value: reward}("");
    }

    function addCID(
        bytes calldata cidraw,
        uint size,
        address verifier,
        address patentClaimer
    ) public payable onlyOwner returns (bool) {
        require(msg.value >= PROPOSAL_FEE, "Invalid");
        patents[cidraw] = PatentStorageDeal(
            cidraw,
            size,
            verifier,
            patentClaimer,
            false,
            0
        );

        return true;
    }

    function falseClaimResolver(
        uint falseTokenId,
        uint appliedTokenId,
        address claimerAddress,
        address falseClaimVerifier
    ) public payable onlyOwner {
        require(
            msg.value >= FALSE_CLAIM_FEE,
            "Not enough fees to resolve claim"
        );
        _requireMinted(falseTokenId);
        _burn(falseTokenId);
        rewards[GOVERNMENT_ADDRESS] = msg.value / 2;
        rewards[DEPTO_CREATOR_ADDRESS] = msg.value / 4;
        rewards[falseClaimVerifier] = msg.value / 4;
    }

    function policyOK(bytes memory cidraw, uint64 provider)
        internal
        view
        returns (bool)
    {
        bool alreadyStoring = cidProviders[cidraw][provider];
        return !alreadyStoring;
    }

    function authorizeData(
        bytes memory cidraw,
        uint64 provider,
        uint size
    ) internal {
        require(patents[cidraw].set, "cid must be added before authorizing");
        require(patents[cidraw].size == size, "data size must match expected");
        require(
            policyOK(cidraw, provider),
            "deal failed policy check: has provider already claimed this cid?"
        );

        cidProviders[cidraw][provider] = true;
    }

    function claim_bounty(uint64 deal_id) public {
        MarketTypes.GetDealDataCommitmentReturn memory commitmentRet = MarketAPI
            .getDealDataCommitment(deal_id);
        MarketTypes.GetDealProviderReturn memory providerRet = MarketAPI
            .getDealProvider(deal_id);

        authorizeData(
            commitmentRet.data,
            providerRet.provider,
            commitmentRet.size
        );

        // get dealer (bounty hunter client)
        MarketTypes.GetDealClientReturn memory clientRet = MarketAPI
            .getDealClient(deal_id);
        patents[commitmentRet.data].set = true;
        patents[commitmentRet.data].mintedAt = block.timestamp;
        // send reward to client
        send(clientRet.client);

        // change state from waiting for SP to Success

        // allot money to everyone
        rewards[GOVERNMENT_ADDRESS] += GOVERNMENT_FEE;
        rewards[patents[commitmentRet.data].proposer] += VERIFIER_FEE;
        rewards[DEPTO_CREATOR_ADDRESS] += CREATOR_FEE;
        currentApprovedPatentCount += 1;

        //mint patent NFT to patent applicant
        _mint(patents[commitmentRet.data].patentClaimer, currentTokenId);
        _setTokenURI(currentTokenId, string(commitmentRet.data));
    }

    function call_actor_id(
        uint64 method,
        uint256 value,
        uint64 flags,
        uint64 codec,
        bytes memory params,
        uint64 id
    )
        public
        returns (
            bool,
            int256,
            uint64,
            bytes memory
        )
    {
        (bool success, bytes memory data) = address(CALL_ACTOR_ID).delegatecall(
            abi.encode(method, value, flags, codec, params, id)
        );
        (int256 exit, uint64 return_codec, bytes memory return_value) = abi
            .decode(data, (int256, uint64, bytes));
        return (success, exit, return_codec, return_value);
    }

    // send 1 FIL to the filecoin actor at actor_id
    function send(uint64 actorID) internal {
        bytes memory emptyParams = "";
        delete emptyParams;

        call_actor_id(
            METHOD_SEND,
            SP_FEE,
            DEFAULT_FLAG,
            Misc.NONE_CODEC,
            emptyParams,
            actorID
        );
    }

    function getAllPatents()
        public
        view
        returns (PatentStorageDeal[] memory _patents)
    {
        for (uint i = 0; i < currentTokenId; i++) {
            _patents[i] = patents[bytes(tokenURI(i))];
        }
    }
}
